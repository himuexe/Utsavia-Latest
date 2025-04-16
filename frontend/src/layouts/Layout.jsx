import ChatBot from "../components/layout/Chatbot";
import Footer from "../components/layout/Footer";
import Nav from "../components/layout/Nav";
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Nav />
      <div className="container mx-auto  flex-1 ">{children}</div>
      <Footer />
      <ChatBot/>
    </div>
  );
};

export default Layout;
