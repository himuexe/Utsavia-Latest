import React from 'react';
import { useDispatch } from 'react-redux';
import { removeFromCart } from '../../store/cartSlice';
import { Trash2, Calendar, Clock, MapPin } from 'lucide-react';
import { showToast } from '../../store/appSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleRemove = async () => {
    try {
      await dispatch(removeFromCart(item._id)).unwrap();
      dispatch(
        showToast({
          message: "Item removed from cart",
          type: "SUCCESS",
        })
      );
    } catch (error) {
      dispatch(
        showToast({
          message: "Failed to remove item from cart",
          type: "ERROR",
        })
      );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-5 hover:shadow-lg hover:shadow-[#9333EA]/10 transition-all duration-300">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="w-full sm:w-32 h-32">
          <img
            src={item.imageUrl || "/api/placeholder/96/96"}
            alt={item.itemName}
            className="w-full h-full object-cover rounded-lg shadow-sm"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-secondary text-secondary">{item.itemName}</h3>
            <span className="text-xl font-primary font-semibold text-primary">₹{item.price.toLocaleString()}</span>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 font-primary text-sm text-primary">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <span>{new Date(item.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <span>{item.timeSlot}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-400" />
              <span>{item.city}, {item.pincode}</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
            <button
              onClick={handleRemove}
              className="flex items-center gap-2 text-gray-400 hover:text-[#FF6B6B] transition-colors cursor-pointer"
              aria-label="Remove item"
            >
              <Trash2 size={16} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;