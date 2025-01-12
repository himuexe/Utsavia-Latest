import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import RegLayout from "./layouts/RegLayout";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAppContext } from "./contexts/AppContext";
import ProfilePage from "./pages/ProfilePage";
import Theme from "./pages/Theme";
import CitySelector from "./components/CitySelector";
import ProductBookingPage from "./pages/ProductBookingPage";
import CheckoutPage from "./pages/CheckOut";
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAppContext();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-purple-600 text-xl">Loading...</div>
      </div>
    );
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { currentLocation } = useAppContext();
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
              {currentLocation ? (
                <Theme currentLocation={currentLocation} />
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
              {currentLocation ? (
                <ProductBookingPage currentLocation={currentLocation} />
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
            <ProtectedRoute>
              <RegLayout>
                <ProfilePage />
              </RegLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <RegLayout>
              <CheckoutPage />
            </RegLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
