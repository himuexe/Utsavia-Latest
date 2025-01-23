import { useEffect } from 'react';
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
    reset,
  } = useForm({
    defaultValues: initialData,
  });
  const dispatch = useDispatch();

  // Reset form when initial data changes
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

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
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#666] mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          className="w-full p-3 rounded-xl border border-[#F0F0F0] 
          focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] 
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
        <label className="block text-sm font-medium text-[#666] mb-1">
          Delivery Address
        </label>
        <textarea
          className="w-full p-3 rounded-xl border border-[#F0F0F0] 
          focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] 
          bg-white text-[#2D3436] placeholder-[#666] min-h-[100px]"
          placeholder="Enter your complete address"
          {...register('address', {
            required: 'Address is required',
            minLength: {
              value: 10,
              message: 'Address should be at least 10 characters long',
            },
          })}
        />
        {errors.address && (
          <span className="text-[#FF6B6B] text-sm mt-1">{errors.address.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={mutation.isLoading}
        className="w-full bg-[#FF6B6B] text-white py-3 rounded-xl font-semibold
          hover:bg-[#FF6B6B]/90 transition-colors duration-200 
          disabled:bg-[#F0F0F0] disabled:text-[#666] disabled:cursor-not-allowed"
      >
        {mutation.isLoading ? 'Updating...' : 'Save Address'}
      </button>
    </form>
  );
};

export default AddressForm;