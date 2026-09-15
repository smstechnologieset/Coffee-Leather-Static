// src/scripts/seedData.js
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

// Sample products data
const sampleProducts = [
  {
    name: 'Premium Coffee Beans',
    category: 'Agricultural',
    price: '$100/ton',
    status: 'In Stock',
    description: 'High-quality Arabica coffee beans sourced from Ethiopian highlands',
    image: '/src/assets/products/coffee.jpg'
  },
  {
    name: 'Crude Oil',
    category: 'Energy',
    price: '$75/barrel',
    status: 'In Stock',
    description: 'Grade 1 crude oil suitable for refining',
    image: '/src/assets/products/oil.jpg'
  },
  {
    name: 'Construction Equipment',
    category: 'Industrial',
    price: 'Negotiable',
    status: 'Out of Stock',
    description: 'Heavy-duty construction machinery',
    image: '/src/assets/products/equipment.jpg'
  },
  {
    name: 'Wheat',
    category: 'Agricultural',
    price: '$300/ton',
    status: 'In Stock',
    description: 'Premium grade wheat for food processing',
    image: '/src/assets/products/wheat.jpg'
  },
  {
    name: 'Gum Arabic',
    category: 'Agricultural',
    price: '$15/kg',
    status: 'In Stock',
    description: 'Natural gum arabic from Acacia trees',
    image: '/src/assets/products/gum.jpg'
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
    name: 'Robert Johnson',
    email: 'robert@example.com',
    role: 'user',
    status: 'Inactive'
  },
  {
    name: 'Emily Davis',
    email: 'emily@example.com',
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
export const seedDatabase = async () => {
  try {
    console.log('Seeding products...');
    for (const product of sampleProducts) {
      await addDoc(collection(db, 'products'), product);
    }
    
    console.log('Seeding users...');
    // Note: Users are typically created through the auth system, so we'll skip this
    
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

// Run the seed function if this file is executed directly
if (typeof window === 'undefined') {
  seedDatabase();
}