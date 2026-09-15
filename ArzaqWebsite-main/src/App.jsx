import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Homepage from './components/Homepage';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import AboutUsPage from './components/AboutUsPage';
import ContactUsPage from './components/ContactUsPage';
import BlogPage from './components/BlogPage';
import BlogPostPage from './components/BlogPostPage';
import ProductsPage from './components/ProductsPage';
import SettingsPage from './components/SettingsPage';
import PrivateRoute from './components/PrivateRoute';
import RequestSamplePage from './components/RequestSamplePage';
import RequestContractPage from './components/RequestContractPage';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactUsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
            <Route path="/request-sample/:productId" element={<PrivateRoute><RequestSamplePage /></PrivateRoute>} />
            <Route path="/request-contract/:productId" element={<PrivateRoute><RequestContractPage /></PrivateRoute>} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
