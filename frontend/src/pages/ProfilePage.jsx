import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { setAddressValidity } from '../store/appSlice';
import * as apiClient from "../api/MyUserApi";
import { Edit, Save, X } from 'lucide-react';
import { showToast } from "../store/appSlice";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userData = await apiClient.fetchCurrentUser();
        setUser(userData);
        setFormData(userData);
      } catch (err) {
        setError('Failed to load user profile. Please try again later.');
        console.error('Error loading user profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setValidationError(null);

    try {
      const updatedUser = await apiClient.updateUserProfile(formData);
      setUser(updatedUser);
      setIsEditing(false);
      const isComplete = await apiClient.checkProfileCompletion();
      dispatch(setAddressValidity(isComplete === "" ? false : isComplete));
      dispatch(showToast({ message: 'Profile updated successfully', type: 'SUCCESS' }));
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
      dispatch(showToast({ message: 'Failed to update profile', type: 'ERROR' }));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-[#FF6B6B] text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-[#FF6B6B] text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg border border-[#F0F0F0] shadow-lg p-6 mt-4">
      <div className="container">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#2D3436] mb-2">
            {isEditing ? 'Edit Your Profile' : 'Your Profile'}
          </h1>
          <p className="text-[#2D3436]/80">
            Update your personal information
          </p>
        </div>

        {validationError && (
          <div className="mb-4 text-[#FF6B6B]">{validationError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2D3436]/80 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                disabled
                className="w-full p-2 rounded-lg text-[#2D3436] bg-[#F9F9F9] border border-[#F0F0F0] 
                focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2D3436]/80 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                disabled
                className="w-full p-2 rounded-lg text-[#2D3436] bg-[#F9F9F9] border border-[#F0F0F0] 
                focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#2D3436]/80 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user.primaryEmail}
                disabled
                className="w-full p-2 rounded-lg bg-[#F9F9F9] text-[#2D3436] border border-[#F0F0F0]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2D3436]/80 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full p-2 rounded-lg bg-[#F9F9F9] text-[#2D3436] border border-[#F0F0F0]
                focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]
                disabled:text-[#2D3436]/50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#2D3436]/80 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows="4"
                className="w-full p-2 rounded-lg bg-[#F9F9F9] text-[#2D3436] border border-[#F0F0F0]
                focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] 
                disabled:text-[#2D3436]/50 resize-none"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-[#FF6B6B] text-white px-4 py-2 rounded-lg 
                transition-colors flex items-center gap-2 
                hover:bg-[#FF6B6B]/90 hover:shadow-lg hover:shadow-[#FF6B6B]/20"
              >
                <Edit size={20} />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(user);
                  }}
                  className="bg-[#F0F0F0] text-[#2D3436] px-4 py-2 rounded-lg 
                  hover:bg-[#F0F0F0]/90 transition-colors flex items-center gap-2"
                >
                  <X size={20} />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#FF6B6B] text-white px-4 py-2 rounded-lg 
                  transition-colors flex items-center gap-2 
                  disabled:opacity-50 hover:bg-[#FF6B6B]/90 
                  hover:shadow-lg hover:shadow-[#FF6B6B]/20"
                >
                  <Save size={20} />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;