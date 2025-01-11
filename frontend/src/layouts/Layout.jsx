import Footer from "../components/Footer";
import Nav from "../components/Nav";
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-sky-50 ">
      <Nav />
      <div className="container mx-auto py-10 flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
