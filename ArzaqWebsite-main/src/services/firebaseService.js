import { db, auth } from '../firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';

// Auth Helper
export const resetUserPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { success: false, error: error.message };
  }
};

// Products CRUD operations
export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products;
  } catch (error) {
    return [];
  }
};

export const addProduct = async (productData) => {
  try {
    // If product has a price, initialize priceHistory with the initial price
    if (productData.hasOwnProperty('price') || productData.hasOwnProperty('Price') || productData.hasOwnProperty('currentPrice')) {
      // Parse numeric values from price strings
      const parsePrice = (price) => {
        if (typeof price === 'number') return price;
        if (typeof price === 'string') {
          const match = price.match(/[\d.]+/);
          return match ? parseFloat(match[0]) : 0;
        }
        return 0;
      };

      // Extract price value
      let priceValue = null;
      if (productData.hasOwnProperty('price')) {
        priceValue = productData.price;
      } else if (productData.hasOwnProperty('Price')) {
        priceValue = productData.Price;
      } else if (productData.hasOwnProperty('currentPrice')) {
        priceValue = productData.currentPrice;
      }

      // Add initial price to history
      const numericPrice = parsePrice(priceValue);
      if (numericPrice > 0) {
        productData.priceHistory = [
          {
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
            price: numericPrice
          }
        ];
      }
    }

    const docRef = await addDoc(collection(db, 'products'), productData);
    return { id: docRef.id, ...productData };
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    // Get the current product data to compare prices
    const productRef = doc(db, 'products', productId);

    // If price is being updated, add to price history
    if (productData.hasOwnProperty('price') || productData.hasOwnProperty('Price') || productData.hasOwnProperty('currentPrice')) {
      // Get current product data
      const productSnap = await getDoc(productRef);
      if (productSnap.exists()) {
        const currentProduct = productSnap.data();

        // Extract current price from the product
        let currentPriceValue = null;
        if (currentProduct.hasOwnProperty('price')) {
          currentPriceValue = currentProduct.price;
        } else if (currentProduct.hasOwnProperty('Price')) {
          currentPriceValue = currentProduct.Price;
        } else if (currentProduct.hasOwnProperty('currentPrice')) {
          currentPriceValue = currentProduct.currentPrice;
        }

        // Extract new price from the update data
        let newPriceValue = null;
        if (productData.hasOwnProperty('price')) {
          newPriceValue = productData.price;
        } else if (productData.hasOwnProperty('Price')) {
          newPriceValue = productData.Price;
        } else if (productData.hasOwnProperty('currentPrice')) {
          newPriceValue = productData.currentPrice;
        }

        // If price is changing, add to price history
        if (currentPriceValue !== newPriceValue && newPriceValue !== null) {
          // Parse numeric values from price strings
          const parsePrice = (price) => {
            if (typeof price === 'number') return price;
            if (typeof price === 'string') {
              const match = price.match(/[\d.]+/);
              return match ? parseFloat(match[0]) : 0;
            }
            return 0;
          };

          const currentNumericPrice = parsePrice(currentPriceValue);
          const newNumericPrice = parsePrice(newPriceValue);

          // Only add to history if numeric values are different
          if (currentNumericPrice !== newNumericPrice) {
            // Initialize or get existing price history
            let priceHistory = currentProduct.priceHistory || [];

            // Add current price to history with timestamp
            priceHistory.push({
              date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
              price: currentNumericPrice
            });

            // Keep only the last 5 entries
            if (priceHistory.length > 5) {
              priceHistory = priceHistory.slice(-5);
            }

            // Add priceHistory to the update data
            productData.priceHistory = priceHistory;
          }
        }
      }
    }

    await updateDoc(productRef, productData);
    return { id: productId, ...productData };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, 'products', productId));
    return productId;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Users operations - Get users from both Auth and Firestore
export const getUsers = async () => {
  try {
    // For now, we'll fetch users from Firestore
    // In a production environment, you'd want to sync Auth users with Firestore
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    return [];
  }
};

export const addUser = async (userData) => {
  try {
    const docRef = await addDoc(collection(db, 'users'), userData);
    return { id: docRef.id, ...userData };
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, userData);
    return { id: userId, ...userData };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    await deleteDoc(doc(db, 'users', userId));
    return userId;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Get user count
export const getUserCount = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.size;
  } catch (error) {
    return 0;
  }
};

// Blogs CRUD operations
export const getBlogs = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'blogs'));
    const blogs = [];
    querySnapshot.forEach((doc) => {
      blogs.push({ id: doc.id, ...doc.data() });
    });
    // Sort by date descending (newest first)
    return blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
};

export const getBlogById = async (blogId) => {
  try {
    const docRef = doc(db, 'blogs', blogId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such blog!");
      return null;
    }
  } catch (error) {
    console.error("Error getting blog:", error);
    return null;
  }
};

export const addBlog = async (blogData) => {
  try {
    const docRef = await addDoc(collection(db, 'blogs'), blogData);
    return { id: docRef.id, ...blogData };
  } catch (error) {
    console.error('Error adding blog:', error);
    throw error;
  }
};

