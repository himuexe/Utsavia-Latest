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
      </Routes>
    </Router>
  );
};

export default AppRoutes;
