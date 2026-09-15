import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserData, getUserRequests } from '../services/firebaseService';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { updatePassword, updateProfile } from 'firebase/auth';
import Navbar from './Navbar';

const SettingsPage = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    // Fetch User Data
    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser?.uid) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchUserData();
    }, [currentUser]);

    const handleUpdateUser = async (updatedFields) => {
        try {
            await updateUserData(currentUser.uid, updatedFields);
            setUserData(prev => ({ ...prev, ...updatedFields }));
            return { success: true };
        } catch (error) {
            console.error('Error updating user:', error);
            return { success: false, error: error.message };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar */}
                        <aside className="w-full md:w-64 flex-shrink-0">
                            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                                        {/* Placeholder for avatar image if available, else initials */}
                                        {userData?.avatar ? <img src={userData.avatar} alt="Avatar" className="h-full w-full object-cover" /> : (userData?.name?.charAt(0).toUpperCase() || 'U')}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900 leading-tight">Account Settings</h2>
                                        <p className="text-sm text-gray-500">{userData?.name || 'User'}</p>
                                    </div>
                                </div>

                                <nav className="space-y-1">
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'profile'
                                            ? 'bg-amber-700 text-white'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Profile
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('company')}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'company'
                                            ? 'bg-amber-700 text-white'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        Company
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('address')}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'address'
                                            ? 'bg-amber-700 text-white'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Address
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('requests')}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'requests'
                                            ? 'bg-amber-700 text-white'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                        </svg>
                                        Requests
                                    </button>
                                </nav>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1 bg-white rounded-lg shadow-sm p-8 min-h-[500px]">
                            {activeTab === 'profile' && <ProfileSettings userData={userData} onUpdate={handleUpdateUser} currentUser={currentUser} />}
                            {activeTab === 'company' && <CompanySettings userData={userData} onUpdate={handleUpdateUser} />}
                            {activeTab === 'address' && <AddressSettings userData={userData} onUpdate={handleUpdateUser} />}
                            {activeTab === 'requests' && <RequestsSettings currentUser={currentUser} />}
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

// ------------------- Sub-Components -------------------

