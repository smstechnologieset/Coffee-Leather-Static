// src/scripts/seedFirestore.js
// Standalone script to seed Firestore database
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxhBdUvZh_Sm-2cAWXLz0thTMBLAkSfwQ",
  authDomain: "arzaq-8c1ad.firebaseapp.com",
  projectId: "arzaq-8c1ad",
  storageBucket: "arzaq-8c1ad.firebasestorage.app",
  messagingSenderId: "979204478840",
  appId: "1:979204478840:web:53ee650291962ddd389a8d",
  measurementId: "G-2EZ3RJBBMQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Admin credentials
const ADMIN_EMAIL = 'admin@arzaq.com';
const ADMIN_PASSWORD = 'admin123'; // You should change this to your actual admin password

// Sample products data
const sampleProducts = [
  {
    name: 'Premium Coffee Beans',
    category: 'Agricultural',
    price: '$100/ton',
    status: 'In Stock',
    description: 'High-quality Arabica coffee beans sourced from Ethiopian highlands'
  },
  {
    name: 'Crude Oil',
    category: 'Energy',
    price: '$75/barrel',
    status: 'In Stock',
    description: 'Grade 1 crude oil suitable for refining'
  },
  {
    name: 'Construction Equipment',
    category: 'Industrial',
    price: 'Negotiable',
    status: 'Out of Stock',
    description: 'Heavy-duty construction machinery'
  },
  {
    name: 'Wheat',
    category: 'Agricultural',
    price: '$300/ton',
    status: 'In Stock',
    description: 'Premium grade wheat for food processing'
  },
  {
    name: 'Gum Arabic',
    category: 'Agricultural',
    price: '$15/kg',
    status: 'In Stock',
    description: 'Natural gum arabic from Acacia trees'
  }
];

// Sample users data
const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    status: 'Active'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'Active'
  },
  {
    name: 'Admin User',
    email: 'admin@arzaq.com',
    role: 'admin',
    status: 'Active'
  }
];

// Sample blogs data
const sampleBlogs = [
  {
    title: 'The Future of Coffee Trade',
    author: 'Sarah Johnson',
    date: '2025-12-01',
    status: 'Published',
    content: 'An analysis of emerging trends in the global coffee market...'
  },
  {
    title: 'Global Oil Market Insights',
    author: 'Michael Chen',
    date: '2025-11-28',
    status: 'Draft',
    content: 'Exploring the dynamics of oil prices and market forces...'
  },
  {
    title: 'Sustainable Agriculture Practices',
    author: 'Amina Hassan',
    date: '2025-11-15',
    status: 'Published',
    content: 'How sustainable farming is changing the agricultural landscape...'
  }
];

// Sample requests data
const sampleRequests = [
  {
    type: 'sample',
    product: 'Premium Coffee Beans',
    customer: 'John Doe',
    date: '2025-12-05',
    status: 'Pending',
    details: 'Request for 10kg sample for quality testing'
  },
  {
    type: 'sample',
    product: 'Wheat',
    customer: 'ABC Corp',
    date: '2025-12-03',
    status: 'Shipped',
    details: 'Sample shipment dispatched on 2025-12-04'
  },
  {
    type: 'contract',
    product: 'Crude Oil',
    customer: 'XYZ Industries',
    date: '2025-12-04',
    status: 'Pending',
    details: 'Request for 1000 barrels monthly supply contract'
  },
  {
    type: 'contract',
    product: 'Gum Arabic',
    customer: 'DEF Ltd',
    date: '2025-12-02',
    status: 'Approved',
    details: 'Annual contract for 50 tons supply'
  }
];

// Function to seed all data
const seedDatabase = async () => {
  try {
    // Sign in as admin
    console.log('Signing in as admin...');
    await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('Successfully signed in as admin');
    
    console.log('Seeding products...');
    for (const product of sampleProducts) {
      await addDoc(collection(db, 'products'), product);
    }
    
    console.log('Seeding users...');
    for (const user of sampleUsers) {
      await addDoc(collection(db, 'users'), user);
    }
    
    console.log('Seeding blogs...');
    for (const blog of sampleBlogs) {
      await addDoc(collection(db, 'blogs'), blog);
    }
    
    console.log('Seeding requests...');
    for (const request of sampleRequests) {
      await addDoc(collection(db, 'requests'), request);
    }
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Run the seed function
seedDatabase();