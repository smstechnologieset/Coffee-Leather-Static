import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Navbar from './Navbar';
import Footer from './Footer';
import { getProducts } from '../services/firebaseService';
import { getCategories } from '../services/categoryService';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
const ProductsPage = () => {
  // Inject CSS for scrollbar hiding
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [selectedProduct, setSelectedProduct] = useState(null); // For popup
  const [graphProduct, setGraphProduct] = useState(null); // For graph updates
  const [priceData, setPriceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsToShow, setItemsToShow] = useState(6); // Initially show 6 products (2 rows x 3 columns)
  const [products, setProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [categories, setCategories] = useState([]); // Store full category objects

  // Refs for draggable scrolling and auto-scroll
  const scrollContainerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const autoScrollPaused = useRef(false);
  const animationFrameId = useRef(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Automatic scrolling logic
    const scroll = () => {
      if (!autoScrollPaused.current && !isDragging.current) {
        container.scrollLeft += 1; // Speed of auto-scroll

        // Loop back when we've scrolled half the content (since products are duplicated)
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      animationFrameId.current = requestAnimationFrame(scroll);
    };

    animationFrameId.current = requestAnimationFrame(scroll);

    // Mouse handlers for dragging
    const handleMouseDown = (e) => {
      isDragging.current = true;
      startX.current = e.pageX - container.offsetLeft;
      scrollLeftStart.current = container.scrollLeft;
      container.style.cursor = 'grabbing';
      autoScrollPaused.current = true;
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX.current) * 2; // Scroll multiplier
      container.scrollLeft = scrollLeftStart.current - walk;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      container.style.cursor = 'grab';
      // Short delay before resuming auto-scroll
      setTimeout(() => {
        if (!isDragging.current) autoScrollPaused.current = false;
      }, 1000);
    };

    const handleMouseLeave = () => {
      if (isDragging.current) handleMouseUp();
      autoScrollPaused.current = false;
    };

    const handleMouseEnter = () => {
      autoScrollPaused.current = true;
    };

    // Touch handlers for mobile
    const handleTouchStart = (e) => {
      isDragging.current = true;
      startX.current = e.touches[0].pageX - container.offsetLeft;
      scrollLeftStart.current = container.scrollLeft;
      autoScrollPaused.current = true;
    };

    const handleTouchMove = (e) => {
      if (!isDragging.current) return;
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX.current) * 2;
      container.scrollLeft = scrollLeftStart.current - walk;
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
      setTimeout(() => {
        if (!isDragging.current) autoScrollPaused.current = false;
      }, 1000);
    };

    // Event listeners
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);

      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Fetch products and categories from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories first to ensure we can map category IDs to names
        const categoriesData = await getCategories();
        const categoryNames = categoriesData.map(category => category.name);
        setCategoriesList(["All Categories", ...categoryNames]);
        setCategories(categoriesData); // Store full category objects for later use

        // Fetch products
        const productsData = await getProducts();

        // Simple mapping - only the specific attributes from your Firestore structure
        const formattedProducts = productsData.map((product, index) => {
          // Debug: Log raw product data to see what attributes are available
          if (index === 0) {
          }

          // Determine Category Name
          let categoryName = product.Category || product.category || 'Uncategorized';

          // If category is "Uncategorized" or missing, try to resolve via categoryId
          if ((!categoryName || categoryName === 'Uncategorized') && product.categoryId) {
            const matchedCategory = categoriesData.find(c => c.id === product.categoryId);
            if (matchedCategory) {
              categoryName = matchedCategory.name;
            }
          }

          // Extract only the specific attributes you specified
          const simpleProduct = {
            id: product.id || `product-${index}`,
            name: product.Name || product.name || 'Unnamed Product',
            owner: product.Owner || product.owner || 'Unknown Owner',
            category: categoryName,
            categoryId: product.categoryId || null, // Include categoryId for proper filtering
            currentPrice: 0,
            previousPrice: 0,
            // Include priceHistory if it exists
            priceHistory: product.priceHistory || [],
          };

          // Dynamically add all product attributes that might be used in filtering
          // This includes predefined attributes like Liter, Process, Grade, etc.
          Object.keys(product).forEach(key => {
            // Skip internal fields and fields we've already handled
            if (['id', 'Name', 'name', 'Owner', 'owner', 'Category', 'category', 'categoryId', 'Price', 'price', 'Previous Price', 'previousPrice', 'priceHistory'].includes(key)) {
              return;
            }

            // Normalise availability field for comparison
            if (key.toLowerCase().trim() === 'availability') {
              simpleProduct.Availability = product[key];
            } else {
              simpleProduct[key] = product[key];
            }
          });

          // REMOVED: Forced default values for process and grade. 
          // If they don't exist, they shouldn't be in the object.
          // This prevents "Ghost Attributes" like Grade appearing on Oil products.

          // Handle price extraction from string fields
          if (product.Price) {
            // Handle string prices like '$100/ton' - extract numeric part
            const priceMatch = product.Price.toString().match(/[\d.]+/);
            if (priceMatch) {
              simpleProduct.currentPrice = parseFloat(priceMatch[0]) || 0;
            }
          }

          if (product['Previous Price']) {
            // Handle string prices like '$95/ton' - extract numeric part
            const prevPriceMatch = product['Previous Price'].toString().match(/[\d.]+/);
            if (prevPriceMatch) {
              simpleProduct.previousPrice = parseFloat(prevPriceMatch[0]) || 0;
            }
          }

          // If no previous price found, derive it (but only if we have current price)
          if (simpleProduct.previousPrice === 0 && simpleProduct.currentPrice > 0) {
            simpleProduct.previousPrice = simpleProduct.currentPrice * 0.95;
          }

          // Ensure category is a string
          if (typeof simpleProduct.category !== 'string') {
            simpleProduct.category = 'Uncategorized';
          }

          // Debug: Log formatted product to see what we extracted
          if (index === 0) {
          }

          return simpleProduct;
        });

        setProducts(formattedProducts);

        // Set initial state
        if (formattedProducts.length > 0) {
          const firstProduct = formattedProducts[0];
          setGraphProduct(firstProduct); // Set graph product instead
          setPriceData(generatePriceData(firstProduct.id));
        }

        setFilteredProducts(formattedProducts);
        setDisplayedProducts(formattedProducts.slice(0, itemsToShow));

        // Debug: Log sample products to see their structure
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate filter options based on admin-defined category attributes
  // This function gets predefined filter options from the category data
  const getFilterOptions = (categoryName) => {
    if (!categoryName || categoryName === "All Categories") return null;

    // Find the category definition
    const categoryDefinition = categories.find(category =>
      category.name && category.name.toLowerCase() === categoryName.toLowerCase()
    );

    // Debugging: log the category definition

    // If category definition exists and has predefined attributes, generate filter options
    if (categoryDefinition && categoryDefinition.predefinedAttributes) {
      const filterOptions = {};

      // Add filter options for each predefined attribute
      Object.entries(categoryDefinition.predefinedAttributes).forEach(([attrName, attrConfig]) => {
        if (attrConfig.values && Array.isArray(attrConfig.values)) {
          filterOptions[attrName] = attrConfig.values;
        }
      });

      // Price filter options (always include sorting options)
      filterOptions.price = ["High to Low", "Low to High"];

      return filterOptions;
    }

    // Fallback to dynamically extracted values (previous behavior)
    const normalizedCategoryName = categoryName.toLowerCase().trim();
    const categoryProducts = products.filter(product => {
      if (!product.category || typeof product.category !== 'string') return false;
      const normalizedProductCategory = product.category.toLowerCase().trim();
      return normalizedProductCategory === normalizedCategoryName;
    });

    // Extract unique values for each attribute from the actual products
    const processValues = [...new Set(categoryProducts
      .map(product => product.process)
      .filter(process => process && typeof process === 'string'))];

    const gradeValues = [...new Set(categoryProducts
      .map(product => product.grade)
      .filter(grade => grade && typeof grade === 'string'))];

    // Return the dynamically generated filter options
    return {
      process: processValues,
      grade: gradeValues,
      price: ["High to Low", "Low to High"]
    };
  };

  // Get unique categories from products
  const getProductCategories = () => {
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    return uniqueCategories.filter(cat => cat && typeof cat === 'string' && cat !== 'Uncategorized');
  };

  // Generate price trend data - use priceHistory if available, otherwise show transition from previous to current price
  const generatePriceData = (productId) => {
    // Find the selected product
    const product = products.find(p => p.id === productId);
    if (!product) return [];

    // Check if product has priceHistory array
    if (product.priceHistory && Array.isArray(product.priceHistory) && product.priceHistory.length > 0) {
      // Use actual price history data (limit to last 5 entries)
      const history = product.priceHistory.slice(-5);
      const result = history.map(entry => ({
        // Format date for display
        date: formatDateForDisplay(entry.date) || 'N/A',
        price: typeof entry.price === 'number' ? entry.price : parseFloat(entry.price) || 0
      }));

      // Add current price as the final point if it's different from the last history entry
      const currentPrice = product.currentPrice || 0;
      if (currentPrice > 0) {
        const lastHistoryPrice = result.length > 0 ? result[result.length - 1].price : 0;
        // Only add current price if it's different from the last history entry
        if (Math.abs(currentPrice - lastHistoryPrice) > 0.01) {
          result.push({
            date: 'Current',
            price: currentPrice
          });
        }
      }

      return result;
    }

    // Fall back to previous behavior - create data points showing transition from previous to current price
    const previousPrice = product.previousPrice || 0;
    const currentPrice = product.currentPrice || 0;

    // Generate 10 data points showing the transition
    const dataPoints = [];
    for (let i = 0; i <= 9; i++) {
      // Linear interpolation between previous and current price
      const price = previousPrice + (currentPrice - previousPrice) * (i / 9);
      dataPoints.push({
        date: i === 0 ? 'Previous' : i === 9 ? 'Current' : `Point ${i}`,
        price: parseFloat(price.toFixed(2))
      });
    }

    return dataPoints;
  };

  // Helper function to format dates for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'N/A';

    // If it's already a readable format, return as is
    if (dateString === 'Previous' || dateString === 'Current') {
      return dateString;
    }

    // Try to parse as date
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // If not a valid date, return as is
      return dateString;
    }

    // Format as short date (e.g., Dec 15)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    // Apply filters when they change
    applyFilters();
  }, [selectedCategory, activeFilters, searchQuery]);

  useEffect(() => {
    // Update displayed products when filtered products change
    setDisplayedProducts(filteredProducts.slice(0, itemsToShow));
  }, [filteredProducts, itemsToShow]);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setPriceData(generatePriceData(product.id));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setActiveFilters({});
    setSearchQuery('');
    setItemsToShow(6); // Reset to show only 6 items initially
  };

  const handleFilterChange = (filterType, value, isChecked) => {
    // Handle checkbox filters (multi-select)
    if (filterType !== 'price') {
      if (isChecked) {
        setActiveFilters(prev => ({
          ...prev,
          [filterType]: prev[filterType] ? [...prev[filterType], value] : [value]
        }));
      } else {
        setActiveFilters(prev => ({
          ...prev,
          [filterType]: prev[filterType] ? prev[filterType].filter(item => item !== value) : []
        }));
      }
    } else {
      // Handle radio button filters (single-select)
      setActiveFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    }
  };

  const applyFilters = () => {
    let result = [...products];

    // Apply category filter (more flexible matching)
    if (selectedCategory && selectedCategory !== "All Categories") {
      // Find the category ID for the selected category
      const selectedCategoryObj = categories.find(cat =>
        cat.name && cat.name.toLowerCase().trim() === selectedCategory.toLowerCase().trim()
      );

      if (selectedCategoryObj) {
        result = result.filter(product => {
          // Use categoryId to match products with categories
          return product.categoryId === selectedCategoryObj.id;
        });
      } else {
        // Fallback to name matching if category not found
        const normalizedSelectedCategory = selectedCategory.toLowerCase().trim();
        result = result.filter(product => {
          if (!product.category || typeof product.category !== 'string') return false;
          const normalizedProductCategory = product.category.toLowerCase().trim();
          return normalizedProductCategory === normalizedSelectedCategory;
        });
      }
      // Debugging: log the category filter result
    }

    // Apply search filter
    if (searchQuery) {
      const initialCount = result.length;
      result = result.filter(product =>
        (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.owner && product.owner.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply dynamic filters
    Object.keys(activeFilters).forEach(filterType => {
      // Skip price sorting for now, handle it separately
      if (filterType === 'price') return;

      // Apply filter if there are selected values
      if (activeFilters[filterType] && activeFilters[filterType].length > 0) {
        const initialCount = result.length;

        result = result.filter(product => {
          // Check if product has the field (try multiple common variations)
          const productFieldValue = getProductFieldValue(product, filterType);
          if (productFieldValue === undefined || productFieldValue === null) {
            return false;
          }

          // Normalize the product value for comparison
          const normalizedProductValue = normalizeValue(productFieldValue);

          // Check if any of the selected filter values match the product value
          const isMatch = activeFilters[filterType].some(filterValue => {
            const normalizedFilterValue = normalizeValue(filterValue);
            const matches = normalizedProductValue === normalizedFilterValue;
            return matches;
          });

          // Debug logging
          return isMatch;
        });
      }
    });

    // Apply price sorting
    if (activeFilters.price) {
      if (activeFilters.price === "High to Low") {
        result.sort((a, b) => b.currentPrice - a.currentPrice);
      } else if (activeFilters.price === "Low to High") {
        result.sort((a, b) => a.currentPrice - b.currentPrice);
      }
    }
    setFilteredProducts(result);
    setItemsToShow(6); // Reset to show only 6 items initially when filters change
  };

  const loadMore = () => {
    setItemsToShow(prev => prev + 6); // Load 6 more items
  };

  // Helper function to get product field value with multiple naming variations
  const getProductFieldValue = (product, fieldName) => {
    // Try common naming variations
    const variations = [
      fieldName,                           // Original case
      fieldName.toLowerCase(),             // Lowercase
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase(), // Capitalized
      fieldName.toUpperCase()              // Uppercase
    ];

    // Also try with spaces removed and underscores
    variations.push(...variations.map(name => name.replace(/\s+/g, '')));
    variations.push(...variations.map(name => name.replace(/_/g, '')));

    // Find the first variation that exists in the product
    for (const variation of variations) {
      if (product.hasOwnProperty(variation) && product[variation] !== undefined && product[variation] !== null) {
        return product[variation];
      }
    }

    // If not found, return undefined
    return undefined;
  };

  // Helper function to normalize values for comparison
  const normalizeValue = (value) => {
    if (value === undefined || value === null) return '';
    return value.toString().toLowerCase().trim();
  };

  // Calculate price change percentage
  const calculatePriceChange = (current, previous) => {
    // Handle case where previous price is 0 or invalid to avoid division by zero
    if (previous === 0 || isNaN(previous) || isNaN(current) || previous === null || current === null) {
      return '0.00';
    }
    const result = (((current - previous) / previous) * 100).toFixed(2);
    return result;
  };

  // Chart.js configuration
  const chartData = {
    labels: priceData.map(data => data.date),
    datasets: [
      {
        label: 'Price',
        data: priceData.map(data => data.price),
        borderColor: '#92400e', // Primary amber-800
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(146, 64, 14, 0.4)'); // amber-800 with opacity
          gradient.addColorStop(1, 'rgba(251, 191, 36, 0.0)'); // amber-400 transparent
          return gradient;
        },
        borderWidth: 4,
        pointBackgroundColor: '#92400e',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#92400e',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 4,
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1f2937', // gray-800
        titleColor: '#fbbf24', // amber-400
        bodyColor: '#f9fafb', // gray-50
        padding: 12,
        cornerRadius: 12,
        displayColors: false,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 16 },
        callbacks: {
          label: function (context) {
            return `Price: $${context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
          },
          title: function (tooltipItems) {
            const index = tooltipItems[0].dataIndex;
            const entry = priceData[index];
            if (entry) {
              if (entry.date && entry.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
                return new Date(entry.date).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                });
              }
              return entry.date;
            }
            return tooltipItems[0].label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280', // gray-500
          font: { size: 12, weight: '500' },
          padding: 10
        }
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(229, 231, 235, 0.5)', // gray-200
          drawBorder: false,
          lineWidth: 1,
        },
        ticks: {
          color: '#6b7280',
          font: { size: 12 },
          padding: 10,
          callback: function (value) {
            return '$' + value.toLocaleString();
          }
        },
        // Dynamically calculate min/max to zoom into the actual price range
        min: function (context) {
          const data = context.chart.data.datasets[0]?.data || [];
          if (data.length === 0) return 0;
          const minVal = Math.min(...data);
          const maxVal = Math.max(...data);
          const range = maxVal - minVal;
          // If range is very small, provide a bit of padding (e.g., 10%)
          // If range is 0 (all points same), center the line
          if (range === 0) return minVal * 0.9;
          return Math.max(0, minVal - (range * 0.1));
        },
        max: function (context) {
          const data = context.chart.data.datasets[0]?.data || [];
          if (data.length === 0) return 100;
          const minVal = Math.min(...data);
          const maxVal = Math.max(...data);
          const range = maxVal - minVal;
          if (range === 0) return maxVal * 1.1;
          return maxVal + (range * 0.1);
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-secondary">
      <Navbar />

      {/* Scrolling Products */}
      <div className="pt-32 py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Price Changes</h2>
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide py-4"
            style={{ cursor: 'grab', whiteSpace: 'nowrap', WebkitOverflowScrolling: 'touch' }}
          >
            <div className="flex space-x-4" style={{ width: 'max-content' }}>
              {[...(products || []), ...(products || [])].map((product, index) => {
                // Get previous price from the last entry in priceHistory array, or fall back to previousPrice attribute
                const previousPrice = product.priceHistory && product.priceHistory.length > 0
                  ? product.priceHistory[product.priceHistory.length - 1].price
                  : product.previousPrice || 0;
                const priceChange = calculatePriceChange(product.currentPrice, previousPrice);
                const isPositive = parseFloat(priceChange) >= 0;

                return (
                  <div
                    key={`${product.id}-${index}`}
                    className="flex-shrink-0 w-72 bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    onClick={(e) => {
                      // Prevent event from bubbling up
                      e.stopPropagation();
                      e.preventDefault();
                      // Set this product as selected to update the graph
                      setGraphProduct(product);
                      setPriceData(generatePriceData(product.id));
                    }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="ml-0">
                        <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
                        <p className="text-xs text-gray-500 truncate">{product.owner}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Current Price</p>
                        <p className="font-bold text-gray-900">${product.currentPrice.toFixed(2)}</p>
                      </div>
                      <div className={`text-right ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        <p className="text-xs">Previous: ${previousPrice.toFixed(2)}</p>
                        <p className="font-bold">{isPositive ? '+' : ''}{priceChange}%</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Products Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Price Trends Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Price Trend Analysis</h2>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{graphProduct?.name || 'All Products'}</p>
                    <p className="text-gray-600">{priceData.length > 2 ? `${priceData.length} Price Points ` : 'Previous to Current Price'}</p>
                  </div>
                </div>

                <div className="h-[2000px] chart-transition price-chart-container relative" style={{ animation: 'chartLoad 0.5s ease-out forwards' }}>
                  {priceData.length > 0 ? (
                    <Line data={chartData} options={chartOptions} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <p>No price history data available</p>
                    </div>
                  )}
                </div>

                {selectedProduct && (
                  <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-amber-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Current Price</p>
                      <p className="text-xl font-bold text-gray-900">${selectedProduct?.currentPrice.toFixed(2)}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Previous Price</p>
                      <p className="text-xl font-bold text-gray-900">${selectedProduct?.previousPrice.toFixed(2)}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Price Difference</p>
                      <p className="text-xl font-bold text-gray-900">
                        ${selectedProduct && Math.abs(selectedProduct.currentPrice - selectedProduct.previousPrice).toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Change Percentage</p>
                      <p className={`text-xl font-bold ${selectedProduct && selectedProduct.currentPrice >= selectedProduct.previousPrice ? 'text-amber-600' : 'text-red-600'}`}>
                        {selectedProduct ?
                          `${calculatePriceChange(selectedProduct.currentPrice, selectedProduct.previousPrice)}%` :
                          '0.00%'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Filtering Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Products</h2>

                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left Side - Filters */}
                  <div className="lg:w-1/4">
                    {/* Category Selection */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Category</h3>
                      <div className="space-y-2">
                        {categoriesList.map((category) => (
                          <button
                            key={category}
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category
                              ? 'bg-amber-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            onClick={() => handleCategoryChange(category)}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Filters */}
                    {selectedCategory && selectedCategory !== "All Categories" && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Filters</h3>
                        {(() => {
                          // Get filter options for the selected category
                          const filterOptions = getFilterOptions(selectedCategory);

                          // If no filter options, show nothing
                          if (!filterOptions) return null;

                          return (
                            <>
                              {Object.entries(filterOptions).map(([filterType, options]) => (
                                <div key={filterType} className="mb-4">
                                  <h4 className="font-medium text-gray-700 mb-2">
                                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                                  </h4>

                                  {/* Radio buttons for price sorting */}
                                  {filterType === 'price' ? (
                                    <div className="space-y-2">
                                      {options.map((option) => (
                                        <div key={option} className="flex items-center">
                                          <input
                                            type="radio"
                                            id={`price-${option}`}
                                            name="price-sort"
                                            className="h-4 w-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                                            checked={activeFilters.price === option}
                                            onChange={(e) => handleFilterChange('price', option, e.target.checked)}
                                          />
                                          <label htmlFor={`price-${option}`} className="ml-2 text-sm text-gray-700">
                                            {option}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    /* Checkboxes for other filters */
                                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                      {options.map((option) => (
                                        <div key={option} className="flex items-center">
                                          <input
                                            type="checkbox"
                                            id={`${filterType}-${option}`}
                                            className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                                            checked={activeFilters[filterType]?.includes(option) || false}
                                            onChange={(e) => handleFilterChange(filterType, option, e.target.checked)}
                                          />
                                          <label htmlFor={`${filterType}-${option}`} className="ml-2 text-sm text-gray-700">
                                            {option}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Right Side - Products */}
                  <div className="lg:w-3/4">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedCategory && selectedCategory !== "All Categories"
                          ? `${selectedCategory} Products`
                          : "All Products"}
                        <span className="text-gray-500 text-sm ml-2">({filteredProducts.length} products found)</span>
                      </h3>
                    </div>

                    {displayedProducts.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No products found matching your criteria.</p>
                      </div>
                    ) : (
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {displayedProducts.map((product) => {
                            // User logic: "field is Availability, values are 'in stock' or 'out of stock'"
                            const stockValue = String(product.Availability || '').toLowerCase().trim();
                            const isInStock = stockValue === 'in stock';

                            return (
                              <div
                                key={product.id}
                                className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 transform bg-white"
                              >
                                <div className="h-48 overflow-hidden">
                                  <img
                                    src={product.Image || product.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  />
                                </div>
                                <div className="p-5">
                                  <div className="mb-3">
                                    <h3 className="font-bold text-gray-900 text-lg truncate">{product.name}</h3>
                                    <p className="text-gray-600 text-sm truncate">{product.owner}</p>
                                  </div>

                                  <div className="mb-4">
                                    <p className="text-sm text-gray-600">Price</p>
                                    <p className="font-bold text-gray-900">${product.currentPrice.toFixed(2)}</p>
                                  </div>

                                  <div className="mb-4">
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${isInStock ? 'bg-green-100 text-green-800' : 'bg-red-600 text-white'}`}>
                                      {isInStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                  </div>

                                  <button
                                    onClick={() => handleProductSelect(product)}
                                    className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors duration-300"
                                  >
                                    View Details
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Load More Button */}
                        {displayedProducts.length < filteredProducts.length && (
                          <div className="mt-8 text-center">
                            <button
                              onClick={loadMore}
                              className="px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors duration-300"
                            >
                              Load More
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && !loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column: Image */}
                <div className="w-full md:w-1/2">
                  <div className="h-64 flex justify-center items-center bg-gray-50 rounded-lg overflow-hidden">
                    <img
                      src={selectedProduct.Image || selectedProduct.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'}
                      alt={selectedProduct.name}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                </div>

                {/* Right Column: Dynamic Attributes */}
                <div className="w-full md:w-1/2 space-y-4">
                  {/* Only show fields found in database */}
                  {Object.keys(selectedProduct).map((key) => {
                    // Filter out internal/system fields and UI-specific fields
                    const ignoredFields = [
                      'id', 'image', 'Image', 'name', 'Name',
                      'priceHistory', 'categoryId', 'previousPrice', 'Previous Price',
                      'currentPrice', 'Is Top Product', 'isTopProduct', 'IsTopProduct',
                      'description', 'Description', 'discription', 'Discription'
                    ];

                    if (ignoredFields.includes(key)) return null;

                    // Skip null/undefined/empty
                    if (!selectedProduct[key]) return null;
                    if (typeof selectedProduct[key] === 'object') return null; // Skip complex objects

                    const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim();

                    return (
                      <div key={key} className="border-b border-gray-100 py-2">
                        <span className="font-semibold text-gray-700 block">{label}</span>
                        <span className="text-gray-900">{String(selectedProduct[key])}</span>
                      </div>
                    );
                  })}

                  {/* Explicitly show Price if it exists as a main field we extracted/computed */}
                  {(selectedProduct.currentPrice || selectedProduct.Price || selectedProduct.price) && (
                    <div className="border-b border-gray-100 py-2">
                      <span className="font-semibold text-gray-700 block">Price</span>
                      <span className="text-gray-900">${(selectedProduct.currentPrice || selectedProduct.Price || selectedProduct.price).toString().replace('$', '')}</span>
                    </div>
                  )}

                  {/* Show Status logic if needed, but user said "only found in database". 
                         Status (In Stock) is computed. I will omit computed fields unless they come from DB like 'availability'.
                         The loop above captures 'availability' or 'stock' if they exist in DB.
                     */}
                </div>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={`/request-sample/${selectedProduct.id}`}
                  className="flex-1 bg-amber-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-800 transition duration-300 text-center"
                >
                  Request Sample
                </Link>
                <Link
                  to={`/request-contract/${selectedProduct.id}`}
                  className="flex-1 bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-yellow-600 transition duration-300 text-center"
                >
                  Request Contract
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductsPage;
