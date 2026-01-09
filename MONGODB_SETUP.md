# MongoDB Integration Setup Guide

This guide will help you set up MongoDB to save customer order data.

## Overview

The system now saves customer orders to MongoDB database in addition to Google Sheets. When a customer places an order:
1. Order details are sent via WhatsApp
2. Order is saved to Google Sheets (if configured)
3. **Order is saved to MongoDB database (NEW!)**

## Prerequisites

You need either:
- **Option A**: Local MongoDB installation
- **Option B**: MongoDB Atlas (Cloud) - Recommended for production

---

## Option A: Local MongoDB Setup (Development)

### 1. Install MongoDB

**Windows:**
1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install as a Windows Service
5. MongoDB will start automatically

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### 2. Verify MongoDB is Running

```bash
# Check if MongoDB is running
mongosh
# If successful, you'll see MongoDB shell. Type 'exit' to exit.
```

---

## Option B: MongoDB Atlas Setup (Cloud - Recommended)

### 1. Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for free (Free tier includes 512MB storage)

### 2. Create a Cluster
1. Click "Build a Database"
2. Choose "FREE" (M0 Sandbox)
3. Select a cloud provider and region (closest to you)
4. Click "Create Cluster"

### 3. Create Database User
1. In the Security section, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Set username and password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### 4. Whitelist Your IP Address
1. Go to "Network Access" in Security section
2. Click "Add IP Address"
3. For development, click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production, add specific IP addresses
5. Click "Confirm"

### 5. Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like):
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add database name before the `?`: `/cycle-harmony?`

---

## Backend Setup

### 1. Navigate to Server Directory
```bash
cd cycle-harmony-laddus-main/server
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- express (Web server)
- mongoose (MongoDB ODM)
- cors (Cross-origin requests)
- dotenv (Environment variables)
- body-parser (Parse request bodies)

### 3. Create Environment File

Create a `.env` file in the `server` directory:

```bash
# For Windows (PowerShell)
Copy-Item env-template.txt .env

# For Mac/Linux
cp env-template.txt .env
```

### 4. Configure Environment Variables

Edit `server/.env`:

**For Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/cycle-harmony
PORT=5000
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:5173
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cycle-harmony?retryWrites=true&w=majority
PORT=5000
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:5173
```

### 5. Start Backend Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
✅ MongoDB Connected: localhost:27017 (or your Atlas cluster)
📦 Database: cycle-harmony
🚀 Server is running on port 5000
```

---

## Frontend Configuration

### 1. Create Frontend Environment File

In the **root** of `cycle-harmony-laddus-main` directory:

Create a `.env` file:
```bash
# For Windows (PowerShell)
Copy-Item env-frontend-example.txt .env

# For Mac/Linux
cp env-frontend-example.txt .env
```

### 2. Configure Frontend Environment

Edit `.env` in the root directory:

```env
# Google Sheets URL (optional - for legacy support)
VITE_GOOGLE_SHEET_URL=your_google_sheet_url_here

# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

### 3. Restart Frontend Server

Stop the frontend server (Ctrl+C) and restart:
```bash
npm run dev
```

---

## Running the Complete System

### Start Backend (Terminal 1)
```bash
cd cycle-harmony-laddus-main/server
npm run dev
```

### Start Frontend (Terminal 2)
```bash
cd cycle-harmony-laddus-main
npm run dev
```

You should see:
- Backend: http://localhost:5000
- Frontend: http://localhost:8080

---

## Testing the Integration

### 1. Test Backend API

Open browser and go to:
```
http://localhost:5000/health
```

