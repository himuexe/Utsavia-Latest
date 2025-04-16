import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import PaymentSuccessPage from "./pages/PaymentSuccess";
import Layout from "./layouts/Layout";
import RegLayout from "./layouts/RegLayout";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useSelector } from "react-redux";
import ProfilePage from "./pages/ProfilePage";
import Theme from "./pages/Theme";
import CitySelector from "./components/ui/CitySelector";
import ProductBookingPage from "./pages/ProductBookingPage";
import CheckoutPage from "./pages/CheckOut";
import CartPage from "./pages/CartPage";
import MyBookingsPage from "./pages/MyBookingPage";
import { selectSelectedCity, selectIsLoggedIn } from "./store/appSlice";
import CategoriesPage from "./pages/Categories";
import ScrollToTop from "./components/ui/ScrollToTop";

const AuthWrapper = ({ children }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const location = useLocation();

  if (!isLoggedIn) {
    // Save the attempted URL and all state in navigation
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname,
          checkoutState: location.state, // Preserve the checkout state
        }}
        replace
      />
    );
  }

  return children;
};

const AppRoutes = () => {
  const selectedCity = useSelector(selectSelectedCity);

  return (
    <Router>
      <ScrollToTop>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <RegLayout>
              <Contact />
            </RegLayout>
          }
        />
        <Route
          path="/themes"
          element={
            <Layout>
              <CategoriesPage />
            </Layout>
          }
        />
        <Route
          path="/themes/:id"
          element={
            <Layout>
              {selectedCity ? (
                <Theme selectedCity={selectedCity} />
              ) : (
                <CitySelector isOpen={true} />
              )}
            </Layout>
          }
        />
        <Route
          path="/info/:id"
          element={
            <Layout>
              {selectedCity ? (
                <ProductBookingPage selectedCity={selectedCity} />
              ) : (
                <CitySelector isOpen={true} />
              )}
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <RegLayout>
              <Login />
            </RegLayout>
          }
        />
        <Route
          path="/register"
          element={
            <RegLayout>
              <Register />
            </RegLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthWrapper>
              <RegLayout>
                <ProfilePage />
              </RegLayout>
            </AuthWrapper>
          }
        />
        <Route
          path="/cart"
          element={
            <AuthWrapper>
              <RegLayout>
                <CartPage />
              </RegLayout>
            </AuthWrapper>
          }
        />
        <Route
          path="/checkout"
          element={
            <AuthWrapper>
              <RegLayout>
                <CheckoutPage selectedCity={selectedCity} />
              </RegLayout>
            </AuthWrapper>
          }
        />
        <Route
          path="/payment-success"
          element={
            <AuthWrapper>
              <RegLayout>
                <PaymentSuccessPage />
              </RegLayout>
            </AuthWrapper>
          }
        />
        <Route
          path="/mybookings"
          element={
            <AuthWrapper>
              <RegLayout>
                <MyBookingsPage />
              </RegLayout>
            </AuthWrapper>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </ScrollToTop>
    </Router>
  );
};

export default AppRoutes;
