const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const MenuItem = require('./models/MenuItem');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://janjuatariq7614_db_user:tyfrkGJP0uB9oaOz@coffee-shop.3xuvmty.mongodb.net/?appName=coffee-shop';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('MongoDB connection failed: [no response]');
    console.error('Error details:', error.message);
  });

// Routes

// GET /menu - Get all menu items
app.get('/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({});
    res.json({
      success: true,
      data: menuItems,
      count: menuItems.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching menu items',
      error: error.message
    });
  }
});

// GET /menu/random - Get one random item where inStock = true
app.get('/menu/random', async (req, res) => {
  try {
    const randomItem = await MenuItem.aggregate([
      { $match: { inStock: true } },
      { $sample: { size: 1 } }
    ]);
    
    if (randomItem.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No items in stock'
      });
    }
    
    res.json({
      success: true,
      data: randomItem[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching random menu item',
      error: error.message
    });
  }
});

// Server start
module.exports = app;

