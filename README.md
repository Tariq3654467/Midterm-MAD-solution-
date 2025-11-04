# ☕ Coffee Shop Management System

A full-stack coffee shop ordering system built with React Native (Expo), Node.js, Express, and MongoDB. Customers can browse the full menu or get a random surprise item.

## ✨ Features

- **Menu Display**: View all coffee shop items with categories (Hot Drinks, Cold Drinks, Pastries)
- **Surprise Me**: Get a random in-stock item recommendation
- **Modern UI**: Beautiful gradient backgrounds, animated cards, and category-based color themes
- **Expandable Items**: Tap to expand menu items for details and actions
- **Real-time Stock Status**: See which items are in stock or out of stock
- **Pull-to-Refresh**: Refresh menu data with a simple pull gesture

## 🛠️ Tech Stack

### Frontend
- **React Native** (Expo) - Cross-platform mobile framework
- **Expo Linear Gradient** - Gradient backgrounds
- **React Native Animated** - Smooth animations
- **ImageBackground** - Background images

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Expo CLI (installed globally or via npx)
- Expo Go app on your mobile device (for testing)

## 🚀 Setup Instructions

### 1. MongoDB Atlas Setup

1. Create a MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database named `coffee_shop_db`
4. Create a collection named `menu_items`
5. Get your connection string (URI)

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set your MongoDB URI (replace with your actual connection string)
# Windows (Command Prompt)
set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/coffee_shop_db?retryWrites=true&w=majority

# Windows (PowerShell)
$env:MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/coffee_shop_db?retryWrites=true&w=majority"

# Linux/Mac
export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/coffee_shop_db?retryWrites=true&w=majority"

# Seed the database with sample data
npm run seed

# Start the server
npm start
```

The server will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Find your local IP address (for mobile device testing)
# Windows: ipconfig
# Linux/Mac: ifconfig or ip addr

# Set the API URL (replace with your local IP if testing on mobile device)
# Windows (Command Prompt)
set EXPO_PUBLIC_API_URL=http://192.168.x.x:3000

# Windows (PowerShell)
$env:EXPO_PUBLIC_API_URL="http://192.168.x.x:3000"

# Linux/Mac
export EXPO_PUBLIC_API_URL="http://192.168.x.x:3000"

# Start Expo development server
npm start
# or
npx expo start
```

### 4. Run on Mobile Device

1. Install **Expo Go** app on your phone
2. Scan the QR code from the terminal
3. Make sure your phone and computer are on the same Wi-Fi network

## 📡 API Endpoints

### GET `/menu`
Returns all menu items from the database.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Espresso",
      "category": "Hot Drinks",
      "price": 800.50,
      "inStock": true
    }
  ],
  "count": 6
}
```

### GET `/menu/random`
Returns one random menu item where `inStock = true`.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Cappuccino",
    "category": "Hot Drinks",
    "price": 550.50,
    "inStock": true
  }
}
```

## 📁 Project Structure

```
coffe_app/
├── backend/
│   ├── models/
│   │   └── MenuItem.js       # MongoDB schema
│   ├── server.js             # Express server
│   ├── seed.js               # Database seeding script
│   └── package.json
├── frontend/
│   ├── App.js                # Main React Native component
│   ├── app.json              # Expo configuration
│   └── package.json
└── README.md
```

## 📊 Database Schema

### MenuItem Schema
```javascript
{
  name: String (required),
  category: String (required),
  price: Number (required),
  inStock: Boolean (default: true)
}
```

## 🎨 Features Breakdown

- **Category Colors**: Each category has unique color themes
  - Hot Drinks: Caramel brown (#C4904F)
  - Cold Drinks: Sky blue (#0EA5E9)
  - Pastries: Orange (#F97316)

- **Animations**: Smooth expand/collapse, fade-in, and button press animations

- **Background**: Beautiful coffee shop image with gradient overlay

- **Glass Morphism**: Semi-transparent cards with modern glass effect

## 🐛 Troubleshooting

### Server Connection Issues
- Ensure MongoDB Atlas IP whitelist includes your IP (or 0.0.0.0/0 for testing)
- Verify MongoDB URI is correctly set
- Check that backend server is running on port 3000

### Frontend Connection Issues
- Use your computer's local IP address instead of `localhost`
- Ensure both devices are on the same network
- Check firewall settings

### Module Not Found Errors
- Run `npm install` in both backend and frontend directories
- Clear node_modules and reinstall if issues persist

## 📝 Sample Menu Items

The seed script includes:
- **Espresso** - Hot Drinks - Rs. 800.50
- **Cappuccino** - Hot Drinks - Rs. 550.50
- **Latte** - Hot Drinks - Rs. 900.00
- **Iced Coffee** - Cold Drinks - Rs. 800.00
- **Croissant** - Pastries - Rs. 700.50
- **Muffin** - Pastries - Rs. 400.00 (Out of Stock)

## 📄 License

ISC

## 👤 Author

Coffee Shop Management System - Full Stack Application

---

**Note**: This project was built for educational purposes as part of a full-stack development assignment.

