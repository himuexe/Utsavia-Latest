// CartPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCartItems,
  selectCartItems,
  selectCartLoading,
  selectCartError,
  setCheckoutDetails,
} from '../store/cartSlice';
import { showToast } from '../store/appSlice';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Loading from '../components/ui/Loading';
import NotFoundPage from './404';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { IoMdArrowRoundBack } from "react-icons/io";

const EmptyCart = () => (
  <div className="flex flex-col items-center justify-center py-16 max-w-md mx-auto">
    <div className="bg-gray-100 p-6 rounded-full mb-6">
      <ShoppingBag size={48} className="text-[#FF6B6B]" />
    </div>
    <h2 className="text-2xl font-bold mb-3 text-[#2D3436]">Your cart is empty</h2>
    <p className="text-[#666] mb-8 text-center">Looks like you haven't added any items to your cart yet</p>
    <button
      onClick={() => window.history.back()}
      className="flex items-center gap-2 bg-[#FF6B6B] text-white px-6 py-3 rounded-lg hover:bg-[#FF6B6B]/90 transition-all shadow-md hover:shadow-lg"
    >
      <ArrowLeft size={18} />
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
      dispatch(
        showToast({
          message: "Failed to load cart items",
          type: "ERROR",
        })
      );
    });
  }, [dispatch]);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      dispatch(
        showToast({
          message: "Please add items to cart before checkout",
          type: "ERROR",
        })
      );
      return;
    }

    // Save cart items to localStorage
    localStorage.setItem('checkoutType', 'cart');
    localStorage.setItem('bookingDetails', JSON.stringify(null));

    dispatch(
      setCheckoutDetails({
        type: 'cart',
        bookingDetails: null,
      })
    );

    navigate('/checkout');
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <NotFoundPage />;
  }

  if (!cartItems.length) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
        <div
          onClick={() => window.history.back()}
          className="flex items-center text-primary hover:text-secondary mb-4 cursor-pointer"
        >
          <IoMdArrowRoundBack className="mr-1" /> Back
        </div>
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
          <h1 className="text-3xl font-secondary text-primary">Shopping Cart</h1>
          <span className="text-sm font-primary text-gray-500">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {cartItems.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>
            

          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-8">
              <CartSummary items={cartItems} />
              <button
                onClick={handleCheckout}
                className="w-full bg-background text-primary font-primary p-4 rounded-xl 
                mt-4 hover:bg-white transition-all 
                hover:shadow-lg hover:shadow-[#9333EA]/20 cursor-pointer
                font-bold text-center border-1 border-hover1"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;