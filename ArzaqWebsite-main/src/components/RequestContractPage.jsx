import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { addContractRequest } from '../services/firebaseService';
import Navbar from './Navbar';

const RequestContractPage = () => {
    const { productId } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [userCompanies, setUserCompanies] = useState([]);
    const [userAddresses, setUserAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [formData, setFormData] = useState({
        company: '',
        address: '',
        quantity: 1
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Product
                const productRef = doc(db, 'products', productId);
                const productSnap = await getDoc(productRef);

                if (productSnap.exists()) {
                    const productData = { id: productSnap.id, ...productSnap.data() };
                    setProduct(productData);

                    // Set initial quantity from Min Order if available
                    const minOrder = productData['Min order'] || productData['min order'] || productData['Minimum Order'] || productData['minimum order'];
                    if (minOrder) {
                        const parsedMin = parseFloat(String(minOrder).replace(/[^0-9.]/g, ''));
                        if (!isNaN(parsedMin) && parsedMin > 0) {
                            setFormData(prev => ({ ...prev, quantity: parsedMin }));
                        }
                    }
                } else {
                    console.error("Product not found");
                }

                // Fetch User Companies
                if (currentUser) {
                    const userRef = doc(db, 'users', currentUser.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        setUserCompanies(userSnap.data().companies || []);
                        setUserAddresses(userSnap.data().addresses || []);
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
        // Calculate total based on current price (assuming price is per ton if not specified, logic can be adjusted)
        const priceString = product.price || product.Price || product.currentPrice || '0';
        const price = parseFloat(String(priceString).replace(/[^0-9.-]+/g, "")) || 0;
        const total = price * formData.quantity;

        const result = await addContractRequest({
            userId: currentUser.uid,
            userName: currentUser.displayName || 'User',
            userEmail: currentUser.email,
            productId: product.id,
            productName: product.Name || product.name,
            productGrade: product.Grade || product.grade || 'N/A',
            company: JSON.parse(formData.company),
            address: JSON.parse(formData.address),
            quantity: formData.quantity,
            totalPrice: total
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

    const priceString = product.price || product.Price || product.currentPrice || '0';
    const price = parseFloat(String(priceString).replace(/[^0-9.-]+/g, "")) || 0;
    const total = price * formData.quantity;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Request Contract</h1>
                    <p className="text-gray-500 mb-8">Complete the form to request a contract for {product.name}</p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left Column: Image */}
                        <div>
                            <div className="h-48 w-full flex justify-center mb-4 bg-white rounded-lg">
                                <img
                                    src={product.Image || product.image || 'https://via.placeholder.com/600x400'}
                                    alt={product.Name || product.name}
                                    className="h-full object-contain rounded-lg shadow-sm"
                                />
                            </div>
                            {/* Potential Thumbnails could go here if multiple images existed */}
                        </div>

                        {/* Right Column: Details & Form */}
                        <div className="bg-white p-8 rounded-lg shadow-sm">
                            <div className="space-y-4 mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Product Details</h2>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Product Name</span>
                                    <span className="font-medium text-right">{product.Name || product.name}</span>
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
                                        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-600">{label}</span>
                                            <span className="font-medium">{String(product[key]).replace('$', '')}</span>
                                        </div>
                                    );
                                })}

                                {(product.price || product.Price || product.currentPrice) && (
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Price Per Ton</span>
                                        <span className="font-medium">${(product.price || product.Price || product.currentPrice).toString().replace('$', '')}</span>
                                    </div>
                                )}
                            </div>

                            {/* Company Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                                {formData.company ? (
                                    <div className="text-sm text-gray-600 mb-2">Selected: <span className="font-semibold">{JSON.parse(formData.company).name}</span></div>
                                ) : (
                                    <div className="text-sm text-gray-400 mb-2">No company selected</div>
                                )}

                                <select
                                    className="w-full border border-gray-300 rounded-full px-4 py-2 focus:ring-amber-500 focus:border-amber-500"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                >
                                    <option value="">Select / Add Company</option>
                                    {userCompanies.map((comp, idx) => (
                                        <option key={idx} value={JSON.stringify(comp)}>
                                            {comp.name}
                                        </option>
                                    ))}
                                </select>
                                {userCompanies.length === 0 && <p className="text-xs text-red-500 mt-2">Please add a company in Settings first.</p>}
                            </div>

                            {/* Address Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                                {formData.address ? (
                                    (() => {
                                        try {
                                            const addr = JSON.parse(formData.address);
                                            return <div className="text-sm text-gray-600 mb-2">Selected: <span className="font-semibold">{addr.label}</span> ({addr.city})</div>;
                                        } catch (e) { return null; }
                                    })()
                                ) : (
                                    <div className="text-sm text-gray-400 mb-2">No address selected</div>
                                )}

                                <select
                                    className="w-full border border-gray-300 rounded-full px-4 py-2 focus:ring-amber-500 focus:border-amber-500"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                >
                                    <option value="">Select / Add Address</option>
                                    {userAddresses.map((addr, idx) => (
                                        <option key={idx} value={JSON.stringify(addr)}>
                                            {addr.label} ({addr.city}, {addr.country})
                                        </option>
                                    ))}
                                </select>
                                {userAddresses.length === 0 && <p className="text-xs text-red-500 mt-2">Please add an address in Settings first.</p>}
                            </div>

                            {/* Calculated Amount */}
                            <div className="mb-8">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                                        className="h-10 w-10 bg-gray-700 text-white flex items-center justify-center rounded l text-xl"
                                    >
                                        -
                                    </button>
                                    <div className="flex-1 text-center border-t border-b border-gray-200 h-10 flex items-center justify-center font-medium">
                                        {formData.quantity}
                                    </div>
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                                        className="h-10 w-10 bg-gray-700 text-white flex items-center justify-center rounded r text-xl"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded mb-6 flex justify-between items-center">
                                <span className="text-gray-600">Total Price:</span>
                                <span className="text-2xl font-bold text-gray-900">${total.toLocaleString()}</span>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className={`w-full py-3 mb-4 rounded text-white font-medium ${submitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-400 hover:bg-gray-500'}`}
                            >
                                {submitting ? 'Requesting...' : 'Request Contract'}
                            </button>
                            <button
                                onClick={() => navigate('/products')}
                                className="w-full py-3 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
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
                            We have received your contract request. Our team will review the details and contact you shortly.
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

export default RequestContractPage;
