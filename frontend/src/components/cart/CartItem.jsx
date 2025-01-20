import React from 'react';
import { useDispatch } from 'react-redux';
import { removeFromCart } from '../../store/cartSlice';
import { Trash2 } from 'lucide-react';
import { showToast } from '../../store/appSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleRemove = async () => {
    try {
      await dispatch(removeFromCart(item._id)).unwrap();
      dispatch(showToast({
        message: "Item removed from cart",
        type: "SUCCESS"
      }));
    } catch (error) {
      dispatch(showToast({
        message: "Failed to remove item from cart",
        type: "ERROR"
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center gap-4">
        <div className="w-24 h-24">
          <img
            src={item.imageUrl || "/api/placeholder/96/96"}
            alt={item.itemName}
            className="w-full h-full object-cover rounded-md"
            onError={(e) => {
              e.target.src = "/api/placeholder/96/96";
            }}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{item.itemName}</h3>
          <div className="mt-1 space-y-1 text-sm text-gray-600">
            <p>Date: {new Date(item.date).toLocaleDateString()}</p>
            <p>Time: {item.timeSlot}</p>
            <p>Location: {item.city}</p>
            <p>Pincode: {item.pincode}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-4">
          <span className="text-xl font-bold text-purple-600">₹{item.price.toLocaleString()}</span>
          <button
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;