const ProfileSettings = ({ userData, onUpdate, currentUser }) => {
    const [name, setName] = useState(userData?.name || '');
    const [email] = useState(userData?.email || '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // Update Name in Firestore
            if (name !== userData.name) {
                await onUpdate({ name });
                // Also update Auth Profile
                await updateProfile(currentUser, { displayName: name });
            }

            // Update Password if provided
            if (newPassword) {
                if (newPassword !== confirmPassword) {
                    throw new Error("Passwords do not match");
                }
                if (newPassword.length < 6) {
                    throw new Error("Password must be at least 6 characters");
                }
                await updatePassword(currentUser, newPassword);
            }

            setMessage({ type: 'success', text: 'Profile updated successfully.' });
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/requires-recent-login') {
                setMessage({ type: 'error', text: 'Please re-login to change password.' });
            } else {
                setMessage({ type: 'error', text: error.message });
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
            {message.text && (
                <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-amber-50 text-amber-800' : 'bg-red-50 text-red-800'}`}>
                    {message.text}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2 border"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address (Read-only)</label>
                    <input
                        type="email"
                        value={email}
                        disabled
                        className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm text-gray-500 sm:text-sm p-2 border cursor-not-allowed"
                    />
                </div>

                <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Leave blank to keep current"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2 border"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className={`inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${saving ? 'bg-amber-400 cursor-not-allowed' : 'bg-amber-700 hover:bg-amber-800'} focus:outline-none`}
                    >
                        {saving ? 'Saving...' : 'Update Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const CompanySettings = ({ userData, onUpdate }) => {
    const [companies, setCompanies] = useState(userData?.companies || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

    const handleSave = async () => {
        let updatedCompanies = [...companies];
        if (editingIndex !== null) {
            updatedCompanies[editingIndex] = formData;
        } else {
            updatedCompanies.push(formData);
        }

        const result = await onUpdate({ companies: updatedCompanies });
        if (result.success) {
            setCompanies(updatedCompanies);
            setIsModalOpen(false);
            setEditingIndex(null);
            setFormData({ name: '', email: '', phone: '', address: '' });
        } else {
            alert("Failed to save company.");
        }
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
        setFormData(companies[index]);
        setIsModalOpen(true);
    };

    const handleDelete = async (index) => {
        if (window.confirm("Are you sure you want to delete this company?")) {
            const updatedCompanies = companies.filter((_, i) => i !== index);
            const result = await onUpdate({ companies: updatedCompanies });
            if (result.success) {
                setCompanies(updatedCompanies);
            }
        }
    }

    const openNew = () => {
        setEditingIndex(null);
        setFormData({ name: '', email: '', phone: '', address: '' });
        setIsModalOpen(true);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Companies</h2>
                <button
                    onClick={openNew}
                    className="bg-amber-800 text-white px-4 py-2 rounded text-sm font-medium hover:bg-amber-900"
                >
                    Add Company
                </button>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                {companies.map((company, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3 mb-4">
                            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <h3 className="text-lg font-bold text-gray-900">{company.name}</h3>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600 mb-6">
                            <p><span className="font-semibold text-gray-800">Email:</span> {company.email}</p>
                            <p><span className="font-semibold text-gray-800">Phone:</span> {company.phone}</p>
                            <p><span className="font-semibold text-gray-800">Address:</span> {company.address}</p>
                        </div>
                        <div className="flex space-x-3">
                            <button onClick={() => handleEdit(index)} className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">Edit</button>
                            <button onClick={() => handleDelete(index)} className="px-4 py-2 border border-red-300 rounded text-sm text-red-700 hover:bg-red-50">Delete</button>
                        </div>
                    </div>
                ))}
                {companies.length === 0 && <p className="text-gray-500 italic">No companies added yet.</p>}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">{editingIndex !== null ? 'Edit Company' : 'Add Company'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                                <input type="text" className="mt-1 w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" className="mt-1 w-full border p-2 rounded" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input type="tel" className="mt-1 w-full border p-2 rounded" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <select
                                    className="mt-1 w-full border p-2 rounded bg-white"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                >
                                    <option value="">Select an address</option>
                                    {userData?.addresses?.map((addr, idx) => (
                                        <option key={idx} value={addr.label}>
                                            {addr.label} ({addr.street}, {addr.city})
                                        </option>
                                    ))}
                                </select>
                                {(!userData?.addresses || userData.addresses.length === 0) && (
                                    <p className="text-xs text-red-500 mt-1">Please add an address in the Address tab first.</p>
                                )}
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-gray-700">Cancel</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800">{editingIndex !== null ? 'Update' : 'Add Company'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AddressSettings = ({ userData, onUpdate }) => {
    const [addresses, setAddresses] = useState(userData?.addresses || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [formData, setFormData] = useState({ label: '', street: '', city: '', state: '', zip: '', country: '' });

    const handleSave = async () => {
        let updatedAddresses = [...addresses];
        if (editingIndex !== null) {
            updatedAddresses[editingIndex] = formData;
        } else {
            updatedAddresses.push(formData);
        }

        const result = await onUpdate({ addresses: updatedAddresses });
        if (result.success) {
            setAddresses(updatedAddresses);
            setIsModalOpen(false);
            setEditingIndex(null);
            setFormData({ label: '', street: '', city: '', state: '', zip: '', country: '' });
        } else {
            alert("Failed to save address.");
        }
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
        setFormData(addresses[index]);
        setIsModalOpen(true);
    };

    const handleDelete = async (index) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            const updatedAddresses = addresses.filter((_, i) => i !== index);
            const result = await onUpdate({ addresses: updatedAddresses });
            if (result.success) {
                setAddresses(updatedAddresses);
            }
        }
    }

    const openNew = () => {
        setEditingIndex(null);
        setFormData({ label: '', street: '', city: '', state: '', zip: '', country: '' });
        setIsModalOpen(true);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Addresses</h2>
                <button
                    onClick={openNew}
                    className="bg-amber-800 text-white px-4 py-2 rounded text-sm font-medium hover:bg-amber-900"
                >
                    Add Address
                </button>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                {addresses.map((addr, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3 mb-4">
                            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <h3 className="text-lg font-bold text-gray-900">{addr.label}</h3>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600 mb-6">
                            <p>{addr.street}</p>
                            <p>{addr.city}, {addr.state} {addr.zip}</p>
                            <p>{addr.country}</p>
                        </div>
                        <div className="flex space-x-3">
                            <button onClick={() => handleEdit(index)} className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">Edit</button>
                            <button onClick={() => handleDelete(index)} className="px-4 py-2 border border-red-300 rounded text-sm text-red-700 hover:bg-red-50">Delete</button>
                        </div>
                    </div>
                ))}
                {addresses.length === 0 && <p className="text-gray-500 italic">No addresses added yet.</p>}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 my-8 overflow-y-auto max-h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">{editingIndex !== null ? 'Edit Address' : 'Add Address'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Label (e.g. Office, Home)</label>
                                <input type="text" className="mt-1 w-full border p-2 rounded" value={formData.label} onChange={e => setFormData({ ...formData, label: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Street</label>
                                <input type="text" className="mt-1 w-full border p-2 rounded" value={formData.street} onChange={e => setFormData({ ...formData, street: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">City</label>
                                <input type="text" className="mt-1 w-full border p-2 rounded" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">State/Province</label>
                                <input type="text" className="mt-1 w-full border p-2 rounded" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
                                <input type="text" className="mt-1 w-full border p-2 rounded" value={formData.zip} onChange={e => setFormData({ ...formData, zip: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Country</label>
                                <input type="text" className="mt-1 w-full border p-2 rounded" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-gray-700">Cancel</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800">{editingIndex !== null ? 'Update Address' : 'Add Address'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const RequestsSettings = ({ currentUser }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            if (currentUser) {
                try {
                    const data = await getUserRequests(currentUser.uid);
                    setRequests(data);
                } catch (error) {
                    console.error("Error loading requests:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchRequests();
    }, [currentUser]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-amber-100 text-amber-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    if (loading) return <div className="text-center py-8">Loading requests...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Requests</h2>
            <div className="space-y-4">
                {requests.map((req) => (
                    <div key={req.id} className="border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="mb-4 md:mb-0">
                            <div className="flex items-center space-x-3 mb-1">
                                <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wide rounded-full ${req.type === 'sample' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                                    {req.type === 'sample' ? 'Sample' : 'Contract'}
                                </span>
                                <h3 className="text-lg font-bold text-gray-900">{req.productName}</h3>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p>Date: {req.createdAt?.toDate ? req.createdAt.toDate().toLocaleDateString() : 'N/A'}</p>
                                {req.type === 'sample' ? (
                                    <p>Details: {req.sampleSize} via {req.deliveryMethod}</p>
                                ) : (
                                    <p>Details: {req.quantity} tons</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold mb-2 ${getStatusColor(req.status)}`}>
                                {req.status || 'Pending'}
                            </span>
                            {req.status === 'Approved' && (
                                <span className="text-xs text-amber-600 font-medium">Processing</span>
                            )}
                        </div>
                    </div>
                ))}

                {requests.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
                        <p className="mt-1 text-sm text-gray-500">You haven't made any sample or contract requests yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsPage;
