const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('../config/db');

async function checkDatabase() {
  try {
    // Connect to the database
    await connectDB();
    
    // Get the database connection
    const db = mongoose.connection;
    
    // Get all collections
    const collections = await db.db.listCollections().toArray();
    
    console.log('\n=== Database Collections ===');
    
    // Count documents in each collection
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`${collection.name}: ${count} documents`);
      
      // If it's the members or books collection, log a few sample documents
      if (collection.name === 'members' || collection.name === 'books') {
        const sample = await db.collection(collection.name).findOne();
        console.log(`Sample document from ${collection.name}:`, JSON.stringify(sample, null, 2));
      }
    }
    
    console.log('\nDatabase check completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error checking database:', error);
    process.exit(1);
  }
}

checkDatabase();
