import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getUsers,
  getBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
  getSampleRequests,
  getContractRequests,
  getRequestCounts,
  getProductCount,
  getUserCount,
  getDashboardStats
} from '../services/firebaseService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory
} from '../services/categoryService';

import {
  getPartners,
  addPartner,
  deletePartner,
  updateUserData,
  updateUserStatus,
  getMessages,
  updateMessageStatus,
  updateRequestStatus
} from '../services/firebaseService';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminDashboard = () => {
  const { currentUser, userRole, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Selected User for detailed editing
  const [blogs, setBlogs] = useState([]);
  const [messages, setMessages] = useState([]); // Messages State
  const [selectedMessage, setSelectedMessage] = useState(null); // Selected Message for viewing
  const [sampleRequests, setSampleRequests] = useState([]);
  const [contractRequests, setContractRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null); // Selected Request for detailed view
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    counts: {
      users: 0, products: 0, blogs: 0, messages: 0,
      sampleRequests: 0, contractRequests: 0,
      pendingSampleRequests: 0, pendingContractRequests: 0, unreadMessages: 0
    },
    recentActivities: [],
    chartData: []
  });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Partners & Top Products State
  const [partners, setPartners] = useState([]);
  const [partnerForm, setPartnerForm] = useState({ name: '', logo: '' });
  const [savingPartner, setSavingPartner] = useState(false);

  const [categoryForm, setCategoryForm] = useState({ name: '', attributes: [] });
  const [productForm, setProductForm] = useState({});
  const [newAttribute, setNewAttribute] = useState('');
  const [newPredefinedAttribute, setNewPredefinedAttribute] = useState({ name: '', values: [], currentValue: '' });
  const [savingProduct, setSavingProduct] = useState(false);

  // Responsive State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sorting Configuration
  const [sortConfig, setSortConfig] = useState({
    users: { key: 'name', direction: 'asc' },
    blogs: { key: 'date', direction: 'desc' },
    topProducts: { key: 'name', direction: 'asc' },
    messages: { key: 'createdAt', direction: 'desc' },
    sampleRequests: { key: 'createdAt', direction: 'desc' },
    contractRequests: { key: 'createdAt', direction: 'desc' }
  });

  // Search state for sections that don't already have specific search logic
  const [searchTerm, setSearchTerm] = useState(''); // For Users section
  const [blogSearchTerm, setBlogSearchTerm] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [messageSearchTerm, setMessageSearchTerm] = useState('');
  const [sampleRequestSearchTerm, setSampleRequestSearchTerm] = useState('');
  const [contractRequestSearchTerm, setContractRequestSearchTerm] = useState('');

  // Blog State
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    author: 'Admin',
    content: '',
    excerpt: '',
    image: '',
    category: 'General',
    status: 'Draft',
    date: new Date().toISOString().split('T')[0]
  });
  const [savingBlog, setSavingBlog] = useState(false);

  // Load categories when component mounts
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to login page after logout
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  // Filter products by selected category
  const categoryProducts = selectedCategory
    ? products.filter(product => product.categoryId === selectedCategory.id)
    : [];

  // Load data when component mounts or when active section changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        switch (activeSection) {
          case 'products':
            // Load both products and categories to ensure we have the latest category data
            const [productsData, categoriesData] = await Promise.all([
              getProducts(),
              getCategories()
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
            break;
          case 'users':
            const usersData = await getUsers();
            setUsers(usersData);
            break;
          case 'blogs':
            const blogsData = await getBlogs();
            setBlogs(blogsData);
            break;
          case 'sample-requests':
            const samples = await getSampleRequests();
            setSampleRequests(samples);
            break;
          case 'contract-requests':
            const contracts = await getContractRequests();
            setContractRequests(contracts);
            break;
          case 'overview':
            const dashboardStats = await getDashboardStats();
            setStats(dashboardStats);
            break;
          case 'partners':
            const partnersData = await getPartners();
            setPartners(partnersData);
            break;
          case 'messages':
            const messagesData = await getMessages();
            setMessages(messagesData);
            break;
          case 'top-products':
            const [allProds, allCats] = await Promise.all([
              getProducts(),
              getCategories()
            ]);
            setProducts(allProds);
            setCategories(allCats);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(`Error loading ${activeSection} data:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeSection]);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      image: '',
      attributes: ['Name', 'Min order', 'Price', 'Owner', 'Image'],
      predefinedAttributes: {
        'Availability': {
          values: ['In stock', 'Out of stock']
        }
      }
    });
    setNewPredefinedAttribute({ name: '', values: [], currentValue: '' });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);

    // Ensure required attributes are present even for old categories
    const requiredAttributes = ['Name', 'Min order', 'Price', 'Owner', 'Image'];
    const currentAttributes = [...(category.attributes || [])];
    requiredAttributes.forEach(attr => {
      if (!currentAttributes.includes(attr)) {
        currentAttributes.push(attr);
      }
    });

    const currentPredefined = { ...(category.predefinedAttributes || {}) };
    if (!currentPredefined['Availability']) {
      currentPredefined['Availability'] = {
        values: ['In stock', 'Out of stock']
      };
    }

    setCategoryForm({
      name: category.name,
      image: category.image || '',
      attributes: currentAttributes,
      predefinedAttributes: currentPredefined
    });
    setNewPredefinedAttribute({ name: '', values: [], currentValue: '' });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete all products in this category.')) {
      try {
        await deleteCategory(categoryId);
        setCategories(categories.filter(cat => cat.id !== categoryId));
        // Also delete products in this category
        setProducts(products.filter(prod => prod.categoryId !== categoryId));
        if (selectedCategory && selectedCategory.id === categoryId) {
          setSelectedCategory(null);
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category. Please try again.');
      }
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name.trim()) return;

    try {
      if (editingCategory) {
        // Update existing category
        const updatedCategory = await updateCategory(editingCategory.id, {
          name: categoryForm.name,
          image: categoryForm.image,
          attributes: categoryForm.attributes,
          predefinedAttributes: categoryForm.predefinedAttributes || {}
        });

        setCategories(categories.map(cat =>
          cat.id === editingCategory.id ? updatedCategory : cat
        ));

        // Update products to reflect new attributes
        setProducts(products.map(product => {
          if (product.categoryId === editingCategory.id) {
            const updatedProduct = { ...product };
            const predefinedKeys = categoryForm.predefinedAttributes ? Object.keys(categoryForm.predefinedAttributes) : [];
            const allowedKeys = [
              'id', 'categoryId', 'createdAt', 'updatedAt', 'priceHistory', 'imageUrl', 'image',
              ...categoryForm.attributes,
              ...predefinedKeys
            ];

            // Remove attributes that no longer exist
            Object.keys(updatedProduct).forEach(key => {
              if (!allowedKeys.includes(key)) {
                delete updatedProduct[key];
              }
            });
            return updatedProduct;
          }
          return product;
        }));

        // Update selected category if it's the one being edited
        if (selectedCategory && selectedCategory.id === editingCategory.id) {
          setSelectedCategory(updatedCategory);
        }
      } else {
        // Add new category
        const newCategory = await addCategory({
          name: categoryForm.name,
          image: categoryForm.image,
          attributes: categoryForm.attributes,
          predefinedAttributes: categoryForm.predefinedAttributes || {}
        });
        setCategories([...categories, newCategory]);
      }

      setShowCategoryModal(false);
      setCategoryForm({ name: '', image: '', attributes: [] });
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category. Please try again.');
    }
  };

  const handleAddAttribute = () => {
    if (newAttribute.trim() && !categoryForm.attributes.includes(newAttribute.trim())) {
      setCategoryForm({
        ...categoryForm,
        attributes: [...categoryForm.attributes, newAttribute.trim()]
      });
      setNewAttribute('');
    }
  };

  const handleRemoveAttribute = (attribute) => {
    const requiredAttributes = ['Name', 'Min order', 'Price', 'Owner', 'Image'];
    if (requiredAttributes.includes(attribute)) {
      alert(`The attribute "${attribute}" is required and cannot be removed.`);
      return;
    }
    setCategoryForm({
      ...categoryForm,
      attributes: categoryForm.attributes.filter(attr => attr !== attribute)
    });
  };

  const handleAddProduct = () => {
    if (!selectedCategory) return;
    setEditingProduct(null);
    // Initialize product form with category attributes
    const initialForm = { categoryId: selectedCategory.id };

    // Include both regular attributes and predefined attributes
    const allAttributes = [
      ...selectedCategory.attributes,
      ...(selectedCategory.predefinedAttributes ? Object.keys(selectedCategory.predefinedAttributes) : [])
    ];

    allAttributes.forEach(attr => {
      initialForm[attr] = '';
    });
    setProductForm(initialForm);
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({ ...product });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter(prod => prod.id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleSaveProduct = async () => {
    // Validate that at least one field has a value (other than categoryId)
    const hasValues = Object.entries(productForm).some(([key, value]) =>
      key !== 'categoryId' && value && value.toString().trim() !== ''
    );

    if (!hasValues) {
      alert('Please fill in at least one field.');
      return;
    }

    setSavingProduct(true);
    try {
      if (editingProduct) {
        // Update existing product
        const updatedProduct = await updateProduct(editingProduct.id, productForm);
        setProducts(products.map(prod =>
          prod.id === editingProduct.id ? updatedProduct : prod
        ));
      } else {
        // Add new product
        const newProduct = await addProduct(productForm);
        setProducts([...products, newProduct]);
      }

      setShowProductModal(false);
      setProductForm({});
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setSavingProduct(false);
    }
  };
  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  // --- Partners Handlers ---
  const handleAddPartner = async (e) => {
    e.preventDefault();
    if (!partnerForm.name || !partnerForm.logo) return;

    setSavingPartner(true);
    try {
      const newPartner = await addPartner(partnerForm);
      setPartners([...partners, newPartner]);
      setPartnerForm({ name: '', logo: '' });
      alert('Partner added successfully!');
    } catch (error) {
      console.error('Error adding partner:', error);
      alert('Failed to add partner.');
    } finally {
      setSavingPartner(false);
    }
  };

  const handleDeletePartner = async (id) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        await deletePartner(id);
        setPartners(partners.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting partner:', error);
      }
    }
  };

  // --- Top Product Toggle Handler ---
  const handleToggleTopProduct = async (product) => {
    try {
      const updatedProduct = await updateProduct(product.id, {
        ...product, // Ensure we keep existing fields
        isTopProduct: !product.isTopProduct
      });
      setProducts(products.map(p => p.id === product.id ? updatedProduct : p));
    } catch (error) {
      console.error('Error toggling top product:', error);
      alert('Failed to update product status');
    }
  };

  // --- Generic Sort Handler ---
  const handleSort = (section, key) => {
    let direction = 'asc';
    if (sortConfig[section].key === key && sortConfig[section].direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({
      ...sortConfig,
      [section]: { key, direction }
    });
  };

  // --- Sorting Utility ---
  const sortData = (data, section) => {
    const { key, direction } = sortConfig[section];
    return [...data].sort((a, b) => {
      const valA = (a[key] || '').toString().toLowerCase();
      const valB = (b[key] || '').toString().toLowerCase();

      // Handle special cases like dates or booleans if needed
      if (key === 'createdAt' || key === 'date') {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      }

      if (typeof a[key] === 'boolean') {
        return direction === 'asc' ? (a[key] === b[key] ? 0 : a[key] ? -1 : 1) : (a[key] === b[key] ? 0 : a[key] ? 1 : -1);
      }

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const SortIcon = ({ section, column }) => {
    if (sortConfig[section].key !== column) {
      return <svg className="w-3 h-3 ml-1 text-gray-400 opacity-50" fill="currentColor" viewBox="0 0 20 20"><path d="M10 3.293L13.707 7h-7.414L10 3.293zM10 16.707L6.293 13h7.414L10 16.707z" /></svg>;
    }
    return sortConfig[section].direction === 'asc'
      ? <svg className="w-3 h-3 ml-1 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 3.293L13.707 7h-7.414L10 3.293z" /></svg>
      : <svg className="w-3 h-3 ml-1 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 16.707L6.293 13h7.414L10 16.707z" /></svg>;
  };

  // --- User Ban Handler ---
  const handleBanUser = async (user) => {
    const newStatus = user.status === 'banned' ? 'active' : 'banned';
    const action = newStatus === 'banned' ? 'ban' : 'unban';

    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      setLoading(true);
      await updateUserStatus(user.id, newStatus);
      const updatedUsers = await getUsers(); // Refresh list to be safe
      setUsers(updatedUsers);
      setLoading(false);
    }
  };

  // --- Blog Handlers ---
  const handleAddBlog = () => {
    setEditingBlog(null);
    setBlogForm({
      title: '',
      author: 'Admin',
      content: '',
      excerpt: '',
      image: '',
      category: 'General',
      status: 'Draft',
      date: new Date().toISOString().split('T')[0]
    });
    setShowBlogModal(true);
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title || '',
      author: blog.author || 'Admin',
      content: blog.content || '',
      excerpt: blog.excerpt || '',
      image: blog.image || '',
      category: blog.category || 'General',
      status: blog.status || 'Draft',
      date: blog.date || new Date().toISOString().split('T')[0]
    });
    setShowBlogModal(true);
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteBlog(blogId);
        setBlogs(blogs.filter(b => b.id !== blogId));
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Failed to delete blog post.');
      }
    }
  };

  const handleSaveBlog = async () => {
    if (!blogForm.title.trim()) {
      alert('Please enter a title for the blog post.');
      return;
    }

    setSavingBlog(true);
    try {
      if (editingBlog) {
        // Update existing blog
        const updatedBlog = await updateBlog(editingBlog.id, blogForm);
        setBlogs(blogs.map(b => b.id === editingBlog.id ? updatedBlog : b));
      } else {
        // Add new blog
        const newBlog = await addBlog(blogForm);
        setBlogs([newBlog, ...blogs]);
      }
      setShowBlogModal(false);
      setBlogForm({
        title: '',
        author: 'Admin',
        content: '',
        excerpt: '',
        image: '',
        category: 'General',
        status: 'Draft',
        date: new Date().toISOString().split('T')[0]
      });
      setEditingBlog(null);
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Failed to save blog post. Please try again.');
    } finally {
      setSavingBlog(false);
    }
  };

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-amber-50 shadow-md flex flex-col h-screen transition-transform duration-300 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0 md:flex
      `}>
        <div className="p-6 border-b border-amber-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-black">Admin Dashboard</h1>
          <button
            className="md:hidden text-black"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mt-6">
          <button
            onClick={() => {
              setActiveSection('overview');
              setSelectedCategory(null);
              setIsSidebarOpen(false); // Close mobile sidebar on click
            }}
            className={`w-full text-left px-6 py-3 text-sm font-medium transition-colors ${activeSection === 'overview'
              ? 'bg-white text-black border-l-4 border-amber-500 shadow-sm'
              : 'text-black hover:bg-amber-100'
              }`}
          >
            Overview
          </button>
          <button
            onClick={() => {
              setActiveSection('products');
              setSelectedCategory(null);
              setIsSidebarOpen(false); // Close mobile sidebar on click
            }}
            className={`w-full text-left px-6 py-3 text-sm font-medium transition-colors ${activeSection === 'products'
              ? 'bg-white text-black border-l-4 border-amber-500 shadow-sm'
              : 'text-black hover:bg-amber-100'
              }`}
          >
            Products
          </button>
          <button
            onClick={() => {
              setActiveSection('users');
              setIsSidebarOpen(false); // Close mobile sidebar on click
            }}
            className={`w-full text-left px-6 py-3 text-sm font-medium transition-colors ${activeSection === 'users'
              ? 'bg-white text-black border-l-4 border-amber-500 shadow-sm'
              : 'text-black hover:bg-amber-100'
              }`}
          >
            Users
          </button>
          <button
            onClick={() => {
              setActiveSection('blogs');
              setIsSidebarOpen(false); // Close mobile sidebar on click
            }}
            className={`w-full text-left px-6 py-3 text-sm font-medium transition-colors ${activeSection === 'blogs'
              ? 'bg-white text-black border-l-4 border-amber-500 shadow-sm'
              : 'text-black hover:bg-amber-100'
              }`}
          >
            Blogs
          </button>
          <button
            onClick={() => {
              setActiveSection('sample-requests');
              setIsSidebarOpen(false); // Close mobile sidebar on click
            }}
            className={`w-full text-left px-6 py-3 text-sm font-medium transition-colors ${activeSection === 'sample-requests'
              ? 'bg-white text-black border-l-4 border-amber-500 shadow-sm'
              : 'text-black hover:bg-amber-100'
              }`}
          >
            Sample Requests
            {stats.counts?.pendingSampleRequests > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                {stats.counts.pendingSampleRequests}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveSection('contract-requests');
              setIsSidebarOpen(false); // Close mobile sidebar on click
            }}
            className={`w-full text-left px-6 py-3 text-sm font-medium transition-colors ${activeSection === 'contract-requests'
              ? 'bg-white text-black border-l-4 border-amber-500 shadow-sm'
              : 'text-black hover:bg-amber-100'
              }`}
          >
            Contract Requests
            {stats.counts?.pendingContractRequests > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                {stats.counts.pendingContractRequests}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveSection('partners');
              setIsSidebarOpen(false); // Close mobile sidebar on click
            }}
            className={`w-full text-left px-6 py-3 text-sm font-medium transition-colors ${activeSection === 'partners'
              ? 'bg-white text-black border-l-4 border-amber-500 shadow-sm'
              : 'text-black hover:bg-amber-100'
              }`}
          >
            Partners
          </button>
          <button
            onClick={() => {
              setActiveSection('top-products');
              setIsSidebarOpen(false); // Close mobile sidebar on click
            }}
            className={`w-full text-left px-6 py-3 text-sm font-medium transition-colors ${activeSection === 'top-products'
              ? 'bg-white text-black border-l-4 border-amber-500 shadow-sm'
              : 'text-black hover:bg-amber-100'
              }`}
          >
            Top Products
          </button>
          <button
            onClick={() => {
              setActiveSection('messages');
              setIsSidebarOpen(false); // Close mobile sidebar on click
            }}
            className={`w-full text-left px-6 py-3 text-sm font-medium transition-colors ${activeSection === 'messages'
              ? 'bg-white text-black border-l-4 border-amber-500 shadow-sm'
              : 'text-black hover:bg-amber-100'
              }`}
          >
            Messages
            {stats.unreadMessages > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                {stats.unreadMessages}
              </span>
            )}
          </button>
        </nav>

        <div className="mt-auto p-6 border-t border-amber-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors rounded-md"
          >
            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="mr-4 md:hidden text-gray-500 hover:text-gray-900 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h2 className="text-xl font-semibold text-gray-900">
                  {activeSection === 'overview' && 'Overview'}
                  {activeSection === 'products' && !selectedCategory && 'Product Categories'}
                  {activeSection === 'products' && selectedCategory && `Products in ${selectedCategory.name}`}
                  {activeSection === 'users' && 'Manage Users'}
                  {activeSection === 'blogs' && 'Manage Blogs'}
                  {activeSection === 'sample-requests' && 'Sample Requests'}
                  {activeSection === 'contract-requests' && 'Contract Requests'}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
            </div>
          )}

          {/* Overview Section */}
          {activeSection === 'overview' && !loading && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                {/* Users */}
                <div
                  onClick={() => setActiveSection('users')}
                  className="group bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 transform"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-amber-100 rounded-md p-3 transition-transform duration-700 group-hover:rotate-[360deg]">
                        <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">{stats.counts?.users || 0}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div
                  onClick={() => {
                    setActiveSection('products');
                    setSelectedCategory(null);
                  }}
                  className="group bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 transform"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-amber-100 rounded-md p-3 transition-transform duration-700 group-hover:rotate-[360deg]">
                        <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">{stats.counts?.products || 0}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sample Requests */}
                <div
                  onClick={() => setActiveSection('sample-requests')}
                  className="group bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 transform"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-amber-100 rounded-md p-3 transition-transform duration-700 group-hover:rotate-[360deg]">
                        <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Sample Requests</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">{stats.counts?.sampleRequests || 0}</div>
                            {stats.counts?.pendingSampleRequests > 0 && (
                              <span className="ml-2 text-sm text-yellow-600">({stats.counts.pendingSampleRequests} Pending)</span>
                            )}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contract Requests */}
                <div
                  onClick={() => setActiveSection('contract-requests')}
                  className="group bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 transform"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-amber-100 rounded-md p-3 transition-transform duration-700 group-hover:rotate-[360deg]">
                        <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Contract Requests</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">{stats.counts?.contractRequests || 0}</div>
                            {stats.counts?.pendingContractRequests > 0 && (
                              <span className="ml-2 text-sm text-yellow-600">({stats.counts.pendingContractRequests} Pending)</span>
                            )}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blogs */}
                <div
                  onClick={() => setActiveSection('blogs')}
                  className="group bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 transform"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-amber-100 rounded-md p-3 transition-transform duration-700 group-hover:rotate-[360deg]">
                        <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Blogs</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">{stats.counts?.blogs || 0}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div
                  onClick={() => setActiveSection('messages')}
                  className="group bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 transform"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-amber-100 rounded-md p-3 transition-transform duration-700 group-hover:rotate-[360deg]">
                        <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Messages</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">{stats.counts?.messages || 0}</div>
                            {stats.counts?.unreadMessages > 0 && (
                              <span className="ml-2 text-sm text-amber-600">({stats.counts.unreadMessages} New)</span>
                            )}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart Section */}
              <div className="bg-white px-4 py-5 shadow sm:p-6 rounded-lg mb-8">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Request History (Last 7 Days)</h3>
                <div className="h-80">
                  <Line
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top' },
                      },
                      scales: {
                        y: { beginAtZero: true, ticks: { stepSize: 1 } }
                      }
                    }}
                    data={{
                      labels: Array.from({ length: 7 }, (_, i) => {
                        const d = new Date();
                        d.setDate(d.getDate() - (6 - i));
                        return d.toLocaleDateString();
                      }),
                      datasets: [
                        {
                          label: 'Sample Requests',
                          data: Array.from({ length: 7 }, (_, i) => {
                            const d = new Date();
                            d.setDate(d.getDate() - (6 - i));
                            const dateStr = d.toISOString().split('T')[0];
                            return stats.chartData?.filter(r =>
                              r.type === 'sample' &&
                              r.date &&
                              new Date(r.date).toISOString().split('T')[0] === dateStr
                            ).length || 0;
                          }),
                          borderColor: 'rgb(53, 162, 235)',
                          backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        },
                        {
                          label: 'Contract Requests',
                          data: Array.from({ length: 7 }, (_, i) => {
                            const d = new Date();
                            d.setDate(d.getDate() - (6 - i));
                            const dateStr = d.toISOString().split('T')[0];
                            return stats.chartData?.filter(r =>
                              r.type === 'contract' &&
                              r.date &&
                              new Date(r.date).toISOString().split('T')[0] === dateStr
                            ).length || 0;
                          }),
                          borderColor: 'rgb(75, 192, 192)',
                          backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        },
                      ],
                    }}
                  />
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activities</h3>
                </div>
                <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {stats.recentActivities?.length > 0 ? (
                    stats.recentActivities.map((activity, index) => (
                      <li key={index} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ring-8 ring-white
                                ${activity.type === 'user' ? 'bg-blue-500' :
                                activity.type === 'product' ? 'bg-amber-500' :
                                  activity.type === 'message' ? 'bg-yellow-500' :
                                    'bg-purple-500' // Requests
                              }`}>
                              <span className="text-white text-xs font-bold">{activity.type[0].toUpperCase()}</span>
                            </span>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                              <p className="text-sm text-gray-500">
                                {activity.details}
                              </p>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {activity.date ? new Date(activity.date).toLocaleString() : 'Just now'}
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-4 sm:px-6 text-center text-gray-500">No recent activities found</li>
                  )}
                </ul>
              </div>

            </div>
          )}

          {/* Products Section */}
          {activeSection === 'products' && !loading && (
            <div>
              {!selectedCategory ? (
                // Categories View
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Product Categories</h2>
                    <button
                      onClick={handleAddCategory}
                      className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors"
                    >
                      Add Category
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                      <div key={category.id} className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 transform">
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{category.name}</h3>
                              <p className="text-gray-600">
                                {category.attributes.length} attributes
                              </p>
                            </div>
                            <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden border-2 border-amber-100 bg-amber-50 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-inner">
                              {category.image ? (
                                <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                              ) : (
                                <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {category.attributes.slice(0, 3).map((attr, index) => (
                              <span key={index} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
                                {attr}
                              </span>
                            ))}
                            {category.attributes.length > 3 && (
                              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                +{category.attributes.length - 3} more
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between">
                            <button
                              onClick={() => {
                                // Find the most up-to-date category from the categories array
                                const updatedCategory = categories.find(cat => cat.id === category.id);
                                setSelectedCategory(updatedCategory || category);
                              }}
                              className="text-amber-600 hover:text-amber-800 font-medium"
                            >
                              View Products
                            </button>
                            <div className="space-x-2">
                              <button
                                onClick={() => handleEditCategory(category)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(category.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Products View for Selected Category
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <button
                        onClick={handleBackToCategories}
                        className="text-amber-600 hover:text-amber-800 font-medium mb-2 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Back to Categories
                      </button>
                      <h2 className="text-2xl font-bold text-gray-900">Products in {selectedCategory.name}</h2>
                    </div>
                    <button
                      onClick={handleAddProduct}
                      className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors"
                    >
                      Add Product
                    </button>
                  </div>

                  <div className="bg-white shadow rounded-lg overflow-x-auto max-h-[calc(100vh-320px)] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                        <tr>
                          {/* Regular attributes */}
                          {selectedCategory.attributes.map((attr) => (
                            <th key={attr} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                              {attr.charAt(0).toUpperCase() + attr.slice(1)}
                            </th>
                          ))}
                          {/* Predefined attributes */}
                          {selectedCategory.predefinedAttributes && Object.keys(selectedCategory.predefinedAttributes).map((attr) => (
                            <th key={attr} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                              {attr.charAt(0).toUpperCase() + attr.slice(1)}
                            </th>
                          ))}
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {categoryProducts.map((product) => (
                          <tr key={product.id}>
                            {/* Regular attributes */}
                            {selectedCategory.attributes.map((attr) => (
                              <td key={attr} className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                {product[attr]}
                              </td>
                            ))}
                            {/* Predefined attributes */}
                            {selectedCategory.predefinedAttributes && Object.keys(selectedCategory.predefinedAttributes).map((attr) => (
                              <td key={attr} className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                {product[attr] || ''}
                              </td>
                            ))}
                            <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                        {categoryProducts.length === 0 && (
                          <tr>
                            <td colSpan={selectedCategory.attributes.length + (selectedCategory.predefinedAttributes ? Object.keys(selectedCategory.predefinedAttributes).length : 0) + 1} className="px-6 py-4 text-center text-sm text-gray-500">
                              No products found in this category
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'partners' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Partners</h1>

              {/* Add Partner Form */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-lg font-semibold mb-4">Add New Partner</h3>
                <form onSubmit={handleAddPartner} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Partner Name</label>
                    <input
                      type="text"
                      value={partnerForm.name}
                      onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="e.g. Starbucks"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Logo URL</label>
                    <input
                      type="text"
                      value={partnerForm.logo}
                      onChange={(e) => setPartnerForm({ ...partnerForm, logo: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={savingPartner}
                    className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700"
                  >
                    {savingPartner ? 'Adding...' : 'Add Partner'}
                  </button>
                </form>
              </div>

              {/* Partners List */}
              <div className="bg-white shadow rounded-lg overflow-x-auto max-h-[calc(100vh-320px)] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {partners.map((partner) => (
                      <tr key={partner.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img src={partner.logo} alt={partner.name} className="h-10 w-10 object-contain" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{partner.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeletePartner(partner.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {partners.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No partners found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'top-products' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Top Products</h1>
              <p className="mb-4 text-gray-600">Select which products appear in the "Premium Products" section on the homepage.</p>

              {/* Product Search Bar */}
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <input
                  type="text"
                  placeholder="Search products by name or category..."
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="bg-white shadow rounded-lg overflow-x-auto max-h-[calc(100vh-320px)] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('topProducts', 'name')}
                      >
                        <div className="flex items-center">
                          Product Name <SortIcon section="topProducts" column="name" />
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('topProducts', 'category')}
                      >
                        <div className="flex items-center">
                          Category <SortIcon section="topProducts" column="category" />
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('topProducts', 'isTopProduct')}
                      >
                        <div className="flex items-center">
                          Is Top Product? <SortIcon section="topProducts" column="isTopProduct" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortData(
                      products.filter(p =>
                        (p.name || p.Name || '').toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                        (p.category || '').toLowerCase().includes(productSearchTerm.toLowerCase())
                      ),
                      'topProducts'
                    ).map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.name || product.Name || 'Unnamed Product'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.category || 'Uncategorized'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleToggleTopProduct(product)}
                            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${product.isTopProduct ? 'bg-amber-600' : 'bg-gray-200'
                              }`}
                          >
                            <span
                              aria-hidden="true"
                              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${product.isTopProduct ? 'translate-x-5' : 'translate-x-0'
                                }`}
                            />
                          </button>
                          <span className="ml-3 text-sm text-gray-500">
                            {product.isTopProduct ? 'Featured' : 'Standard'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users Section */}
          {activeSection === 'users' && !loading && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Users</h2>

              {/* Search Bar */}
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="bg-white shadow rounded-lg overflow-x-auto max-h-[calc(100vh-300px)] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('users', 'name')}
                      >
                        <div className="flex items-center">
                          Name <SortIcon section="users" column="name" />
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('users', 'email')}
                      >
                        <div className="flex items-center">
                          Email <SortIcon section="users" column="email" />
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('users', 'role')}
                      >
                        <div className="flex items-center">
                          Role <SortIcon section="users" column="role" />
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('users', 'status')}
                      >
                        <div className="flex items-center">
                          Status <SortIcon section="users" column="status" />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortData(
                      users.filter(user =>
                        (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
                      ),
                      'users'
                    ).map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name || user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}>
                            {user.role || 'user'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'banned' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                            {user.status === 'banned' ? 'Banned' : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="text-amber-600 hover:text-amber-900 mr-3"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={() => handleBanUser(user)}
                            className={`font-medium ${user.status === 'banned'
                              ? 'text-amber-600 hover:text-amber-900'
                              : 'text-red-600 hover:text-red-900'
                              }`}
                          >
                            {user.status === 'banned' ? 'Unban User' : 'Ban User'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No users found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* User Details Modal */}
          {selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">User Profile</h3>
                  <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="px-6 py-6 space-y-6">
                  {/* Read-only Attributes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                    <div className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                      {selectedUser.name || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email Address</label>
                    <div className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                      {selectedUser.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">User ID</label>
                    <div className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 font-mono text-sm">
                      {selectedUser.id}
                    </div>
                  </div>

                  {/* Editable Attributes */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                      <select
                        id="role"
                        value={selectedUser.role || 'user'}
                        onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        id="status"
                        value={selectedUser.status || 'active'}
                        onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
                      >
                        <option value="active">Active</option>
                        <option value="banned">Banned</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      setLoading(true);
                      try {
                        const result = await updateUserData(selectedUser.id, {
                          role: selectedUser.role,
                          status: selectedUser.status
                        });

                        if (result.success) {
                          // Update local state
                          setUsers(users.map(u => u.id === selectedUser.id ? { ...u, role: selectedUser.role, status: selectedUser.status } : u));
                          setSelectedUser(null);
                          alert('User profile updated successfully.');
                        } else {
                          alert('Failed to update user profile: ' + result.error);
                        }
                      } catch (error) {
                        console.error('Error in save:', error);
                        alert('An error occurred while saving.');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Messages Section */}
          {activeSection === 'messages' && !loading && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Messages</h2>

              {/* Message Search Bar */}
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <input
                  type="text"
                  placeholder="Search messages by name, email, or subject..."
                  value={messageSearchTerm}
                  onChange={(e) => setMessageSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Messages Table Container */}
              <div className="bg-white shadow rounded-lg overflow-x-auto max-h-[calc(100vh-300px)] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('messages', 'createdAt')}
                      >
                        <div className="flex items-center">
                          Date <SortIcon section="messages" column="createdAt" />
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('messages', 'name')}
                      >
                        <div className="flex items-center">
                          From <SortIcon section="messages" column="name" />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('messages', 'read')}
                      >
                        <div className="flex items-center">
                          Status <SortIcon section="messages" column="read" />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortData(
                      messages.filter(msg =>
                        (msg.name?.toLowerCase() || '').includes(messageSearchTerm.toLowerCase()) ||
                        (msg.email?.toLowerCase() || '').includes(messageSearchTerm.toLowerCase()) ||
                        (msg.subject?.toLowerCase() || '').includes(messageSearchTerm.toLowerCase())
                      ),
                      'messages'
                    ).map((msg) => (
                      <tr key={msg.id} className={!msg.read ? 'bg-amber-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="text-sm font-medium text-gray-900">{msg.name}</div>
                          <div className="text-sm text-gray-500">{msg.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {msg.subject}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {msg.message}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${msg.read ? 'bg-gray-100 text-gray-800' : 'bg-amber-100 text-amber-800'}`}>
                            {msg.read ? 'Read' : 'New'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setSelectedMessage(msg)}
                            className="text-amber-600 hover:text-amber-900 mr-3"
                          >
                            View
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                const newStatus = !msg.read;
                                await updateMessageStatus(msg.id, newStatus);
                                setMessages(messages.map(m => m.id === msg.id ? { ...m, read: newStatus } : m));
                                // Update stats locally
                                setStats(prev => ({
                                  ...prev,
                                  unreadMessages: newStatus
                                    ? Math.max(0, prev.unreadMessages - 1)
                                    : prev.unreadMessages + 1
                                }));
                              } catch (error) {
                                console.error('Error updating message status:', error);
                              }
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Mark as {msg.read ? 'Unread' : 'Read'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {messages.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No messages found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Message Details Modal */}
          {selectedMessage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Message Details</h3>
                  <button onClick={() => setSelectedMessage(null)} className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="px-6 py-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-sm font-medium text-gray-500">From</span>
                      <span className="block text-base text-gray-900">{selectedMessage.name}</span>
                      <span className="block text-sm text-gray-600">{selectedMessage.email}</span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-500">Date</span>
                      <span className="block text-base text-gray-900">{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Subject</span>
                    <span className="block text-base text-gray-900 font-medium">{selectedMessage.subject}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500 mb-2">Message</span>
                    <div className="bg-gray-50 p-4 rounded-md text-gray-800 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 flex justify-end">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-amber-700 hover:bg-amber-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Blogs Section */}
          {activeSection === 'blogs' && !loading && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Manage Blogs</h2>
                <button
                  onClick={handleAddBlog}
                  className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition duration-300"
                >
                  + Create New Post
                </button>
              </div>

              {/* Blog Search Bar */}
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <input
                  type="text"
                  placeholder="Search blogs by title or author..."
                  value={blogSearchTerm}
                  onChange={(e) => setBlogSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="bg-white shadow rounded-lg overflow-x-auto max-h-[calc(100vh-300px)] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('blogs', 'title')}
                      >
                        <div className="flex items-center">
                          Title <SortIcon section="blogs" column="title" />
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('blogs', 'author')}
                      >
                        <div className="flex items-center">
                          Author <SortIcon section="blogs" column="author" />
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('blogs', 'date')}
                      >
                        <div className="flex items-center">
                          Date <SortIcon section="blogs" column="date" />
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('blogs', 'status')}
                      >
                        <div className="flex items-center">
                          Status <SortIcon section="blogs" column="status" />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortData(
                      blogs.filter(blog =>
                        (blog.title?.toLowerCase() || '').includes(blogSearchTerm.toLowerCase()) ||
                        (blog.author?.toLowerCase() || '').includes(blogSearchTerm.toLowerCase())
                      ),
                      'blogs'
                    ).map((blog) => (
                      <tr key={blog.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{blog.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog.author}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${blog.status === 'Published'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {blog.status || 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditBlog(blog)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {blogs.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          No blog posts found. Click "Create New Post" to add one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sample Requests Section */}
          {activeSection === 'sample-requests' && !loading && (
            <div>
              {/* Search Bar */}
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <input
                  type="text"
                  placeholder="Search sample requests by customer, product, or email..."
                  value={sampleRequestSearchTerm}
                  onChange={(e) => setSampleRequestSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="bg-white shadow rounded-lg overflow-x-auto max-h-[calc(100vh-300px)] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('sampleRequests', 'createdAt')}
                      >
                        <div className="flex items-center">
                          Date <SortIcon section="sampleRequests" column="createdAt" />
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('sampleRequests', 'userName')}
                      >
                        <div className="flex items-center">
                          Customer <SortIcon section="sampleRequests" column="userName" />
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('sampleRequests', 'productName')}
                      >
                        <div className="flex items-center">
                          Product <SortIcon section="sampleRequests" column="productName" />
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('sampleRequests', 'status')}
                      >
                        <div className="flex items-center">
                          Status <SortIcon section="sampleRequests" column="status" />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortData(
                      sampleRequests.filter(r =>
                        r.userName?.toLowerCase().includes(sampleRequestSearchTerm.toLowerCase()) ||
                        r.userEmail?.toLowerCase().includes(sampleRequestSearchTerm.toLowerCase()) ||
                        r.productName?.toLowerCase().includes(sampleRequestSearchTerm.toLowerCase())
                      ),
                      'sampleRequests'
                    ).map((request) => (
                      <tr key={request.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.createdAt ? new Date(request.createdAt.seconds ? request.createdAt.seconds * 1000 : request.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{request.userName}</div>
                          <div className="text-sm text-gray-500">{request.userEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.productName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${request.status === 'Approved' ? 'bg-amber-100 text-amber-800' :
                              request.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {request.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setSelectedRequest({ ...request, type: 'sample' })}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                    {sampleRequests.length === 0 && (
                      <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No sample requests found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Contract Requests Section */}
          {activeSection === 'contract-requests' && !loading && (
            <div>
              {/* Search Bar */}
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <input
                  type="text"
                  placeholder="Search contract requests by customer, company, or product..."
                  value={contractRequestSearchTerm}
                  onChange={(e) => setContractRequestSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="bg-white shadow rounded-lg overflow-x-auto max-h-[calc(100vh-300px)] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('contractRequests', 'createdAt')}
                      >
                        <div className="flex items-center">
                          Date <SortIcon section="contractRequests" column="createdAt" />
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('contractRequests', 'userName')}
                      >
                        <div className="flex items-center">
                          Customer <SortIcon section="contractRequests" column="userName" />
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('contractRequests', 'company.name')}
                      >
                        <div className="flex items-center">
                          Company <SortIcon section="contractRequests" column="company.name" />
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('contractRequests', 'productName')}
                      >
                        <div className="flex items-center">
                          Product <SortIcon section="contractRequests" column="productName" />
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('contractRequests', 'totalPrice')}
                      >
                        <div className="flex items-center">
                          Total <SortIcon section="contractRequests" column="totalPrice" />
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('contractRequests', 'status')}
                      >
                        <div className="flex items-center">
                          Status <SortIcon section="contractRequests" column="status" />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortData(
                      contractRequests.filter(r =>
                        r.userName?.toLowerCase().includes(contractRequestSearchTerm.toLowerCase()) ||
                        r.userEmail?.toLowerCase().includes(contractRequestSearchTerm.toLowerCase()) ||
                        r.productName?.toLowerCase().includes(contractRequestSearchTerm.toLowerCase()) ||
                        r.company?.name?.toLowerCase().includes(contractRequestSearchTerm.toLowerCase())
                      ),
                      'contractRequests'
                    ).map((request) => (
                      <tr key={request.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.createdAt ? new Date(request.createdAt.seconds ? request.createdAt.seconds * 1000 : request.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{request.userName}</div>
                          <div className="text-sm text-gray-500">{request.userEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.company ? request.company.name : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.productName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          ${request.totalPrice ? request.totalPrice.toLocaleString() : '0'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${request.status === 'Approved' ? 'bg-amber-100 text-amber-800' :
                              request.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {request.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setSelectedRequest({ ...request, type: 'contract' })}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                    {contractRequests.length === 0 && (
                      <tr><td colSpan="7" className="px-6 py-4 text-center text-gray-500">No contract requests found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Request Details Modal */}
          {selectedRequest && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedRequest.type === 'sample' ? 'Sample Request Details' : 'Contract Request Details'}
                  </h3>
                  <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="px-6 py-6 space-y-6">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-md flex items-center justify-between
                    ${selectedRequest.status === 'Approved' ? 'bg-amber-50 border border-amber-200' :
                      selectedRequest.status === 'Rejected' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Current Status</span>
                      <span className={`text-lg font-bold
                        ${selectedRequest.status === 'Approved' ? 'text-amber-700' :
                          selectedRequest.status === 'Rejected' ? 'text-red-700' : 'text-yellow-700'}`}>
                        {selectedRequest.status || 'Pending'}
                      </span>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={async () => {
                          const collection = selectedRequest.type === 'sample' ? 'sample_requests' : 'contract_requests';
                          await updateRequestStatus(collection, selectedRequest.id, 'Approved');
                          if (selectedRequest.type === 'sample') {
                            setSampleRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: 'Approved' } : r));
                          } else {
                            setContractRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: 'Approved' } : r));
                          }
                          setSelectedRequest(prev => ({ ...prev, status: 'Approved' }));
                        }}
                        className="px-3 py-1 bg-amber-600 text-white text-sm rounded hover:bg-amber-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={async () => {
                          const collection = selectedRequest.type === 'sample' ? 'sample_requests' : 'contract_requests';
                          await updateRequestStatus(collection, selectedRequest.id, 'Rejected');
                          if (selectedRequest.type === 'sample') {
                            setSampleRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: 'Rejected' } : r));
                          } else {
                            setContractRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: 'Rejected' } : r));
                          }
                          setSelectedRequest(prev => ({ ...prev, status: 'Rejected' }));
                        }}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 border-b pb-2 mb-3">Customer Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500">Name</label>
                        <p className="font-medium">{selectedRequest.userName}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Email</label>
                        <p className="font-medium">{selectedRequest.userEmail}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">User ID</label>
                        <p className="text-xs text-gray-400 font-mono">{selectedRequest.userId}</p>
                      </div>
                    </div>
                  </div>

                  {/* Request Specific Details */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 border-b pb-2 mb-3">
                      {selectedRequest.type === 'sample' ? 'Sample Details' : 'Contract Details'}
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Shared Product Details */}
                      <div>
                        <label className="text-sm text-gray-500">Product</label>
                        <p className="font-medium text-amber-700">{selectedRequest.productName}</p>
                        <p className="text-sm text-gray-500">Grade: {selectedRequest.productGrade}</p>
                      </div>

                      {/* Sample Specifics */}
                      {selectedRequest.type === 'sample' && (
                        <>
                          <div>
                            <label className="text-sm text-gray-500">Sample Size</label>
                            <p className="font-medium">{selectedRequest.sampleSize}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">Delivery Method</label>
                            <p className="font-medium">{selectedRequest.deliveryMethod}</p>
                          </div>
                        </>
                      )}

                      {/* Contract Specifics */}
                      {selectedRequest.type === 'contract' && (
                        <>
                          <div>
                            <label className="text-sm text-gray-500">Quantity</label>
                            <p className="font-medium">{selectedRequest.quantity} tons</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">Total Price</label>
                            <p className="font-medium text-lg">${selectedRequest.totalPrice?.toLocaleString()}</p>
                          </div>
                        </>
                      )}

                      {/* Company & Address Details */}
                      {selectedRequest.company && (
                        <div className="col-span-2 space-y-4 pt-2 border-t border-gray-100">
                          <div>
                            <label className="text-sm text-gray-500 mb-1 block">Company Details</label>
                            <div className="bg-gray-50 p-3 rounded text-sm">
                              <p className="font-bold text-base">{selectedRequest.company.name}</p>
                              <p>Phone: {selectedRequest.company.phone || 'N/A'}</p>
                              <p>Email: {selectedRequest.company.email || 'N/A'}</p>
                              {selectedRequest.company.address && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  <p className="font-semibold text-xs text-gray-500">Headquarters Address:</p>
                                  <p>{selectedRequest.company.address.street}</p>
                                  <p>{selectedRequest.company.address.city}, {selectedRequest.company.address.country}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedRequest.address && (
                        <div className="col-span-2">
                          <label className="text-sm text-gray-500 mb-1 block">Delivery Address</label>
                          {(() => {
                            try {
                              const addr = typeof selectedRequest.address === 'string' ? JSON.parse(selectedRequest.address) : selectedRequest.address;
                              return (
                                <div className="bg-gray-50 p-3 rounded text-sm border border-gray-200">
                                  <p className="font-bold">{addr.label}</p>
                                  <p>{addr.street}</p>
                                  <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                                  <p>{addr.country}</p>
                                </div>
                              );
                            } catch (e) { return <p>Invalid Address Data</p>; }
                          })()}
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-white focus:outline-none"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Modal */}
      {
        showCategoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingCategory ? 'Edit Category' : 'Add Category'}
                </h3>
              </div>
              <div className="px-6 py-4 max-h-96 overflow-y-auto">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter category name"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Image URL</label>
                  <input
                    type="text"
                    value={categoryForm.image || ''}
                    onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attributes</label>
                  <div className="flex mb-2">
                    <input
                      type="text"
                      value={newAttribute}
                      onChange={(e) => setNewAttribute(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Enter attribute name"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddAttribute()}
                    />
                    <button
                      type="button"
                      onClick={handleAddAttribute}
                      className="bg-amber-600 text-white px-4 py-2 rounded-r-md hover:bg-amber-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categoryForm.attributes.map((attr, index) => (
                      <div key={index} className="flex items-center bg-amber-100 text-amber-800 px-2 py-1 rounded">
                        <span>{attr}</span>
                        {!['Name', 'Min order', 'Price', 'Owner', 'Image'].includes(attr) && (
                          <button
                            type="button"
                            onClick={() => handleRemoveAttribute(attr)}
                            className="ml-2 text-amber-600 hover:text-amber-800"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Predefined Attributes Section */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Predefined Attributes</label>
                  <p className="text-xs text-gray-500 mb-2">Define attributes with predefined values for dropdown selection</p>

                  {/* Add new predefined attribute */}
                  <div className="flex mb-2 space-x-2">
                    <input
                      type="text"
                      value={newPredefinedAttribute.name || ''}
                      onChange={(e) => setNewPredefinedAttribute({ ...newPredefinedAttribute, name: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Attribute name (e.g., process, grade)"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newPredefinedAttribute.name && newPredefinedAttribute.values && newPredefinedAttribute.values.length > 0) {
                          setCategoryForm({
                            ...categoryForm,
                            predefinedAttributes: {
                              ...(categoryForm.predefinedAttributes || {}),
                              [newPredefinedAttribute.name]: {
                                values: newPredefinedAttribute.values
                              }
                            }
                          });
                          setNewPredefinedAttribute({ name: '', values: [], currentValue: '' });
                        }
                      }}
                      className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700"
                      disabled={!newPredefinedAttribute.name || !newPredefinedAttribute.values || newPredefinedAttribute.values.length === 0}
                    >
                      Add
                    </button>
                  </div>

                  {/* Add values to predefined attribute */}
                  {newPredefinedAttribute.name && (
                    <div className="mb-3">
                      <div className="flex mb-2 space-x-2">
                        <input
                          type="text"
                          value={newPredefinedAttribute.currentValue || ''}
                          onChange={(e) => setNewPredefinedAttribute({ ...newPredefinedAttribute, currentValue: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                          placeholder="Enter value"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && newPredefinedAttribute.currentValue) {
                              setNewPredefinedAttribute({
                                ...newPredefinedAttribute,
                                values: [...newPredefinedAttribute.values, newPredefinedAttribute.currentValue],
                                currentValue: ''
                              });
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newPredefinedAttribute.currentValue) {
                              setNewPredefinedAttribute({
                                ...newPredefinedAttribute,
                                values: [...newPredefinedAttribute.values, newPredefinedAttribute.currentValue],
                                currentValue: ''
                              });
                            }
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                          disabled={!newPredefinedAttribute.currentValue}
                        >
                          Add Value
                        </button>
                      </div>

                      {/* Display current values */}
                      {newPredefinedAttribute.values.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {newPredefinedAttribute.values.map((val, idx) => (
                            <div key={idx} className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              <span>{val}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newValues = [...newPredefinedAttribute.values];
                                  newValues.splice(idx, 1);
                                  setNewPredefinedAttribute({ ...newPredefinedAttribute, values: newValues });
                                }}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Display existing predefined attributes */}
                  {categoryForm.predefinedAttributes && Object.keys(categoryForm.predefinedAttributes).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Defined Predefined Attributes:</h4>
                      {Object.entries(categoryForm.predefinedAttributes).map(([attrName, attrConfig]) => (
                        <div key={attrName} className="mb-3 p-3 bg-gray-50 rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-gray-800">{attrName}</span>
                            {attrName !== 'Availability' && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newPredefinedAttributes = { ...categoryForm.predefinedAttributes };
                                  delete newPredefinedAttributes[attrName];
                                  setCategoryForm({
                                    ...categoryForm,
                                    predefinedAttributes: newPredefinedAttributes
                                  });
                                }}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {attrConfig.values.map((val, idx) => (
                              <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {val}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCategoryModal(false);
                    setCategoryForm({ name: '', attributes: [], predefinedAttributes: {} });
                    setNewPredefinedAttribute({ name: '', values: [], currentValue: '' });
                    setEditingCategory(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCategory}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )
      }
      {
        showProductModal && selectedCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add Product'}
                </h3>
              </div>
              <div className="px-6 py-4 max-h-96 overflow-y-auto">
                {/* Render regular attributes */}
                {selectedCategory.attributes.map((attr) => {
                  // Check if this attribute has predefined values
                  const hasPredefinedValues = selectedCategory.predefinedAttributes &&
                    selectedCategory.predefinedAttributes[attr] &&
                    selectedCategory.predefinedAttributes[attr].values &&
                    selectedCategory.predefinedAttributes[attr].values.length > 0;

                  return (
                    <div key={attr} className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {attr.charAt(0).toUpperCase() + attr.slice(1)}
                      </label>
                      {hasPredefinedValues ? (
                        // Render dropdown for predefined attributes
                        <select
                          value={productForm[attr] || ''}
                          onChange={(e) => setProductForm({ ...productForm, [attr]: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        >
                          <option value="">Select {attr}</option>
                          {selectedCategory.predefinedAttributes[attr].values.map((value, index) => (
                            <option key={index} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      ) : (
                        // Render input for regular attributes
                        <input
                          type={attr.toLowerCase() === 'price' ? 'number' : 'text'}
                          step={attr.toLowerCase() === 'price' ? '0.01' : undefined}
                          value={productForm[attr] || ''}
                          onChange={(e) => setProductForm({ ...productForm, [attr]: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                          placeholder={`Enter ${attr}`}
                        />
                      )}
                    </div>
                  );
                })}

                {/* Render predefined attributes that are not in regular attributes */}
                {selectedCategory.predefinedAttributes && Object.keys(selectedCategory.predefinedAttributes).map((attr) => {
                  // Skip if this attribute is already in regular attributes
                  if (selectedCategory.attributes.includes(attr)) return null;

                  return (
                    <div key={attr} className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {attr.charAt(0).toUpperCase() + attr.slice(1)}
                      </label>
                      <select
                        value={productForm[attr] || ''}
                        onChange={(e) => setProductForm({ ...productForm, [attr]: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      >
                        <option value="">Select {attr}</option>
                        {selectedCategory.predefinedAttributes[attr].values.map((value, index) => (
                          <option key={index} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowProductModal(false);
                    setProductForm({});
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProduct}
                  disabled={savingProduct}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${savingProduct
                    ? 'bg-amber-400 cursor-not-allowed'
                    : 'bg-amber-600 hover:bg-amber-700'
                    }`}
                >
                  {savingProduct ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    editingProduct ? 'Update' : 'Create'
                  )}
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Blog Modal */}
      {
        showBlogModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h3>
              </div>
              <div className="px-6 py-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter blog title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                    <input
                      type="text"
                      value={blogForm.author}
                      onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Author name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={blogForm.date}
                      onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={blogForm.status}
                      onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={blogForm.category}
                      onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      placeholder="e.g. Market Trends"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
                  <input
                    type="text"
                    value={blogForm.image}
                    onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (Short Description)</label>
                  <textarea
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Brief summary of the blog post..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <div className="bg-white">
                    <ReactQuill
                      theme="snow"
                      value={blogForm.content}
                      onChange={(value) => setBlogForm({ ...blogForm, content: value })}
                      className="h-64 mb-12"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowBlogModal(false);
                    setBlogForm({
                      title: '',
                      author: 'Admin',
                      content: '',
                      excerpt: '',
                      imageUrl: '',
                      status: 'Draft',
                      date: new Date().toISOString().split('T')[0]
                    });
                    setEditingBlog(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBlog}
                  disabled={savingBlog}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${savingBlog ? 'bg-amber-400 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700'
                    }`}
                >
                  {savingBlog ? 'Saving...' : (editingBlog ? 'Update Post' : 'Create Post')}
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default AdminDashboard;