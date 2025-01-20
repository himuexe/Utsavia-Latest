import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCartItems, 
  selectCartItems, 
  selectCartLoading, 
  selectCartError 
} from '../store/cartSlice';
import { showToast } from '../store/appSlice';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';

const EmptyCart = () => (
  <div className="text-center py-12">
    <div className="text-6xl mb-4">🛒</div>
    <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
    <p className="text-gray-600 mb-6">Looks like you haven't added any items yet</p>
    <button
      onClick={() => window.history.back()}
      className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
    >
      Continue Shopping
    </button>
  </div>
);

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const isLoading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);

  useEffect(() => {
    dispatch(fetchCartItems()).catch((error) => {
      dispatch(showToast({
        message: "Failed to load cart items",
        type: "ERROR"
      }));
    });
  }, [dispatch]);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      dispatch(showToast({
        message: "Please add items to cart before checkout",
        type: "ERROR"
      }));
      return;
    }
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-pulse">Loading your cart...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          {error}. Please try refreshing the page.
        </div>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>
        <div className="lg:col-span-1 space-y-4">
          <CartSummary items={cartItems} />
          <button
            onClick={handleCheckout}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold
              hover:bg-purple-700 transition-colors duration-200"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;