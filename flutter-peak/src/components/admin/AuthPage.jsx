import React, { useState, useCallback } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useNotification } from '../../context/NotificationContext';
import '../../styles/components/admin/AuthPage.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    inviteCode: ''
  });
  const notify = useNotification();

  const handleAuthError = useCallback((error) => {
    console.error('Auth error:', error);
    switch (error.code) {
      case 'auth/network-request-failed':
        notify.error('Network error. Please check your internet connection.');
        break;
      case 'auth/user-not-found':
        notify.error('User not found. Please check your email.');
        break;
      case 'auth/wrong-password':
        notify.error('Invalid password. Please try again.');
        break;
      case 'auth/email-already-in-use':
        notify.error('Email already in use. Please use a different email.');
        break;
      case 'auth/invalid-email':
        notify.error('Invalid email format.');
        break;
      case 'auth/weak-password':
        notify.error('Password is too weak. Please use a stronger password.');
        break;
      default:
        notify.error(error.message || 'Authentication failed. Please try again.');
    }
  }, [notify]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const auth = getAuth();

      if (!isLogin) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        if (formData.inviteCode !== process.env.REACT_APP_ADMIN_INVITE_CODE) {
          throw new Error('Invalid invite code');
        }

        const { user } = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        await setDoc(doc(db, 'admins', user.uid), {
          email: formData.email,
          displayName: formData.displayName,
          role: 'admin',
          createdAt: new Date(),
          lastLogin: new Date()
        });

        notify.success('Account created successfully!');
      } else {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        notify.success('Welcome back!');
      }
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <img src="/assets/fpeak.png" alt="FlutterPeak" className="auth-logo" />
          <h1>Admin {isLogin ? 'Login' : 'Signup'}</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Display Name</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                required={!isLogin}
                placeholder="Enter your name"
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="Enter your password"
              minLength={6}
            />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required={!isLogin}
                  placeholder="Confirm your password"
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label>Invite Code</label>
                <input
                  type="text"
                  value={formData.inviteCode}
                  onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
                  required={!isLogin}
                  placeholder="Enter invite code"
                />
              </div>
            </>
          )}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <div className="spinner" />
            ) : isLogin ? (
              'Login'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <button
            className="switch-btn"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
