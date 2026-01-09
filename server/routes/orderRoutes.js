import express from 'express';
import mongoose from 'mongoose';
import Customer from '../models/Customer.js';
import Order from '../models/Order.js';
import { generateCustomerId, generateOrderId } from '../utils/idGenerator.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const PDFDocument = require('pdfkit-table');

const router = express.Router();

// Get Revenue Chart Data
router.get('/orders/revenue-chart', async (req, res) => {
  try {
    const { month, year } = req.query;

    // Default to current date if not provided
    const now = new Date();
    const targetMonth = month ? parseInt(month) : now.getMonth() + 1;
    const targetYear = year ? parseInt(year) : now.getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59); // Last day of month

    const pipeline = [
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          orderStatus: { $ne: 'Cancelled' } // Exclude cancelled orders
        }
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          totalRevenue: { $sum: "$totalPrice" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ];

    const stats = await Order.aggregate(pipeline);

    // Fill in missing days with 0
    const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
    const finalData = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const dayStat = stats.find(s => s._id === i);
      finalData.push({
        day: i,
        revenue: dayStat ? dayStat.totalRevenue : 0,
        count: dayStat ? dayStat.count : 0
      });
    }

    res.status(200).json({
      success: true,
      data: finalData,
      month: targetMonth,
      year: targetYear
    });

  } catch (error) {
    console.error('Error fetching revenue chart:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching revenue chart',
      error: error.message
    });
  }
});

// Get Monthly Summary Stats
router.get('/orders/monthly-summary', async (req, res) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const targetMonth = month ? parseInt(month) : now.getMonth() + 1;
    const targetYear = year ? parseInt(year) : now.getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const pipeline = [
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $facet: {
          phaseStats: [
            { $match: { orderStatus: { $ne: 'Cancelled' } } },
            {
              $group: {
                _id: "$phase",
                count: { $sum: 1 },
                revenue: { $sum: "$totalPrice" }
              }
            }
          ],
          statusStats: [
            {
              $group: {
                _id: "$orderStatus",
                count: { $sum: 1 }
              }
            }
          ],
          overview: [
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$totalPrice" }, // Gross revenue including cancelled? Or match !Cancelled first?
                totalOrders: { $sum: 1 }
              }
            }
          ]
        }
      }
    ];

    const results = await Order.aggregate(pipeline);
    const data = results[0]; // Facet returns single doc with arrays

    // Calculate Net Revenue (excluding Cancelled) explicitly for overview if needed, 
    // but phaseStats is already filtered. We can sum phaseStats revenue.
    const netRevenue = data.phaseStats.reduce((acc, curr) => acc + curr.revenue, 0);

    res.status(200).json({
      success: true,
      data: {
        phaseStats: data.phaseStats,
        statusStats: data.statusStats,
        netRevenue
      }
    });

  } catch (error) {
    console.error('Error fetching monthly summary:', error);
    res.status(500).json({ success: false, message: 'Error fetching summary' });
  }
});

// Get Detailed Orders Report (List)
router.get('/orders/report', async (req, res) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const targetMonth = month ? parseInt(month) : now.getMonth() + 1;
    const targetYear = year ? parseInt(year) : now.getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error('Error fetching orders report:', error);
    res.status(500).json({ success: false, message: 'Error fetching report' });
  }
});


// Export PDF Report
router.get('/orders/export/pdf', async (req, res) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const targetMonth = month ? parseInt(month) : now.getMonth() + 1;
    const targetYear = year ? parseInt(year) : now.getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ createdAt: -1 });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    // Set headers
    const filename = `orders-report-${targetYear}-${targetMonth.toString().padStart(2, '0')}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    doc.pipe(res);

    // Header
    doc.fontSize(20).text('NHC SERVICE - Orders Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Period: ${new Date(targetYear, targetMonth - 1).toLocaleString('default', { month: 'long' })} ${targetYear}`, { align: 'center' });
    doc.moveDown();

    // Summary
    doc.fontSize(14).text('Summary');
    doc.fontSize(10).text(`Total Orders: ${totalOrders}`);
    doc.text(`Total Revenue: INR ${totalRevenue.toLocaleString()}`);
    doc.moveDown();

    // Table
    const table = {
      title: "Detailed Transactions",
      headers: [
        { label: "Date", property: "date", width: 60 },
        { label: "Order ID", property: "orderId", width: 60 },
        { label: "Customer", property: "customer", width: 100 },
        { label: "Phase", property: "phase", width: 50 },
        { label: "Qty", property: "qty", width: 40 },
        { label: "Amount", property: "amount", width: 60 },
        { label: "Status", property: "status", width: 70 }
      ],
      datas: orders.map(order => ({
        date: new Date(order.createdAt).toLocaleDateString(),
        orderId: order.orderId || order._id.toString().slice(-6).toUpperCase(),
        customer: order.fullName,
        phase: order.phase,
        qty: order.totalQuantity,
        amount: `INR ${order.totalPrice}`,
        status: order.orderStatus
      }))
    };

    doc.table(table, {
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
      prepareRow: (row, i) => doc.font("Helvetica").fontSize(8)
    });

    doc.end();

  } catch (error) {
    console.error('Error exporting PDF:', error);
    res.status(500).json({ success: false, message: 'Error generating PDF' });
  }
});

