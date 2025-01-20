import { Link } from "react-router-dom";

export const NavigationButton = ({ icon: Icon, children, to, onClick, isLoading }) => (
  <div className="transition-all duration-300 font-happiness">
    {to ? (
      <Link 
        to={to} 
        className="flex items-center gap-3 text-white hover:text-black px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white font-medium group"
      >
        {Icon && (
          <Icon 
            className="w-5 h-5 text-white group-hover:text-black group-hover:scale-110 transition-all" 
          />
        )}
        {children}
      </Link>
    ) : (
      <button
        onClick={onClick}
        className="flex items-center gap-3 text-white hover:text-black px-4 py-3 rounded-xl w-full transition-all duration-300 hover:bg-white font-medium group disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {Icon && (
          <Icon 
            className="w-5 h-5 text-white group-hover:text-black group-hover:scale-110 transition-all" 
          />
        )}
        {isLoading ? "Signing Out..." : children}
      </button>
    )}
  </div>
);

export default NavigationButton;