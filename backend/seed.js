const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://janjuatariq7614_db_user:tyfrkGJP0uB9oaOz@coffee-shop.3xuvmty.mongodb.net/?appName=coffee-shop';

const sampleMenuItems = [
  {
    name: 'Espresso',
    category: 'Hot Drinks',
    price: 800.50,
    inStock: true
  },
  {
    name: 'Cappuccino',
    category: 'Hot Drinks',
    price: 550.50,
    inStock: true
  },
  {
    name: 'Latte',
    category: 'Hot Drinks',
    price: 900.00,
    inStock: true
  },
  {
    name: 'Iced Coffee',
    category: 'Cold Drinks',
    price: 800.00,
    inStock: true
  },
  {
    name: 'Croissant',
    category: 'Pastries',
    price: 700.50,
    inStock: true
  },
  {
    name: 'Muffin',
    category: 'Pastries',
    price: 400.00,
    inStock: false
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');

    // Insert sample data
    await MenuItem.insertMany(sampleMenuItems);
    console.log('Sample menu items inserted successfully');

    // Display inserted items
    const items = await MenuItem.find({});
    console.log(`\nTotal menu items: ${items.length}`);
    items.forEach(item => {
      console.log(`- ${item.name} (${item.category}) - Rs. ${item.price} - In Stock: ${item.inStock}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