// Export CSV Report
router.get('/orders/export/csv', async (req, res) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const targetMonth = month ? parseInt(month) : now.getMonth() + 1;
    const targetYear = year ? parseInt(year) : now.getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ createdAt: -1 });

    const filename = `orders-report-${targetYear}-${targetMonth.toString().padStart(2, '0')}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Manual CSV generation
    const headers = ['Date,Order ID,Customer Name,Phone,Phase,Quantity,Amount,Status'];
    const rows = orders.map(order => [
      new Date(order.createdAt).toLocaleDateString(),
      order.orderId || order._id,
      `"${order.fullName}"`, // Escape quotes
      order.phone,
      order.phase,
      order.totalQuantity,
      order.totalPrice,
      order.orderStatus
    ].join(','));

    // Fix: Join with newline characters correctly for CSV
    const csvContent = [headers, ...rows].join('\n');
    res.send(csvContent);

  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ success: false, message: 'Error generating CSV' });
  }
});


// Create a new order
router.post('/orders', async (req, res) => {
  try {
    const {
      fullName,
      phone,
      periodsStarted,
      cycleLength,
      phase,
      totalQuantity,
      totalWeight,
      totalPrice,
      address,
      paymentMethod,
      message,
      age // Extract age
    } = req.body;

    // Validate required fields
    if (!fullName || !phone || !periodsStarted || !cycleLength || !phase ||
      !totalQuantity || !totalWeight || !totalPrice || !address) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate address fields
    if (!address.house || !address.area || !address.pincode) {
      return res.status(400).json({
        success: false,
        message: 'Missing required address fields (house, area, pincode)'
      });
    }

    // Link Customer & Generate IDs
    let customer = await mongoose.model('Customer').findOne({ phone });
    let currentCustomerId;

    if (customer) {
      // Customer exists
      if (!customer.customerId) {
        // Legacy customer (exists but no ID), generate one now
        customer.customerId = await generateCustomerId();
        await customer.save();
      }
      currentCustomerId = customer.customerId;

      // Update existing customer details
      customer.name = fullName;
      if (age) customer.age = age;

      // Add address if new
      // Simple check to avoid duplicates (optional improvement)
      customer.addresses.push({
        house: address.house,
        area: address.area,
        landmark: address.landmark || '',
        pincode: address.pincode,
        mapLink: address.mapLink || '',
        label: address.label || 'Home'
      });
      // We will push the order ID after saving the order
    } else {
      // Create new customer
      const newCustomerId = await generateCustomerId();
      currentCustomerId = newCustomerId;

      customer = new mongoose.model('Customer')({
        customerId: newCustomerId,
        phone,
        name: fullName,
        age: age || 0,
        addresses: [{
          house: address.house,
          area: address.area,
          landmark: address.landmark || '',
          pincode: address.pincode,
          mapLink: address.mapLink || '',
          label: address.label || 'Home'
        }],
        orders: [] // Will push later
      });
      await customer.save();
    }

    // Generate Order ID based on Customer ID
    const newOrderId = await generateOrderId(currentCustomerId);

    // Create new order
    const order = new Order({
      customerId: currentCustomerId,
      orderId: newOrderId,
      fullName,
      phone,
      periodsStarted: new Date(periodsStarted),
      cycleLength,
      phase,
      totalQuantity,
      totalWeight,
      totalPrice,
      address: {
        house: address.house,
        area: address.area,
        landmark: address.landmark || '',
        pincode: address.pincode,
        mapLink: address.mapLink || '',
        label: address.label || 'Home'
      },
      paymentMethod: paymentMethod || 'Cash on Delivery',
      message: message || '',
      orderStatus: 'Pending'
    });

    // Save to database
    const savedOrder = await order.save();

    // Link order to customer
    customer.orders.push(savedOrder._id);
    await customer.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: savedOrder
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});

// Stats endpoint
router.get('/orders/stats', async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
          pending: { $sum: { $cond: [{ $eq: ["$orderStatus", "Pending"] }, 1, 0] } },
          processing: { $sum: { $cond: [{ $eq: ["$orderStatus", "Processing"] }, 1, 0] } },
          shipped: { $sum: { $cond: [{ $eq: ["$orderStatus", "Shipped"] }, 1, 0] } },
          delivered: { $sum: { $cond: [{ $eq: ["$orderStatus", "Delivered"] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ["$orderStatus", "Cancelled"] }, 1, 0] } }
        }
      }
    ]);

    const result = stats.length > 0 ? stats[0] : {
      totalOrders: 0, totalRevenue: 0,
      pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0
    };

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
});

// Get all orders (with optional filters)
router.get('/orders', async (req, res) => {
  try {
    // Check if MongoDB is connected


    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️ MongoDB not connected, returning empty orders list');
      return res.status(200).json({
        success: true,
        data: [],
        totalPages: 0,
        currentPage: 1,
        totalOrders: 0,
        message: 'Database not connected - displaying empty list'
      });
    }

    const { phone, status, search, page = 1, limit = 10 } = req.query;

    const query = {};

    // Exact phone match
    if (phone) query.phone = phone;

    // Status filter
    if (status) query.orderStatus = status;

    // General Search (ID, CustomerI D, Name, Phone)
    if (search) {
      const searchRegex = new RegExp(search, 'i'); // Case-insensitive
      query.$or = [
        { orderId: searchRegex },
        { customerId: searchRegex },
        { fullName: searchRegex },
        { phone: searchRegex },
        { 'address.pincode': searchRegex } // Optional: also search pincode
      ];
    }

    const orders = await Order.find(query)
      .sort({ orderDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalOrders: count
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// Get a single order by ID
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
});

// Update order status
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
});

// Update order details (Edit Order)
router.patch('/orders/:id', async (req, res) => {
  try {
    const updates = req.body;

    // updates can contain: phase, totalQuantity, totalWeight, totalPrice, address, message
    // Prevent updating immutable fields like _id, orderId if necessary
    delete updates._id;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });

  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
  }
});

// Delete an order (admin only - consider adding authentication)
router.delete('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message
    });
  }
});

export default router;