export const updateBlog = async (blogId, blogData) => {
  try {
    const blogRef = doc(db, 'blogs', blogId);
    await updateDoc(blogRef, blogData);
    return { id: blogId, ...blogData };
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

export const deleteBlog = async (blogId) => {
  try {
    await deleteDoc(doc(db, 'blogs', blogId));
    return blogId;
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};



// Get counts for dashboard
export const getRequestCounts = async () => {
  try {
    const sampleQuery = query(collection(db, 'requests'), where('type', '==', 'sample'));
    const contractQuery = query(collection(db, 'requests'), where('type', '==', 'contract'));

    const [sampleSnapshot, contractSnapshot] = await Promise.all([
      getDocs(sampleQuery),
      getDocs(contractQuery)
    ]);

    return {
      sampleRequests: sampleSnapshot.size,
      contractRequests: contractSnapshot.size
    };
  } catch (error) {
    return {
      sampleRequests: 0,
      contractRequests: 0
    };
  }
};

// Get product count
export const getProductCount = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.size;
  } catch (error) {
    return 0;
  }
};

// Partners CRUD operations
export const getPartners = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'partners'));
    const partners = [];
    querySnapshot.forEach((doc) => {
      partners.push({ id: doc.id, ...doc.data() });
    });
    return partners;
  } catch (error) {
    console.error('Error fetching partners:', error);
    return [];
  }
};

export const addPartner = async (partnerData) => {
  try {
    const docRef = await addDoc(collection(db, 'partners'), partnerData);
    return { id: docRef.id, ...partnerData };
  } catch (error) {
    console.error('Error adding partner:', error);
    throw error;
  }
};

export const deletePartner = async (partnerId) => {
  try {
    await deleteDoc(doc(db, 'partners', partnerId));
    return partnerId;
  } catch (error) {
    console.error('Error deleting partner:', error);
    throw error;
  }
};

// Top Products Helper
export const getTopProducts = async (limitCount = 6) => {
  try {
    // Fetch all products and filter client-side to avoid index/type issues
    const allProducts = await getProducts();

    const topProducts = allProducts.filter(p => p.isTopProduct === true || p.isTopProduct === 'true');

    // If we have results, return them (limited)
    if (topProducts.length > 0) {
      return topProducts.slice(0, limitCount);
    }

    // Strict Mode: If no top products are set, return empty array. 
    // User requested specifically to ONLY show selected products.
    return [];
  } catch (error) {
    console.error('Error fetching top products:', error);
    return [];
  }
};

// Categories CRUD operations
export const getCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// User Management Operations
export const saveUser = async (user) => {
  try {
    // Check if user already exists
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Defensive: ensure name is never undefined/null
      const userName = user.displayName || user.name || user.email?.split('@')[0] || 'User';

      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || '',
        name: userName,
        role: 'user',
        status: 'active',
        createdAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};



// Add a new sample request
export const addSampleRequest = async (requestData) => {
  try {
    await addDoc(collection(db, 'sample_requests'), {
      ...requestData,
      createdAt: serverTimestamp(),
      status: 'pending' // pending, approved, shipped, rejected
    });
    return { success: true };
  } catch (error) {
    console.error('Error adding sample request:', error);
    return { success: false, error: error.message };
  }
};

// Add a new contract request
export const addContractRequest = async (requestData) => {
  try {
    await addDoc(collection(db, 'contract_requests'), {
      ...requestData,
      createdAt: serverTimestamp(),
      status: 'pending' // pending, under_review, approved, rejected
    });
    return { success: true };
  } catch (error) {
    console.error('Error adding contract request:', error);
    return { success: false, error: error.message };
  }
};

// Update generic user data (role, status, etc.)
export const updateUserData = async (uid, data) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, data);
    return { success: true };
  } catch (error) {
    console.error('Error updating user data:', error);
    return { success: false, error: error.message };
  }
};

export const updateUserStatus = async (uid, status) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { status });
    return { success: true };
  } catch (error) {
    console.error('Error updating user status:', error);
    return { success: false, error: error.message };
  }
};

// Messages Operations
export const addMessage = async (messageData) => {
  try {
    const docRef = await addDoc(collection(db, 'messages'), {
      ...messageData,
      createdAt: new Date().toISOString(),
      read: false // Default to unread
    });
    return { id: docRef.id, ...messageData };
  } catch (error) {
    console.error('Error adding message:', error);
    throw error;
  }
};

export const getMessages = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'messages'));
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    // Sort by date descending (newest first)
    return messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

export const updateMessageStatus = async (messageId, status) => {
  try {
    const messageRef = doc(db, 'messages', messageId);
    await updateDoc(messageRef, { read: status });
    return { id: messageId, read: status };
  } catch (error) {
    console.error('Error updating message status:', error);
    throw error;
  }
};

export const deleteMessage = async (messageId) => {
  try {
    await deleteDoc(doc(db, 'messages', messageId));
    return messageId;
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

// Get all sample requests
export const getSampleRequests = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'sample_requests'));
    const requests = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, type: 'sample', ...doc.data() });
    });
    // Sort by date descending
    return requests.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt.toDate ? a.createdAt.toDate() : a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt.toDate ? b.createdAt.toDate() : b.createdAt) : new Date(0);
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching sample requests:', error);
    return [];
  }
};

