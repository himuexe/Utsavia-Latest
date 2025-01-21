import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCartItems, 
  selectCartItems, 
  selectCartLoading, 
  selectCartError ,
  setCheckoutDetails
} from '../store/cartSlice';
import { showToast } from '../store/appSlice';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';

const EmptyCart = () => (
  <div className="text-center py-12">
    <div className="text-6xl mb-4">🛒</div>
    <h2 className="text-2xl font-bold mb-2 text-white">Your cart is empty</h2>
    <p className="text-zinc-400 mb-6">Looks like you haven't added any items yet</p>
    <button
      onClick={() => window.history.back()}
      className="bg-white text-black px-6 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
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
    dispatch(setCheckoutDetails({
      type: 'cart',
      bookingDetails: null
    }));
    
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
        <div className="text-center text-white">
          <div className="animate-pulse">Loading your cart...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
        <div className="text-center text-red-600">
          {error}. Please try refreshing the page.
        </div>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-black min-h-screen text-white">
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
            className="w-full bg-white text-black py-3 rounded-lg font-semibold
              hover:bg-zinc-200 transition-colors duration-200 hover:shadow-lg hover:shadow-purple-500/20"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;