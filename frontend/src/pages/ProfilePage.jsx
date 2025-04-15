import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAddressValidity } from "../store/appSlice";
import * as apiClient from "../api/MyUserApi";
import { Edit, Save, X } from "lucide-react";
import { showToast } from "../store/appSlice";
import Loading from "../components/ui/Loading";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    addresses: [],
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userData = await apiClient.fetchCurrentUser();
        setUser(userData);
        setFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          addresses: userData.addresses || [],
        });
      } catch (err) {
        setError("Failed to load user profile. Please try again later.");
        console.error("Error loading user profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e, index) => {
    const { name, value } = e.target;
    const updatedAddresses = [...formData.addresses];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      [name]: value,
    };
    setFormData((prev) => ({
      ...prev,
      addresses: updatedAddresses,
    }));
  };

  const handleAddAddress = () => {
    setFormData((prev) => ({
      ...prev,
      addresses: [
        ...prev.addresses,
        { street: "", city: "", state: "", zipCode: "", country: "", isPrimary: false },
      ],
    }));
  };

  const handleRemoveAddress = (index) => {
    const updatedAddresses = formData.addresses.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      addresses: updatedAddresses,
    }));
  };

  const handleSetPrimaryAddress = (index) => {
    const updatedAddresses = formData.addresses.map((address, i) => ({
      ...address,
      isPrimary: i === index, // Set only the selected address as primary
    }));
    setFormData((prev) => ({
      ...prev,
      addresses: updatedAddresses,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setValidationError(null);

    try {
      const updatedUser = await apiClient.updateUserProfile({
        phone: formData.phone,
        addresses: formData.addresses,
      });
      setUser(updatedUser);
      setIsEditing(false);
      const isComplete = await apiClient.checkProfileCompletion();
      dispatch(setAddressValidity(isComplete === "" ? false : isComplete));
      dispatch(showToast({ message: "Profile updated successfully", type: "SUCCESS" }));
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating profile:", err);
      dispatch(showToast({ message: "Failed to update profile", type: "ERROR" }));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loading />;
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
          <h1 className="text-2xl font-secondary text-secondary mb-2">
            {isEditing ? "Edit Your Profile" : "Your Profile"}
          </h1>
          <p className="text-primary">Update your personal information</p>
        </div>

        {validationError && (
          <div className="mb-4 text-[#FF6B6B]">{validationError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium font-primary text-primary mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                disabled
                className="w-full p-2 rounded-lg text-[#2D3436] bg-[#F9F9F9] border border-[#F0F0F0] 
                focus:outline-hidden focus:ring-2 focus:ring-hover1 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium font-primary text-primary mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                disabled
                className="w-full p-2 rounded-lg text-[#2D3436] bg-[#F9F9F9] border border-[#F0F0F0] 
                focus:outline-hidden focus:ring-2 focus:ring-hover1 cursor-not-allowed"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium font-primary text-primary mb-1">
                Email
              </label>
              <input
                type="email"
                value={user.primaryEmail}
                disabled
                className="w-full p-2 rounded-lg bg-[#F9F9F9] text-[#2D3436] border border-[#F0F0F0 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium font-primary text-primary mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full p-2 rounded-lg bg-[#F9F9F9] text-[#2D3436] border border-[#F0F0F0]
                focus:outline-hidden focus:ring-2 focus:ring-hover1
                disabled:text-[#2D3436]/50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium font-primary text-primary mb-1">
                Addresses
              </label>
              {formData.addresses.map((address, index) => (
                <div key={index} className="mb-6 p-4 border border-[#F0F0F0] rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="street"
                      value={address.street}
                      onChange={(e) => handleAddressChange(e, index)}
                      disabled={!isEditing}
                      placeholder="Street"
                      className="w-full p-2 rounded-lg bg-[#F9F9F9] text-[#2D3436] border border-[#F0F0F0] focus:outline-hidden focus:ring-2 focus:ring-hover1 disabled:text-[#2D3436]/50"
                    />
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={(e) => handleAddressChange(e, index)}
                      disabled={!isEditing}
                      placeholder="City"
                      className="w-full p-2 rounded-lg bg-[#F9F9F9] text-[#2D3436] border border-[#F0F0F0] focus:outline-hidden focus:ring-2 focus:ring-hover1 disabled:text-[#2D3436]/50"
                    />
                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={(e) => handleAddressChange(e, index)}
                      disabled={!isEditing}
                      placeholder="State"
                      className="w-full p-2 rounded-lg bg-[#F9F9F9] text-[#2D3436] border border-[#F0F0F0] focus:outline-hidden focus:ring-2 focus:ring-hover1 disabled:text-[#2D3436]/50"
                    />
                    <input
                      type="text"
                      name="zipCode"
                      value={address.zipCode}
                      onChange={(e) => handleAddressChange(e, index)}
                      disabled={!isEditing}
                      placeholder="Zip Code"
                      className="w-full p-2 rounded-lg bg-[#F9F9F9] text-[#2D3436] border border-[#F0F0F0] focus:outline-hidden focus:ring-2 focus:ring-hover1 disabled:text-[#2D3436]/50"
                    />
                    <input
                      type="text"
                      name="country"
                      value={address.country}
                      onChange={(e) => handleAddressChange(e, index)}
                      disabled={!isEditing}
                      placeholder="Country"
                      className="w-full p-2 rounded-lg bg-[#F9F9F9] text-[#2D3436] border border-[#F0F0F0] focus:outline-hidden focus:ring-2 focus:ring-hover1 disabled:text-[#2D3436]/50"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={address.isPrimary}
                        onChange={() => handleSetPrimaryAddress(index)}
                        disabled={!isEditing}
                        className="form-checkbox h-4 w-4 text-[#FF6B6B] rounded-sm focus:ring-hover1"
                      />
                      <span className="text-sm text-primary">Primary Address</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveAddress(index)}
                      disabled={!isEditing}
                      className="text-[#FF6B6B] hover:text-[#FF6B6B]/90 disabled:text-[#2D3436]/50 cursor-pointer"
                    >
                      Remove Address
                    </button>
                  </div>
                </div>
              ))}
              {isEditing && (
                <button
                  type="button"
                  onClick={handleAddAddress}
                  className="p-3 flex flex-row gap-3 items-center rounded-xl  duration-300 cursor-pointer group bg-background hover:bg-white transition-colors 
          hover:shadow-lg hover:shadow-[#9333EA]/20"
                >
                  Add Address
                </button>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-3 flex flex-row gap-3 items-center rounded-xl  duration-300 cursor-pointer group bg-background hover:bg-white transition-colors 
          hover:shadow-lg hover:shadow-[#9333EA]/20"
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
                  hover:bg-[#F0F0F0]/90 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <X size={20} />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="p-3 flex flex-row gap-3 items-center rounded-xl  duration-300 cursor-pointer group bg-background hover:bg-white transition-colors 
          hover:shadow-lg hover:shadow-[#9333EA]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={20} />
                  {isSaving ? "Saving..." : "Save Changes"}
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
