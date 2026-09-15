import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  const signup = async (email, password, name) => {
    // Validation guard
    if (!email || !password) {
      throw new Error('Missing email or password');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Defensive: ensure name is never undefined (use nullish coalescing)
      const userName = name ?? email.split('@')[0] ?? 'User';

      // Create user profile in Firestore - this is the ONLY place we create user docs
      await setDoc(doc(db, 'users', user.uid), {
        name: userName ?? 'User',
        email: email,
        role: 'user',
        status: 'active',
        createdAt: new Date()
      });

      // Send email verification
      await sendEmailVerification(user);

      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check ban status immediately - wrap in try-catch to prevent blocking login on permission errors
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data().status === 'banned') {
        await signOut(auth);
        const error = new Error('Your account has been banned. Please contact support.');
        error.code = 'auth/user-banned';
        throw error;
      }
    } catch (err) {
      if (err.code === 'auth/user-banned') throw err;
      console.warn('Silent failure during immediate ban check:', err);
      // We allow the login to proceed. The onAuthStateChanged listener or 
      // Firestore rules will serve as the secondary, more authoritative check.
    }

    return userCredential;
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document exists in Firestore
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (userDoc.exists()) {
          // Check if user is banned
          if (userDoc.data().status === 'banned') {
            await signOut(auth);
            const error = new Error('Your account has been banned. Please contact support.');
            error.code = 'auth/user-banned';
            throw error;
          }
        } else {
          // Create user profile for new Google users
          await setDoc(doc(db, 'users', user.uid), {
            name: user.displayName || user.email.split('@')[0],
            email: user.email,
            role: 'user',
            status: 'active',
            createdAt: new Date()
          });
        }
      } catch (err) {
        if (err.code === 'auth/user-banned') throw err;
        console.warn('Silent failure during Google Login ban check/creation:', err);
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUserRole(null);
    setUserName('');
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Special case for admin user
        if (user.email === 'admin@arzaq.com') {
          setUserRole('admin');
          setUserName('Admin User');
          setLoading(false);
          return;
        }

        // Fetch user profile from Firestore for regular users
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();

            // Check if user is banned
            if (userData.status === 'banned') {
              await signOut(auth);
              alert('Your account has been banned. Please contact support.');
              setCurrentUser(null);
              setLoading(false);
              return;
            }

            setUserRole(userData.role || 'user');
            setUserName(userData.name || user.email);
          } else {
            // User document doesn't exist - just set defaults, do NOT create doc here
            // User creation only happens in signup()
            setUserRole('user');
            setUserName(user.email);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUserRole('user');
          setUserName(user.email);
        }
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    userName,
    login,
    signup,
    logout,
    googleLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};