import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as apiClient from "../api/MyUserApi";
import { Edit, Save, X } from 'lucide-react';
import { showToast } from "../store/appSlice";

const UserProfile = () => {
  const [user, setUser ] = useState(null);
  const navigate = useNavigate();
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

  const  dispatch  = useDispatch();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userData = await apiClient.fetchCurrentUser ();
        setUser (userData);
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
      const updatedUser  = await apiClient.updateUserProfile(formData);
      setUser (updatedUser );
      setIsEditing(false);
      dispatch(showToast({ message: 'Profile updated successfully', type: 'SUCCESS' }));
      navigate("/");
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
      dispatch(showToast({ message: 'Failed to update profile', type: 'ERROR' }));;
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-purple-700 text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-md p-6 mt-4">
      <div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container"
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-700 mb-2 font-primary">
            {isEditing ? 'Edit Your Profile' : 'Your Profile'}
          </h1>
          <p className="text-gray-600">
            Update your personal information
          </p>
        </div>

        {validationError && (
          <div className="mb-4 text-red-500">{validationError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-secondary text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                disabled
                className="w-full p-2 border rounded-lg text-gray-600 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-secondary text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                disabled
                className="w-full p-2 border rounded-lg text-gray-600 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-secondary text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user.primaryEmail}
                disabled
                className="w-full p-2 border rounded-lg bg-gray-100 text-gray-600"
              />
            </div>

            <div>
              <label className="block font-secondary text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-secondary text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows="4"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg  transition-colors flex items-center gap-2 font-happiness"
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
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 font-happiness"
                >
                  <X size={20} />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg  transition-colors flex items-center gap-2 disabled:opacity-50 font-happiness"
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