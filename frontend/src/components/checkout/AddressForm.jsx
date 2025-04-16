import { useEffect, useState } from 'react';
import * as apiClient from '../../api/MyUserApi';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { showToast } from '../../store/appSlice';
import { setAddressValidity } from '../../store/appSlice';

const AddressForm = ({ onSuccess, initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm({
    defaultValues: initialData,
  });

  const [addresses, setAddresses] = useState(initialData?.addresses || []); // Separate state for addresses
  const dispatch = useDispatch();

  // Sync addresses with form state
  useEffect(() => {
    setValue("addresses", addresses);
    trigger("addresses"); // Trigger validation for addresses
  }, [addresses, setValue, trigger]);

  const mutation = useMutation(apiClient.updateUserProfile, {
    onSuccess: () => {
      dispatch(showToast({ message: 'Address updated successfully', type: 'SUCCESS' }));
      dispatch(setAddressValidity(true));
      onSuccess?.();
    },
    onError: (error) => {
      dispatch(showToast({ message: error?.message || 'An error occurred', type: 'ERROR' }));
      dispatch(setAddressValidity(false));
    },
  });

  const onSubmit = (data) => {
    if (data.addresses.length === 0) {
      dispatch(showToast({ message: 'At least one address is required', type: 'ERROR' }));
      return;
    }
    mutation.mutate(data);
  };

  const handleAddAddress = () => {
    const newAddress = { street: "", city: "", state: "", zipCode: "", country: "", isPrimary: false };
    setAddresses((prev) => [...prev, newAddress]); // Update addresses state
  };

  const handleRemoveAddress = (index) => {
    if (addresses.length === 1) {
      dispatch(showToast({ message: 'At least one address is required', type: 'ERROR' }));
      return;
    }
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses); // Update addresses state
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-primary font-primary mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          className="w-full p-3 rounded-xl border border-[#F0F0F0] 
          focus:outline-hidden focus:ring-2 focus:ring-hover1 
          bg-white text-[#2D3436] placeholder-[#666]"
          placeholder="Enter your phone number"
          {...register('phone', {
            required: 'Phone number is required',
            pattern: {
              value: /^[0-9]{10}$/,
              message: 'Please enter a valid 10-digit phone number',
            },
          })}
        />
        {errors.phone && (
          <span className="text-[#FF6B6B] text-sm mt-1">{errors.phone.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-primary font-primary mb-1">
          Delivery Addresses
        </label>
        {addresses.map((address, index) => (
          <div key={index} className="mb-4 p-4 border border-[#F0F0F0] rounded-lg gap-1 flex flex-col">
            <input
              type="text"
              placeholder="Street"
              className="w-full p-2 rounded-lg bg-[#F9F9F9] text-[#2D3436] border border-[#F0F0F0] focus:outline-hidden focus:ring-2 focus:ring-hover1"
              {...register(`addresses.${index}.street`, { required: 'Street is required' })}
            />
            <input
              type="text"
              placeholder="City"
              className="w-full p-2 rounded-lg bg-[#F9F9F9] text-[#2D3436] border border-[#F0F0F0] focus:outline-hidden focus:ring-2 focus:ring-hover1"
              {...register(`addresses.${index}.city`, { required: 'City is required' })}
            />
            <input
              type="text"
              placeholder="State"
              className="w-full p-2 rounded-lg bg-[#F9F9F9] text-[#2D3436] border border-[#F0F0F0] focus:outline-hidden focus:ring-2 focus:ring-hover1"
              {...register(`addresses.${index}.state`, { required: 'State is required' })}
            />
            <input
              type="text"
              placeholder="Zip Code"
              className="w-full p-2 rounded-lg bg-[#F9F9F9] text-[#2D3436] border border-[#F0F0F0] focus:outline-hidden focus:ring-2 focus:ring-hover1"
              {...register(`addresses.${index}.zipCode`, { required: 'Zip Code is required' })}
            />
            <input
              type="text"
              placeholder="Country"
              className="w-full p-2 rounded-lg bg-[#F9F9F9] text-[#2D3436] border border-[#F0F0F0] focus:outline-hidden focus:ring-2 focus:ring-hover1"
              {...register(`addresses.${index}.country`, { required: 'Country is required' })}
            />
            <button
              type="button"
              onClick={() => handleRemoveAddress(index)}
              className="text-[#FF6B6B] hover:text-[#FF6B6B]/90 cursor-pointer"
            >
              Remove Address
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddAddress}
          className="p-3 flex flex-row gap-3 items-center rounded-xl  duration-300 cursor-pointer group bg-background hover:bg-white transition-colors 
          hover:shadow-lg hover:shadow-[#9333EA]/20 border border-hover1"
        >
          Add Address
        </button>
      </div>

      <button
        type="submit"
        disabled={mutation.isLoading}
        className="w-full bg-background text-primary font-primary p-3 rounded-xl 
          hover:bg-white transition-colors 
          hover:shadow-lg hover:shadow-[#9333EA]/20 cursor-pointer disabled:cursor-not-allowed border border-hover1"
      >
        {mutation.isLoading ? 'Updating...' : 'Save Addresses'}
      </button>
    </form>
  );
};

export default AddressForm;