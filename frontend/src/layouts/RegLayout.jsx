import Nav from "../components/Nav";
import Footer from "../components/Footer";

const RegLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen ">
      <Nav />
      <div className="container mx-auto py-10 flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default RegLayout;
