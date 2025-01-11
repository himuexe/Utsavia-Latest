import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
  } from "react-router-dom";
import Layout from "./layouts/Layout"

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<Layout><p>Home</p></Layout>} />
            </Routes>
        </Router>
    )
}

export default AppRoutes