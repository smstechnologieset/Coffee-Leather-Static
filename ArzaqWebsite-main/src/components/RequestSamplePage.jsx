import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { addSampleRequest } from '../services/firebaseService';
import Navbar from './Navbar';

const RequestSamplePage = () => {
    const { productId } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [userAddresses, setUserAddresses] = useState([]);
    const [userCompanies, setUserCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [formData, setFormData] = useState({
        company: '',
        address: '',
        sampleSize: '',
        deliveryMethod: 'DHL'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Product
                const productRef = doc(db, 'products', productId);
                const productSnap = await getDoc(productRef);

                if (productSnap.exists()) {
                    setProduct({ id: productSnap.id, ...productSnap.data() });
                } else {
                    console.error("Product not found");
                }

                // Fetch User Addresses
                if (currentUser) {
                    const userRef = doc(db, 'users', currentUser.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        setUserAddresses(userSnap.data().addresses || []);
                        setUserCompanies(userSnap.data().companies || []);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (productId && currentUser) {
            fetchData();
        }
    }, [productId, currentUser]);

    const handleSubmit = async () => {
        if (!formData.company) {
            alert("Please select a company.");
            return;
        }
        if (!formData.address) {
            alert("Please select a delivery address.");
            return;
        }

        setSubmitting(true);
        const result = await addSampleRequest({
            userId: currentUser.uid,
            userName: currentUser.displayName || 'User',
            userEmail: currentUser.email,
            ...formData,
            productId: product.id,
            productName: product.Name || product.name || 'Unknown Product',
            productGrade: product.Grade || product.grade || 'N/A',
            company: JSON.parse(formData.company),
            address: JSON.parse(formData.address)
        });

        if (result.success) {
            setShowSuccessModal(true);
        } else {
            alert("Failed to submit request: " + result.error);
        }
        setSubmitting(false);
    };

    if (loading) return <div className="min-h-screen pt-24 text-center">Loading...</div>;
    if (!product) return <div className="min-h-screen pt-24 text-center">Product not found.</div>;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Request a Sample</h1>
                    <p className="text-gray-500 mb-8">Create a sample request for {product.Name || product.name}</p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left Column: Product Details */}
                        <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Product Details</h2>
                            <div className="space-y-4">
                                <div className="h-48 w-full flex justify-center mb-4">
                                    <img
                                        src={product.Image || product.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'}
                                        alt={product.Name || product.name}
                                        className="h-full object-contain rounded-lg"
                                    />
                                </div>
                                <div className="flex justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-600">Product Name</span>
                                    <span className="font-medium">{product.Name || product.name}</span>
                                </div>

                                {Object.keys(product).map((key) => {
                                    // Filter internal and long fields
                                    const ignored = [
                                        'id', 'name', 'Name', 'image', 'Image',
                                        'description', 'Description', 'priceHistory',
                                        'categoryId', 'previousPrice', 'Previous Price',
                                        'Is Top Product', 'isTopProduct', 'IsTopProduct'
                                    ];
                                    if (ignored.includes(key) || !product[key] || typeof product[key] === 'object') return null;

                                    const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim();

                                    return (
                                        <div key={key} className="flex justify-between py-3 border-b border-gray-100">
                                            <span className="text-gray-600">{label}</span>
                                            <span className="font-medium">{String(product[key]).replace('$', '')}</span>
                                        </div>
                                    );
                                })}

                                {(product.price || product.Price || product.currentPrice) && (
                                    <div className="flex justify-between py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Price</span>
                                        <span className="font-medium">${(product.price || product.Price || product.currentPrice).toString().replace('$', '')}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Form */}
                        <div className="space-y-8">
                            {/* Company Section */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Company</h3>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <select
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    >
                                        <option value="">Select Company</option>
                                        {userCompanies.map((comp, idx) => (
                                            <option key={idx} value={JSON.stringify(comp)}>
                                                {comp.name}
                                            </option>
                                        ))}
                                    </select>
                                    {userCompanies.length === 0 && <p className="text-xs text-red-500 mt-2">Please add a company in Settings first.</p>}
                                </div>
                            </div>

                            {/* Address Section */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Address</h3>
                                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                                    <div className="flex items-center">
                                        <svg className="h-6 w-6 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <select
                                            className="w-full bg-transparent border-none focus:ring-0 text-gray-700"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        >
                                            <option value="">Select Delivery Address</option>
                                            {userAddresses.map((addr, idx) => (
                                                <option key={idx} value={JSON.stringify(addr)}>
                                                    {addr.label} ({addr.city}, {addr.country})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {userAddresses.length === 0 && <p className="text-sm text-red-500 mt-2 ml-9">Please add an address in Settings first.</p>}
                                </div>
                            </div>

                            {/* Sample Sizes - Input Field */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Sample Size</h3>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {/* Enter Sample Quantity */}
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                                        placeholder="Enter Sample Quantity"
                                        value={formData.sampleSize}
                                        onChange={(e) => setFormData({ ...formData, sampleSize: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Delivery Options */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Options</h3>
                                <div className="space-y-4">
                                    <button
                                        className={`w-full p-4 rounded-lg border flex items-center ${formData.deliveryMethod === 'DHL' ? 'border-amber-600 bg-amber-50 ring-1 ring-amber-600' : 'border-gray-200 hover:border-amber-400'}`}
                                        onClick={() => setFormData({ ...formData, deliveryMethod: 'DHL' })}
                                    >
                                        <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center mr-3 text-gray-500">
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <div className="font-medium text-gray-900">DHL</div>
                                            <div className="text-xs text-gray-500">Express Delivery</div>
                                        </div>
                                    </button>
                                    <button
                                        className={`w-full p-4 rounded-lg border flex items-center ${formData.deliveryMethod === 'Drop Location' ? 'border-amber-600 bg-amber-50 ring-1 ring-amber-600' : 'border-gray-200 hover:border-amber-400'}`}
                                        onClick={() => setFormData({ ...formData, deliveryMethod: 'Drop Location' })}
                                    >
                                        <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center mr-3 text-gray-500">
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <div className="font-medium text-gray-900">DROP LOCATION</div>
                                            <div className="text-xs text-gray-500">Pick up from nearest location</div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className={`w-full py-4 px-6 rounded-md text-white font-medium text-lg ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700 transition-colors'}`}
                            >
                                {submitting ? 'Creating Request...' : 'Create Sample Request'}
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Request Sent!</h3>
                        <p className="text-gray-600 mb-6">
                            We have received your sample request. We will review the details and process your shipment shortly.
                        </p>
                        <button
                            onClick={() => navigate('/products')}
                            className="w-full py-3 bg-amber-600 text-white rounded-md font-medium hover:bg-amber-700 transition-colors"
                        >
                            Back to Products
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default RequestSamplePage;
