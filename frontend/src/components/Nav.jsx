import React, { useState, useCallback } from "react";
import {  useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import {
  CalendarHeart,
  User,
  LogOut,
  Settings,
  ShoppingCart,
  Menu,
  X,
  Gift,
  Clock,
} from "lucide-react";
import { useAppContext } from "../contexts/AppContext";
import CitySelector from "./CitySelector";
// import * as apiClient from "../api/MyUserApi";
import NavigationButton from "./ui/NavigationButton";
import CompanyLogo from "./ui/CompanyLogo";
import LocationDisplay from "./ui/LocationDisplay";

const SidePanel = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 w-80 h-full bg-sky-50 z-50 shadow-2xl p-8 flex flex-col border-l border-purple-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent text-slate-700">
            {title}
          </h2>
          <button onClick={onClose} className="text-gray-600 hover:text-pink-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        {children}
      </div>
    </>
  );
};

const Nav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);
    const [isCitySelectorOpen, setIsCitySelectorOpen] = useState(false);
    const { isLoggedIn, showToast, currentLocation } = useAppContext();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
  
    // const signOutMutation = useMutation(apiClient.signOut, {
    //   onSuccess: async () => {
    //     await queryClient.invalidateQueries("validateToken");
    //     setIsProfilePanelOpen(false);
    //     setIsMenuOpen(false);
    //     showToast({ message: "Signed Out!", type: "SUCCESS" });
    //     navigate("/");
    //   },
    // });
  
    // const handleSignOut = useCallback(() => {
    //   signOutMutation.mutate();
    // }, [signOutMutation]);
  
    const navigationItems = isLoggedIn ? (
      <>
        <NavigationButton icon={User } to="/profile">Your Profile</NavigationButton>
        <NavigationButton icon={Gift} to="/orders">Your Events</NavigationButton>
        <NavigationButton icon={ShoppingCart} to="/cart">Cart Items</NavigationButton>
        <NavigationButton icon={Settings} to="/settings">Settings</NavigationButton>
        <NavigationButton icon={LogOut} onClick={handleSignOut} isLoading={signOutMutation.isLoading}>Sign Out</NavigationButton>
      </>
   ) : (
        <NavigationButton icon={User  } to="/login">Login</NavigationButton>
      );
  
    return (
      <header className="bg-sky-50 py-4 px-6 sticky top-0 z-40 shadow-md select-none border-b border-purple-100">
        <div className="container mx-auto flex justify-between items-center">
          <CompanyLogo onClick={() => navigate("/")} />
          <nav className="hidden md:flex space-x-4 items-center font-secondary">
            <LocationDisplay currentLocation={currentLocation} onChange={() => setIsCitySelectorOpen(true)} />
            <div className="h-6 w-px bg-purple-200 mx-2" />
            <NavigationButton icon={CalendarHeart} to="/events">Browse Events</NavigationButton>
            <NavigationButton icon={Clock} to="/last-minute">Last Minute</NavigationButton>
            {isLoggedIn ? (
              <button onClick={() => setIsProfilePanelOpen(true)} className="p-3 rounded-xl hover:bg-white/80 transition-all duration-300 group">
                <User  className="w-6 h-6 text-gray-700 group-hover:text-purple-600 group-hover:scale-110 transition-all" />
              </button>
            ) : (
              <NavigationButton icon={User  } to="/login">Login</NavigationButton>
            )}
          </nav>
          <button className="md:hidden p-3 rounded-xl hover:bg-white/80 transition-all duration-300 group" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6 text-gray-700 group-hover:text-purple-600" /> : <Menu className="w-6 h-6 text-gray-700 group-hover:text-purple-600" />}
          </button>
        </div>
  
        <SidePanel isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} title="Menu">
          <div className="space-y-2">
            <LocationDisplay currentLocation={currentLocation} onChange={() => setIsCitySelectorOpen(true)} />
            <NavigationButton icon={CalendarHeart} to="/events">Browse Events</NavigationButton>
            <NavigationButton icon={Clock} to="/last-minute">Last Minute</NavigationButton>
            {navigationItems}
          </div>
        </SidePanel>
  
        <SidePanel isOpen={isProfilePanelOpen && !isMenuOpen} onClose={() => setIsProfilePanelOpen(false)} title="Your Account">
          <div className="space-y-2">{navigationItems}</div>
        </SidePanel>
        <CitySelector onClose={() => setIsCitySelectorOpen(false)} isOpen={isCitySelectorOpen} />
      </header>
    );
  };
  
  export default Nav;