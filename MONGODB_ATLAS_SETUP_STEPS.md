# MongoDB Atlas Setup - Step by Step Guide

## Step 1: Create MongoDB Atlas Account

1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Click **"Try Free"** or **"Sign Up"**
3. Fill in your details:
   - Email address
   - Password (save this!)
   - First Name
   - Last Name
4. Click **"Create your Atlas account"**
5. Verify your email if prompted

---

## Step 2: Create a Free Cluster

1. After logging in, you'll see the **Atlas Dashboard**
2. Click **"Build a Database"** button
3. Choose **"FREE"** (M0 Sandbox) - This is the free tier
4. Select **Cloud Provider**:
   - Choose: **AWS**, **Google Cloud**, or **Azure**
   - Select the **Region** closest to you (e.g., Mumbai, Singapore, etc.)
5. Click **"Create"** button
6. Wait 3-5 minutes for the cluster to be created

---

## Step 3: Create Database User

1. In the **Security** section (left sidebar), click **"Database Access"**
2. Click **"Add New Database User"** button
3. Choose **"Password"** authentication method
4. Fill in:
   - **Username**: (e.g., `admin` or `cycleharmony`)
   - **Password**: Click **"Autogenerate Secure Password"** OR create your own
   - **⚠️ IMPORTANT**: Copy and save the password! You won't see it again!
5. Under **"Database User Privileges"**:
   - Select **"Read and write to any database"**
6. Click **"Add User"** button

---

## Step 4: Whitelist Your IP Address

1. In the **Security** section, click **"Network Access"**
2. Click **"Add IP Address"** button
3. For development/testing, choose:
   - Click **"Allow Access from Anywhere"** button
   - This adds `0.0.0.0/0` (allows all IPs)
   - ⚠️ **Note**: For production, use specific IPs only
4. Click **"Confirm"** button

---

## Step 5: Get Your Connection String

1. Go back to **"Database"** section (left sidebar)
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Select:
   - **Driver**: Node.js
   - **Version**: 5.5 or later
5. You'll see a connection string like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Copy this connection string**

---

## Step 6: Format Your Connection String

Your connection string needs to include the database name. 

**Original format:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Updated format (add `/cycle-harmony` before the `?`):**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cycle-harmony?retryWrites=true&w=majority
```

**Example:**
If your connection string is:
```
mongodb+srv://admin:MyPass123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

Change it to:
```
mongodb+srv://admin:MyPass123@cluster0.abc123.mongodb.net/cycle-harmony?retryWrites=true&w=majority
```

---

## Step 7: Update Your .env File

1. Open the file: `server/.env`
2. Find the line: `MONGODB_URI=mongodb://localhost:27017/cycle-harmony`
3. Replace it with your MongoDB Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/cycle-harmony?retryWrites=true&w=majority
   ```
4. Replace:
   - `YOUR_USERNAME` with your database username
   - `YOUR_PASSWORD` with your database password
   - `YOUR_CLUSTER` with your cluster address

**Complete .env file should look like:**
```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://admin:MySecurePassword123@cluster0.abc123.mongodb.net/cycle-harmony?retryWrites=true&w=majority

# Server Port
PORT=5000

# Allowed Origins for CORS (frontend URL)
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:5173
```

---

## Step 8: Restart Your Server

1. Stop your current server (if running) - Press `Ctrl+C`
2. Navigate to server directory:
   ```bash
   cd server
   ```
3. Start the server:
   ```bash
   npm start
   ```
   OR for development:
   ```bash
   npm run dev
   ```

4. You should see:
   ```
   ✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
   📦 Database: cycle-harmony
   🚀 Server is running on port 5000
   ```

---

## Step 9: Verify Connection

1. Test the API:
   ```bash
   curl http://localhost:5000/health
   ```

2. Test orders endpoint:
   ```bash
   curl http://localhost:5000/api/orders
   ```

3. You should get a successful response (even if empty array)

---

## Troubleshooting

### Connection Timeout Error
- ✅ Check your IP is whitelisted in Network Access
- ✅ Verify username and password are correct
- ✅ Make sure cluster is fully created (wait 5 minutes)

### Authentication Failed
- ✅ Check username and password in connection string
- ✅ Verify database user has "Read and write" privileges
- ✅ Make sure password doesn't have special characters that need URL encoding

### Can't Connect
- ✅ Check internet connection
- ✅ Verify cluster is running (not paused)
- ✅ Check connection string format (database name before `?`)

---

## Security Notes

⚠️ **Important:**
- Never commit your `.env` file to Git
- Use strong passwords for database users
- For production, whitelist only specific IPs (not 0.0.0.0/0)
- Keep your connection string secret

---

## Next Steps

Once connected:
1. Place a test order through the website
2. Check your orders in MongoDB Atlas:
   - Go to Database → Browse Collections
   - Select `cycle-harmony` database
   - View `orders` collection
3. Your admin dashboard should now show customers and orders!

---

## Quick Checklist

- [ ] MongoDB Atlas account created
- [ ] Free cluster created and running
- [ ] Database user created (username + password saved)
- [ ] IP address whitelisted (0.0.0.0/0 for dev)
- [ ] Connection string copied
- [ ] Connection string formatted with `/cycle-harmony` database name
- [ ] `.env` file updated with connection string
- [ ] Server restarted
- [ ] Connection verified (see ✅ MongoDB Connected message)

---

**You're all set! 🎉**



