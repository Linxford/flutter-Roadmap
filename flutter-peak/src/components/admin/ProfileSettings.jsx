import React, { useState, useEffect, useCallback } from 'react';
import { getAuth, updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useNotification } from '../../context/NotificationContext';
import '../../styles/components/admin/ProfileSettings.css';
import ImageUpload from './ImageUpload';

export default function ProfileSettings() {
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    newPassword: '',
    confirmPassword: '',
    bio: '',
    role: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(false);
  const notify = useNotification();
  const auth = getAuth();

  const loadAdminData = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        const data = adminDoc.data() || {};
        setProfile({
          displayName: user.displayName || '',
          email: user.email || '',
          newPassword: '',
          confirmPassword: '',
          bio: data.bio || '',
          role: data.role || 'admin',
          avatar: data.avatar || ''
        });
      }
    } catch (error) {
      notify.error('Failed to load profile data');
    }
  }, [auth.currentUser, notify]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      const updates = [];

      if (profile.displayName !== user.displayName) {
        updates.push(updateProfile(user, { displayName: profile.displayName }));
      }

      if (profile.email !== user.email) {
        updates.push(updateEmail(user, profile.email));
      }

      if (profile.newPassword) {
        if (profile.newPassword !== profile.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        updates.push(updatePassword(user, profile.newPassword));
      }

      updates.push(setDoc(doc(db, 'admins', user.uid), {
        bio: profile.bio,
        role: profile.role,
        avatar: profile.avatar?.url || null,
        avatarId: profile.avatar?.publicId || null,
        updatedAt: new Date()
      }, { merge: true }));

      await Promise.all(updates);
      notify.success('Profile updated successfully');
      await loadAdminData();
    } catch (error) {
      notify.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-settings">
      <h2>Profile Settings</h2>

      <form onSubmit={handleSubmit}>
        <div className="profile-header">
          <div className="avatar-section">
            <ImageUpload
              currentImage={profile.avatar}
              onImageUpload={(url) => setProfile({ ...profile, avatar: url })}
            />
          </div>

          <div className="profile-info">
            <div className="form-group">
              <label>Display Name</label>
              <input
                type="text"
                value={profile.displayName}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows="3"
          />
        </div>

        <div className="password-section">
          <h3>Change Password</h3>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={profile.newPassword}
              onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={profile.confirmPassword}
              onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
