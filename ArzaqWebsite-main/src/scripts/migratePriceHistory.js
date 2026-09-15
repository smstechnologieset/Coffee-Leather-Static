// src/scripts/migratePriceHistory.js
// Script to migrate existing products to include priceHistory array

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
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

// Function to parse price from string
const parsePrice = (price) => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    const match = price.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }
  return 0;
};

// Migration function
const migrateProducts = async () => {
  try {
    console.log('Starting product migration...');
    
    // Sign in as admin
    console.log('Signing in as admin...');
    await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('Successfully signed in as admin');
    
    // Get all products
    const productsCollection = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCollection);
    
    console.log(`Found ${productsSnapshot.size} products to migrate`);
    
    let migratedCount = 0;
    
    for (const productDoc of productsSnapshot.docs) {
      const productData = productDoc.data();
      const productId = productDoc.id;
      
      // Check if product already has priceHistory
      if (productData.priceHistory) {
        console.log(`Product ${productId} already has priceHistory, skipping...`);
        continue;
      }
      
      // Extract current price from the product
      let currentPriceValue = null;
      if (productData.hasOwnProperty('price')) {
        currentPriceValue = productData.price;
      } else if (productData.hasOwnProperty('Price')) {
        currentPriceValue = productData.Price;
      } else if (productData.hasOwnProperty('currentPrice')) {
        currentPriceValue = productData.currentPrice;
      }
      
      // If product has a price, initialize priceHistory
      if (currentPriceValue !== null) {
        const numericPrice = parsePrice(currentPriceValue);
        if (numericPrice > 0) {
          const priceHistory = [
            {
              date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
              price: numericPrice
            }
          ];
          
          // Update the product with priceHistory
          const productRef = doc(db, 'products', productId);
          await updateDoc(productRef, { priceHistory });
          
          console.log(`Updated product ${productId} with priceHistory`);
          migratedCount++;
        } else {
          console.log(`Product ${productId} has invalid price, skipping...`);
        }
      } else {
        console.log(`Product ${productId} has no price field, skipping...`);
      }
    }
    
    console.log(`Migration completed. Updated ${migratedCount} products.`);
  } catch (error) {
    console.error('Error during migration:', error);
  }
};

// Run the migration
migrateProducts();