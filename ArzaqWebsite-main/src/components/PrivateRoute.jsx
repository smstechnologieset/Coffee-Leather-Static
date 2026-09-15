import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { currentUser } = useAuth();

    // If loading, you might want to show a spinner, but for now we'll just wait
    // Assuming AuthProvider handles loading state before rendering children if connected properly
    // But here we just check currentUser. 
    // Note: If AuthContext has a loading state, we should expose it to avoid premature redirects.
    // Checking AuthContext.js: it reveals it exposes !loading && children. 
    // So inside App, loading is done. 

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
