 import { Link } from "react-router-dom";
 export const NavigationButton = ({ icon: Icon, children, to, onClick, isLoading }) => (
    <div className="transition-all duration-300 font-happiness">
      {to ? (
        <Link to={to} className="flex items-center gap-3 text-gray-700 hover:text-purple-600 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-gradient-to-br from-purple-50 to-pink-50 font-medium group">
          {Icon && <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />}
          {children}
        </Link>
      ) : (
        <button
          onClick={onClick}
          className="flex items-center gap-3 text-gray-700 hover:text-purple-600 px-4 py-3 rounded-xl w-full transition-all duration-300 hover:bg-white/80 font-medium group"
          disabled={isLoading}
        >
          {Icon && <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />}
          {isLoading ? "Signing Out..." : children}
        </button>
      )}
    </div>
  );
  export default NavigationButton