// Get all contract requests
export const getContractRequests = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'contract_requests'));
    const requests = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, type: 'contract', ...doc.data() });
    });
    // Sort by date descending
    return requests.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt.toDate ? a.createdAt.toDate() : a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt.toDate ? b.createdAt.toDate() : b.createdAt) : new Date(0);
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching contract requests:', error);
    return [];
  }
};

// Update request status (works for both sample and contract requests)
export const updateRequestStatus = async (collectionName, requestId, status) => {
  try {
    const requestRef = doc(db, collectionName, requestId);
    await updateDoc(requestRef, { status: status });
    return { success: true };
  } catch (error) {
    console.error(`Error updating ${collectionName} status:`, error);
    return { success: false, error: error.message };
  }
};

// Get requests for a specific user
export const getUserRequests = async (userId) => {
  try {
    const requests = [];

    // Fetch Sample Requests
    const sampleQuery = query(collection(db, 'sample_requests'), where('userId', '==', userId));
    const sampleSnap = await getDocs(sampleQuery);
    sampleSnap.forEach((doc) => {
      requests.push({ id: doc.id, type: 'sample', ...doc.data() });
    });

    // Fetch Contract Requests
    const contractQuery = query(collection(db, 'contract_requests'), where('userId', '==', userId));
    const contractSnap = await getDocs(contractQuery);
    contractSnap.forEach((doc) => {
      requests.push({ id: doc.id, type: 'contract', ...doc.data() });
    });

    // Sort by date descending
    return requests.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt.toDate ? a.createdAt.toDate() : a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt.toDate ? b.createdAt.toDate() : b.createdAt) : new Date(0);
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching user requests:', error);
    return [];
  }
};

// Get Dashboard Stats (Counts, Recent Activities, Chart Data)
export const getDashboardStats = async () => {
  try {
    const [
      usersSnap,
      productsSnap,
      blogsSnap,
      messagesSnap,
      samplesSnap,
      contractsSnap
    ] = await Promise.all([
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'products')),
      getDocs(collection(db, 'blogs')),
      getDocs(collection(db, 'messages')),
      getDocs(collection(db, 'sample_requests')),
      getDocs(collection(db, 'contract_requests'))
    ]);

    // 1. Counts
    const counts = {
      users: usersSnap.size,
      products: productsSnap.size,
      blogs: blogsSnap.size,
      messages: messagesSnap.size,
      sampleRequests: samplesSnap.size,
      contractRequests: contractsSnap.size,
      pendingSampleRequests: 0,
      pendingContractRequests: 0,
      unreadMessages: 0
    };

    // 2. Process Collections for Details (Recent Activity & Charts)
    const activities = [];
    const allRequests = []; // For charts

    // Process Users
    usersSnap.forEach(doc => {
      const data = doc.data();
      if (data.createdAt) {
        activities.push({
          type: 'user',
          id: doc.id,
          description: 'New User Registered',
          details: data.name || data.email,
          date: data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
        });
      }
    });

    // Process Products
    productsSnap.forEach(doc => {
      const data = doc.data();
      if (data.createdAt) {
        activities.push({
          type: 'product',
          id: doc.id,
          description: 'Product Added',
          details: data.name || data.Name,
          date: data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
        });
      }
    });

    // Process Blogs
    blogsSnap.forEach(doc => {
      const data = doc.data();
      if (data.date) {
        activities.push({
          type: 'blog',
          id: doc.id,
          description: 'Blog Post Created',
          details: data.title,
          date: new Date(data.date)
        });
      }
    });

    // Process Messages
    messagesSnap.forEach(doc => {
      const data = doc.data();
      if (!data.read) counts.unreadMessages++;
      if (data.createdAt) {
        activities.push({
          type: 'message',
          id: doc.id,
          description: 'New Message',
          details: `From: ${data.name}`,
          date: data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
        });
      }
    });

    // Process Samples
    samplesSnap.forEach(doc => {
      const data = doc.data();
      if (data.status === 'Pending' || !data.status) counts.pendingSampleRequests++;
      if (data.createdAt) {
        const date = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
        activities.push({
          type: 'sample',
          id: doc.id,
          description: 'Sample Requested',
          details: `${data.productName} (${data.userName})`,
          date: date
        });
        allRequests.push({ type: 'sample', date: date });
      }
    });

    // Process Contracts
    contractsSnap.forEach(doc => {
      const data = doc.data();
      if (data.status === 'Pending' || !data.status) counts.pendingContractRequests++;
      if (data.createdAt) {
        const date = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
        activities.push({
          type: 'contract',
          id: doc.id,
          description: 'Contract Requested',
          details: `${data.productName} (${data.userName})`,
          date: date
        });
        allRequests.push({ type: 'contract', date: date });
      }
    });

    // Sort Activities (Newest First) & slice top 10
    const recentActivities = activities.sort((a, b) => b.date - a.date).slice(0, 10);

    return {
      counts,
      recentActivities,
      chartData: allRequests // Return raw data for frontend to aggregate
    };

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};