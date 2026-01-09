# Cycle Harmony Backend Server

This is the backend server for Cycle Harmony Laddus, built with Node.js, Express, and MongoDB.

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cp env-template.txt .env
```

Edit `.env` and configure your MongoDB connection:

**Option A: Local MongoDB**
```
MONGODB_URI=mongodb://localhost:27017/cycle-harmony
PORT=5000
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:5173
```

**Option B: MongoDB Atlas (Cloud)**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cycle-harmony?retryWrites=true&w=majority
PORT=5000
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:5173
```

### 3. Install MongoDB (if using local database)

**Windows:**
- Download from: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud) - no installation needed

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on http://localhost:5000

## API Endpoints

### Health Check
- **GET** `/health` - Check if server is running

### Orders

#### Create Order
- **POST** `/api/orders`
- **Body:**
```json
{
  "fullName": "John Doe",
  "phone": "9876543210",
  "periodsStarted": "2024-12-15",
  "cycleLength": 28,
  "phase": "Phase-1",
  "totalQuantity": 14,
  "totalWeight": 350,
  "totalPrice": 390,
  "address": {
    "house": "123 Main St",
    "area": "Banjara Hills",
    "landmark": "Near Park",
    "pincode": "500034",
    "mapLink": "https://maps.google.com/...",
    "label": "Home"
  },
  "paymentMethod": "Cash on Delivery",
  "message": "Delivery message"
}
```

#### Get All Orders
- **GET** `/api/orders?phone=9876543210&status=Pending&page=1&limit=10`
- Optional query parameters: `phone`, `status`, `page`, `limit`

#### Get Single Order
- **GET** `/api/orders/:id`

#### Update Order Status
- **PATCH** `/api/orders/:id/status`
- **Body:**
```json
{
  "status": "Confirmed"
}
```
Valid statuses: `Pending`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`

#### Delete Order
- **DELETE** `/api/orders/:id`

## Database Schema

### Order Model
```javascript
{
  fullName: String (required),
  phone: String (required),
  periodsStarted: Date (required),
  cycleLength: Number (required),
  phase: String (required, enum: ['Phase-1', 'Phase-2']),
  totalQuantity: Number (required),
  totalWeight: Number (required),
  totalPrice: Number (required),
  address: {
    house: String (required),
    area: String (required),
    landmark: String,
    pincode: String (required),
    mapLink: String,
    label: String (default: 'Home')
  },
  paymentMethod: String (required),
  orderStatus: String (default: 'Pending'),
  message: String,
  orderDate: Date (default: Date.now),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Testing the API

Use tools like Postman, Thunder Client, or curl to test the endpoints:

```bash
# Health check
curl http://localhost:5000/health

# Create order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "phone": "9876543210",
    "periodsStarted": "2024-12-15",
    "cycleLength": 28,
    "phase": "Phase-1",
    "totalQuantity": 14,
    "totalWeight": 350,
    "totalPrice": 390,
    "address": {
      "house": "123 Test St",
      "area": "Test Area",
      "pincode": "500001"
    },
    "paymentMethod": "Cash on Delivery"
  }'
```

## Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running: `brew services list` (Mac) or `systemctl status mongodb` (Linux)
- Check your MONGODB_URI in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted in Atlas dashboard

### CORS Issues
- Update `ALLOWED_ORIGINS` in `.env` to include your frontend URL
- Make sure frontend is running on the specified port

### Port Already in Use
- Change PORT in `.env` to a different port
- Or kill the process using the port: `lsof -ti:5000 | xargs kill` (Mac/Linux)

