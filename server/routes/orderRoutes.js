import express from 'express';
import mongoose from 'mongoose';
import Customer from '../models/Customer.js';
import Order from '../models/Order.js';
import { generateCustomerId, generateOrderId } from '../utils/idGenerator.js';

const router = express.Router();

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

    const { phone, status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (phone) query.phone = phone;
    if (status) query.orderStatus = status;

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

