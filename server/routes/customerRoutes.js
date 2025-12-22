import express from 'express';
import Customer from '../models/Customer.js';
import Order from '../models/Order.js';
import { generateCustomerId } from '../utils/idGenerator.js';

const router = express.Router();

// Check if customer exists by phone
router.post('/check-customer', async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ success: false, message: 'Phone number is required' });
        }

        const customer = await Customer.findOne({ phone });

        if (customer) {
            return res.status(200).json({
                success: true,
                exists: true,
                data: customer
            });
        } else {
            return res.status(200).json({
                success: true,
                exists: false,
                message: 'Customer not found'
            });
        }

    } catch (error) {
        console.error('Error checking customer:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update or Create Customer Profile (can be used for initial data gathering)
router.post('/customers', async (req, res) => {
    try {
        const { phone, name, age } = req.body;

        if (!phone || !name || !age) {
            return res.status(400).json({ success: false, message: 'Phone, Name, and Age are required' });
        }

        let customer = await Customer.findOne({ phone });

        if (customer) {
            // Update existing
            customer.name = name;
            customer.age = age;
            await customer.save();
        } else {
            // Create new
            const newCustomerId = await generateCustomerId();
            customer = new Customer({
                customerId: newCustomerId,
                phone,
                name,
                age,
                addresses: []
            });
            await customer.save();
        }

        res.status(200).json({
            success: true,
            data: customer
        });

    } catch (error) {
        console.error('Error saving customer:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get all customers (with optional search)
router.get('/customers', async (req, res) => {
    try {
        const { search } = req.query;
        const query = {};

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { customerId: searchRegex },
                { name: searchRegex },
                { phone: searchRegex }
            ];
        }

        const customers = await Customer.find(query).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: customers
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get Customer Profile with Orders
router.get('/customer-profile/:phone', async (req, res) => {
    try {
        const { phone } = req.params;

        const customer = await Customer.findOne({ phone });

        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        // Fetch orders for this phone number
        const orders = await Order.find({ phone: phone }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            customer: customer,
            orders: orders
        });

    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PATCH /customers/:id - Update customer details
router.patch('/customers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const customer = await Customer.findByIdAndUpdate(id, updates, { new: true });

        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Customer updated successfully',
            data: customer
        });
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE /customers/:id - Delete customer and optionally their orders
router.delete('/customers/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        // Delete the customer
        await Customer.findByIdAndDelete(id);

        // Optionally delete all orders associated with this customer
        // We use the phone number to link orders, so we delete orders with that phone
        await Order.deleteMany({ phone: customer.phone });

        res.status(200).json({
            success: true,
            message: 'Customer and associated orders deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
