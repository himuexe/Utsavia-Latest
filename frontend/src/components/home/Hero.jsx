import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
 const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary to-secondary overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 text-white mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-happiness font-bold leading-tight mb-6">
              Transform Your <span className="text-marigold">Events</span> With Stunning Decor
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-lg">
              Book premium event decorations for any occasion. Easy to order, delivered to your door.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/themes" className="bg-white text-primary px-8 py-3 rounded-full font-medium text-lg hover:bg-opacity-90 transition-all shadow-lg transform hover:-translate-y-1">
                Browse Themes
              </Link>
              <Link to="/contact" className="border-2 border-white text-white px-8 py-3 rounded-full font-medium text-lg hover:bg-white hover:text-primary transition-all">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 relative">
            <div className="bg-white p-4 rounded-2xl shadow-2xl">
              <img 
                src="/H1.jpg" 
                alt="Beautiful Event Decoration" 
                className="w-full h-80 object-cover rounded-xl"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-white p-3 rounded-lg shadow-lg">
              <div className="bg-marigold text-white p-2 rounded-md flex items-center">
                <FaStar className="mr-1" />
                <span className="font-bold">4.9</span>
                <span className="ml-1 text-sm">(2.5k+ reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hero;