You should see:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-12-17T..."
}
```

### 2. Test Complete Order Flow

1. Open frontend: http://localhost:8080
2. Scroll to "Cycle Phase Checker"
3. Fill in:
   - Last period date
   - Average cycle length
   - Your name
4. Click "Check My Phase"
5. Click "Order Now"
6. Fill in delivery details:
   - Full Name
   - Phone
   - Address details
7. Click "Confirm & Send"

### 3. Verify Order is Saved

**Check MongoDB:**

For local MongoDB:
```bash
mongosh
use cycle-harmony
db.orders.find().pretty()
```

For MongoDB Atlas:
1. Go to your cluster in Atlas
2. Click "Browse Collections"
3. Select "cycle-harmony" database
4. View "orders" collection

You should see your order data!

---

## Viewing Orders via API

### Get All Orders
```bash
curl http://localhost:5000/api/orders
```

### Get Orders by Phone
```bash
curl http://localhost:5000/api/orders?phone=9876543210
```

### Get Order by ID
```bash
curl http://localhost:5000/api/orders/ORDER_ID_HERE
```

---

## Database Schema

Each order contains:

```javascript
{
  _id: ObjectId("..."),
  fullName: "John Doe",
  phone: "9876543210",
  periodsStarted: ISODate("2024-12-15"),
  cycleLength: 28,
  phase: "Phase-1",
  totalQuantity: 14,
  totalWeight: 350,
  totalPrice: 390,
  address: {
    house: "123 Main St",
    area: "Banjara Hills",
    landmark: "Near Park",
    pincode: "500034",
    mapLink: "https://maps.google.com/...",
    label: "Home"
  },
  paymentMethod: "Cash on Delivery",
  orderStatus: "Pending",
  message: "Today is Day 1 of your cycle...",
  orderDate: ISODate("2024-12-17"),
  createdAt: ISODate("2024-12-17"),
  updatedAt: ISODate("2024-12-17")
}
```

---

## Order Management

### Update Order Status

```bash
curl -X PATCH http://localhost:5000/api/orders/ORDER_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "Confirmed"}'
```

Valid statuses:
- `Pending` (default)
- `Confirmed`
- `Processing`
- `Shipped`
- `Delivered`
- `Cancelled`

---

## Troubleshooting

### Backend won't start
- ✅ Check if MongoDB is running
- ✅ Verify `.env` file exists in `server/` directory
- ✅ Check `MONGODB_URI` is correct
- ✅ For Atlas: Check username/password and IP whitelist

### Orders not saving
- ✅ Check backend console for errors
- ✅ Check frontend console for errors
- ✅ Verify `VITE_API_URL` in frontend `.env`
- ✅ Make sure both frontend and backend are running
- ✅ Check CORS settings in backend

### MongoDB Connection Error
**Local:**
```bash
# Check if MongoDB is running
brew services list  # Mac
systemctl status mongodb  # Linux
# Windows: Check Services app for "MongoDB"
```

**Atlas:**
- Check username/password
- Check IP whitelist (0.0.0.0/0 for development)
- Check connection string format

### CORS Error
Update `ALLOWED_ORIGINS` in `server/.env`:
```env
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:5173,http://192.168.1.48:8080
```

---

## Production Deployment

### For MongoDB Atlas (Recommended)
1. Use MongoDB Atlas connection string
2. Update `ALLOWED_ORIGINS` to include production domain
3. Set `NODE_ENV=production` in backend
4. Use strong passwords
5. Whitelist only production server IPs

### For Local MongoDB
1. Configure MongoDB for external access
2. Set up authentication
3. Configure firewall rules
4. Use SSL/TLS encryption
5. Regular backups

---

## Next Steps

### Build an Admin Dashboard (Optional)
Create a dashboard to:
- View all orders
- Update order status
- Filter by date, phone, status
- Generate reports

### Add Features (Optional)
- Email notifications
- SMS confirmations
- Payment gateway integration
- Order tracking
- Customer accounts

---

## Support

For issues:
1. Check the logs: `server/` directory console output
2. Check MongoDB logs: `mongosh` and run queries
3. Review API documentation: `server/README.md`
4. Check frontend console for errors

---

## Summary

✅ MongoDB stores all customer orders
✅ Complete order history tracking
✅ Easy to query and manage
✅ Scales to production with MongoDB Atlas
✅ Works alongside existing Google Sheets integration

The system is now ready to save customer order data to MongoDB! 🎉

