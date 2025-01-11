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
const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useAppContext();

  return isLoggedIn ? <Navigate to="/" replace /> : children;
};
const AppRoutes = () => {
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
          path="/login"
          element={
            <PublicRoute>
              <RegLayout>
                <Login />
              </RegLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegLayout>
                <Register />
              </RegLayout>
            </PublicRoute>
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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
