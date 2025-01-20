import CategoriesNav from "../components/layout/CategoriesNav";
import Footer from "../components/layout/Footer";
import Nav from "../components/layout/Nav";
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen text-white bg-black">
      <Nav />
      <CategoriesNav/>
      <div className="container mx-auto py-10 flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
