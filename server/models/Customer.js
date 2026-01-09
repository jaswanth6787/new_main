import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    customerId: {
        type: String,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    lastPeriodDate: {
        type: Date
    },
    averageCycleLength: {
        type: Number
    },
    addresses: [{
        house: String,
        area: String,
        landmark: String,
        pincode: String,
        mapLink: String,
        label: String
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }]
}, {
    timestamps: true
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
