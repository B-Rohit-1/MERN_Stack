const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Book = require('./models/Book');
const Member = require('./models/Member');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
  await seedDatabase();
});

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await Member.deleteMany({});

    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@library.com',
      password: 'admin123', // The User model's pre-save hook will hash this
      role: 'admin'
    });

    // Create regular user
    const regularUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123', // The User model's pre-save hook will hash this
      role: 'user'
    });

    // Create sample books
    const books = await Book.insertMany([
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '9780743273565',
        quantity: 5,
        available: 5,
        publishedYear: 1925,
        publisher: 'Scribner',
        category: 'Classic Literature',
        shelfLocation: 'A1-101',
        addedBy: adminUser._id
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '9780061120084',
        quantity: 3,
        available: 3,
        publishedYear: 1960,
        publisher: 'J. B. Lippincott & Co.',
        category: 'Fiction',
        shelfLocation: 'A1-102',
        addedBy: adminUser._id
      },
      {
        title: '1984',
        author: 'George Orwell',
        isbn: '9780451524935',
        quantity: 4,
        available: 4,
        publishedYear: 1949,
        publisher: 'Secker & Warburg',
        category: 'Dystopian',
        shelfLocation: 'A1-103',
        addedBy: adminUser._id
      }
    ]);

    // Create sample members
    const members = await Member.insertMany([
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '555-123-4567',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          country: 'USA'
        },
        membershipType: 'premium',
        membershipStartDate: new Date(),
        membershipEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        addedBy: adminUser._id,
        status: 'active'
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        phone: '555-987-6543',
        address: {
          street: '456 Oak Ave',
          city: 'Somewhere',
          state: 'NY',
          zipCode: '54321',
          country: 'USA'
        },
        membershipType: 'regular',
        membershipStartDate: new Date(),
        membershipEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        addedBy: adminUser._id,
        status: 'active'
      }
    ]);

    console.log('Database seeded successfully!');
    console.log('Admin user created:');
    console.log(`Email: admin@library.com`);
    console.log(`Password: admin123`);
    console.log('\nRegular user created:');
    console.log(`Email: john@example.com`);
    console.log(`Password: password123`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};
