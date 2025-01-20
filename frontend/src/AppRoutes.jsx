import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate
} from "react-router-dom";
import Loading from "./components/ui/Loading";
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
import {
  selectSelectedCity,
  selectIsLoggedIn,
} from "./store/appSlice";

const AuthWrapper = ({ children }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const location = useLocation();
  
  if (!isLoggedIn) {
    // Save the attempted URL in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const selectedCity = useSelector(selectSelectedCity);

  return (
    <Router>
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
                <CheckoutPage />
              </RegLayout>
            </AuthWrapper>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
