import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import {
  User,
  LogOut,
  ShoppingCart,
  Menu,
  X,
  Gift,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  showToast,
  selectIsLoggedIn,
  selectSelectedCity,
} from "../../store/appSlice";
import CitySelector from "../ui/CitySelector";
import * as apiClient from "../../api/MyUserApi";
import NavigationButton from "../ui/NavigationButton";
import CompanyLogo from "../ui/CompanyLogo";
import LocationDisplay from "../ui/LocationDisplay";
import SidePanel from "./SidePanel";

const Nav = () => {
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);
  const [isCitySelectorOpen, setIsCitySelectorOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const selectedCity = useSelector(selectSelectedCity);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleCloseMenus = useCallback(() => {
    setIsMenuOpen(false);
    setIsProfilePanelOpen(false);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchUser = async () => {
        try {
          const user = await apiClient.fetchCurrentUser();
          setUserName(user.firstName);
        } catch (error) {
          console.error("Error fetching user data:");
        }
      };

      fetchUser();
    }
  }, [isLoggedIn]);

  const signOutMutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken");
      setIsProfilePanelOpen(false);
      setIsMenuOpen(false);
      setUserName("");
      dispatch(
        showToast({ message: "Signed out successfully!", type: "SUCCESS" })
      );
    },
  });

  const handleSignOut = useCallback(() => {
    signOutMutation.mutate();
  }, [signOutMutation]);

  const navigationItems = isLoggedIn ? (
    <>
      <NavigationButton
        icon={User}
        to="/profile"
        onNavigate={handleCloseMenus}
        className="w-full flex items-center gap-3 px-4 py-3  rounded-xl transition-all font-medium text-base"
      >
        Profile
      </NavigationButton>
      <NavigationButton
        icon={Gift}
        to="/mybookings"
        onNavigate={handleCloseMenus}
        className="w-full flex items-center gap-3 px-4 py-3  rounded-xl transition-all font-medium text-base"
      >
        My Bookings
      </NavigationButton>
      <NavigationButton
        icon={LogOut}
        onClick={handleSignOut}
        isLoading={signOutMutation.isLoading}
        className="w-full flex items-center gap-3 px-4 py-3  rounded-xl transition-all font-medium text-base"
      >
        Sign Out
      </NavigationButton>
    </>
  ) : (
    <NavigationButton
      icon={User}
      to="/login"
      className="w-full flex items-center gap-3 px-4 py-3  rounded-xl transition-all font-medium text-base "
    >
      Login
    </NavigationButton>
  );

  return (
    <header className="bg-background py-4 px-6 sticky top-0 z-40 shadow-md select-none border-b border-[#F0F0F0]">
      <div className="container mx-auto flex justify-between items-center">
        <CompanyLogo onClick={() => navigate("/")} />
        <nav className="hidden md:flex space-x-4 items-center font-secondary text-[#2D3436]">
          <LocationDisplay
            selectedCity={selectedCity}
            onChange={() => setIsCitySelectorOpen(true)}
          />
          <div className="h-6 w-px bg-[#F0F0F0] mx-2" />
          {isLoggedIn ? (
            <>
              <span className="flex  items-center gap-2 px-4 py-2 text-primary rounded-xl font-medium text-base">
                Hello , {userName}
              </span>
              <button
                onClick={() => navigate("/cart")}
                className="p-3 rounded-xl hover:bg-white  duration-300 cursor-pointer group transition-colors 
          hover:shadow-lg hover:shadow-[#9333EA]/20" 
              >
                <ShoppingCart className="w-6 h-6 text-icon group-hover:text-hover1 " />
              </button>
              <button
                onClick={() => setIsProfilePanelOpen(true)}
                className="p-3 rounded-xl hover:bg-white  duration-300 group cursor-pointer transition-colors 
          hover:shadow-lg hover:shadow-[#9333EA]/20"
              >
                <User className="w-6 h-6 text-icon group-hover:text-hover1" />
              </button>
            </>
          ) : (
            <button
            onClick={() => navigate("/login")}
            className="p-3 flex flex-row gap-3 items-center rounded-xl hover:bg-white  duration-300 cursor-pointer group transition-colors 
          hover:shadow-lg hover:shadow-[#9333EA]/20 border border-hover1"
          >
            <User className="w-6 h-6 text-icon group-hover:text-hover1 " />
            <span className="font-secondary text-primary">Login</span>
          </button>
          )}
        </nav>
        <button
          className="md:hidden p-3 rounded-xl hover:bg-[#FF6B6B] hover:text-white transition-all duration-300 group"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-[#2D3436] group-hover:text-white" />
          ) : (
            <Menu className="w-6 h-6 text-[#2D3436] group-hover:text-white" />
          )}
        </button>
      </div>

      <SidePanel
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        title="Menu"
      >
        <div className="space-y-4">
          <LocationDisplay
            selectedCity={selectedCity}
            onChange={() => setIsCitySelectorOpen(true)}
          />
          {navigationItems}
        </div>
      </SidePanel>

      <SidePanel
        isOpen={isProfilePanelOpen && !isMenuOpen}
        onClose={() => setIsProfilePanelOpen(false)}
        title="My Account"
      >
        <div className="space-y-4">{navigationItems}</div>
      </SidePanel>

      <CitySelector
        onClose={() => setIsCitySelectorOpen(false)}
        isOpen={isCitySelectorOpen}
      />
    </header>
  );
};

export default Nav;
