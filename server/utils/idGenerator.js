import Customer from '../models/Customer.js';
import Order from '../models/Order.js';

export const generateCustomerId = async () => {
    try {
        // Find the last customer with an ID matching the pattern A[0-9]{3}
        const lastCustomer = await Customer.findOne({
            customerId: { $regex: /^A\d{3}$/ }
        }).sort({ customerId: -1 });

        if (!lastCustomer || !lastCustomer.customerId) {
            return 'A001';
        }

        // Extract the number part (e.g., "001" from "A001")
        const currentIdStr = lastCustomer.customerId.substring(1);
        const currentIdNum = parseInt(currentIdStr, 10);

        // Increment and pad with leading zeros
        const nextIdNum = currentIdNum + 1;
        const nextIdStr = nextIdNum.toString().padStart(3, '0');

        return `A${nextIdStr}`;
    } catch (error) {
        console.error('Error generating customer ID:', error);
        // Fallback or re-throw depending on desired safety
        throw error;
    }
};

export const generateOrderId = async (customerId) => {
    try {
        // Pattern: {customerId}A{sequence} -> e.g., A001A01
        // We look for orders belonging to this customerId
        // Note: We need to look up orders that START with customerId + "A" followed by digits
        const prefix = `${customerId}A`;
        const regex = new RegExp(`^${prefix}\\d{2,}$`);

        const lastOrder = await Order.findOne({
            orderId: { $regex: regex }
        }).sort({ orderId: -1 });

        if (!lastOrder || !lastOrder.orderId) {
            return `${prefix}01`;
        }

        // Extract suffix (everything after "A001A")
        // Length of prefix is known
        const currentSeqStr = lastOrder.orderId.substring(prefix.length);
        const currentSeqNum = parseInt(currentSeqStr, 10);

        const nextSeqNum = currentSeqNum + 1;
        // Pad with at least 2 zeros
        const nextSeqStr = nextSeqNum.toString().padStart(2, '0');

        return `${prefix}${nextSeqStr}`;

    } catch (error) {
        console.error('Error generating order ID:', error);
        throw error;
    }
};
