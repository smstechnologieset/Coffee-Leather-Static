// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot Password States
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState({ type: '', msg: '' });

  const { login, signup, logout, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await googleLogin();
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Failed to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetEmail) return;

    setLoading(true);
    const { resetUserPassword } = await import('../services/firebaseService');
    const result = await resetUserPassword(resetEmail);

    if (result.success) {
      setResetStatus({ type: 'success', msg: 'Password reset link sent! Check your email.' });
      setTimeout(() => {
        setShowResetModal(false);
        setResetStatus({ type: '', msg: '' });
        setResetEmail('');
      }, 3000);
    } else {
      setResetStatus({ type: 'error', msg: result.error || 'Failed to send reset email.' });
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (!isLogin && password.length < 6) {
      return setError('Password should be at least 6 characters');
    }

    try {
      setError('');
      setLoading(true);

      if (isLogin) {
        const userCredential = await login(email, password);
        if (!userCredential.user.emailVerified) {
          await logout();
          setError('Please verify your email address to login. Check your inbox.');
          setLoading(false);
          return;
        }
        navigate('/');
      } else {
        const userCredential = await signup(email, password, name || email.split('@')[0] || 'User');
        await logout();
        localStorage.setItem('userName', name || email.split('@')[0] || 'User');
        setVerificationSent(true);
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please login instead.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No user found with this email.');
      } else if (err.code === 'auth/user-banned') {
        setError('Your account has been banned. Please contact support for assistance.');
      } else {
        setError(err.message || 'Failed to authenticate. Please try again.');
        console.error('Login Error:', err);
      }
    }

    setLoading(false);
  };

  if (verificationSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-600 to-orange-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
          <div className="p-10 text-center">
            <div className="text-amber-500 mb-6">
              <svg className="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Check your email</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We've sent a verification link to <span className="font-semibold text-amber-700">{email}</span>. Please verify your email to complete registration.
            </p>
            <button
              onClick={() => {
                setVerificationSent(false);
                setIsLogin(true);
                setError('');
              }}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-amber-200 transition duration-300"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-100 rounded-full blur-3xl opacity-50"></div>

      {/* Back to Home */}
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center text-gray-600 hover:text-amber-700 font-semibold transition duration-300 z-20 group"
      >
        <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center mr-3 group-hover:bg-amber-50 transition-colors">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </div>
        Back to Home
      </Link>

      <div className="w-full max-w-4xl h-auto min-h-[500px] max-h-[90vh] flex flex-col lg:flex-row bg-white rounded-[1.5rem] shadow-2xl overflow-hidden z-10 mx-4">
        {/* Left Side: Gradient and Navigation */}
        <div className="w-full lg:w-[35%] bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 relative p-6 lg:p-10 flex flex-col justify-center items-center">
          <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden text-white">
            {/* Abstract circles inspired by image */}
            <div className="absolute top-[10%] left-[5%] w-32 h-32 border-[8px] border-current rounded-full"></div>
            <div className="absolute top-[35%] left-[35%] w-24 h-24 border-[6px] border-current rounded-full"></div>
            <div className="absolute bottom-[5%] left-[15%] w-48 h-48 border-[12px] border-current rounded-full"></div>
          </div>

          <div className="relative z-10 w-full max-w-[180px] space-y-3">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`w-full py-2.5 text-center rounded-xl font-bold text-base transition-all duration-300 ${isLogin ? 'bg-white text-orange-600 shadow-xl' : 'text-white hover:bg-white/10'}`}
            >
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`w-full py-2.5 text-center rounded-xl font-bold text-base transition-all duration-300 ${!isLogin ? 'bg-white text-orange-600 shadow-xl' : 'text-white hover:bg-white/10'}`}
            >
              Sign up
            </button>
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className="w-full lg:w-[65%] p-6 lg:p-10 flex flex-col justify-center overflow-y-auto">
          <div className="max-w-sm mx-auto w-full">
            <div className="text-center mb-6 lg:mb-8">
              <img className="h-12 w-auto mx-auto mb-3" src="/assets/logo2.png" alt="ARZAQ Trading PLC" title="ARZAQ Trading PLC" />
              <h1 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tight">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h1>
              <p className="text-gray-500 mt-1 text-xs lg:text-sm">
                {isLogin ? 'Enter your details to sign in' : 'Explore premium products'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-2.5 bg-red-50 text-red-600 rounded-lg text-[11px] font-medium border border-red-100 animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
              {!isLogin && (
                <div className="relative border-b border-gray-100 focus-within:border-amber-500 transition-colors pb-0.5">
                  <div className="absolute left-0 bottom-2 text-gray-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    className="w-full pl-6 py-1.5 bg-transparent outline-none text-gray-900 placeholder-gray-400 text-sm"
                    placeholder="Full Name"
                  />
                </div>
              )}

              <div className="relative border-b border-gray-100 focus-within:border-amber-500 transition-colors pb-0.5">
                <div className="absolute left-0 bottom-2 text-gray-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-6 py-1.5 bg-transparent outline-none text-gray-900 placeholder-gray-400 text-sm"
                  placeholder="Email Address"
                />
              </div>

              <div className="relative border-b border-gray-100 focus-within:border-amber-500 transition-colors pb-0.5">
                <div className="absolute left-0 bottom-2 text-gray-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="6"
                  className="w-full pl-6 pr-8 py-1.5 bg-transparent outline-none text-gray-900 placeholder-gray-400 text-sm"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-2 text-gray-400 hover:text-amber-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {!isLogin && (
                <div className="relative border-b border-gray-100 focus-within:border-amber-500 transition-colors pb-0.5">
                  <div className="absolute left-0 bottom-2 text-gray-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-6 pr-8 py-1.5 bg-transparent outline-none text-gray-900 placeholder-gray-400 text-sm"
                    placeholder="Confirm Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-0 bottom-2 text-gray-400 hover:text-amber-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              )}

              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(true)}
                    className="text-[10px] font-bold text-amber-700 hover:text-orange-600 transition-colors uppercase tracking-widest"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white py-2.5 rounded-xl font-bold shadow-md hover:shadow-orange-100 transition-all duration-300 disabled:opacity-50 active:scale-[0.98] text-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (isLogin ? 'Get started' : 'Create Account')}
              </button>
            </form>

            <div className="mt-5 lg:mt-6 text-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-[9px] lg:text-[10px]">
                  <span className="px-3 bg-white text-gray-400 font-bold tracking-widest uppercase">OR</span>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full max-w-[160px] flex items-center justify-center px-3 py-2 border border-gray-100 rounded-xl shadow-sm text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 active:scale-95"
                >
                  <img className="h-4 w-4 mr-2" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                  Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full flex justify-center items-center z-50 p-4">
          <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md animate-scaleUp">
            <h3 className="text-2xl font-black mb-4 text-gray-900">Reset Password</h3>
            <p className="mb-8 text-gray-500">Enter your email and we'll send you a recovery link.</p>

            {resetStatus.msg && (
              <div className={`mb-6 p-4 rounded-xl font-medium ${resetStatus.type === 'success' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                {resetStatus.msg}
              </div>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="relative border-b-2 border-gray-100 focus-within:border-amber-500 transition-colors pb-1">
                <div className="absolute left-0 bottom-3 text-gray-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full pl-8 py-2 bg-transparent outline-none text-gray-900 placeholder-gray-400"
                  placeholder="Email Address"
                />
              </div>

              <div className="flex flex-col space-y-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-orange-200 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Recovery Link'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowResetModal(false);
                    setResetStatus({ type: '', msg: '' });
                  }}
                  className="w-full py-4 text-gray-500 font-bold hover:text-gray-800 transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Styles for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-scaleUp { animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-shake { animation: shake 0.2s ease-in-out infinite; animation-iteration-count: 2; }
      `}</style>
    </div>
  );
};

export default LoginPage;
