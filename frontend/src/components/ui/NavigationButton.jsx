import { Link } from "react-router-dom";

export const NavigationButton = ({ icon: Icon, children, to, onClick, isLoading }) => (
  <div className="transition-all duration-300 font-primary">
    {to ? (
      <Link 
        to={to} 
        className="flex items-center gap-3 text-primary hover:bg-white hover:text-hover1 px-4 py-3 rounded-xl transition-all duration-300 font-medium group"
      >
        {Icon && (
          <Icon 
            className="w-5 h-5 text-icon group-hover:text-hover1 group-hover:scale-110 transition-all" 
          />
        )}
        {children}
      </Link>
    ) : (
      <button
        onClick={onClick}
        className="flex items-center gap-3 text-primary hover:bg-white hover:text-hover1 px-4 py-3 rounded-xl w-full transition-all duration-300 font-medium group disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {Icon && (
          <Icon 
            className="w-5 h-5 text-icon group-hover:text-hover1 group-hover:scale-110 transition-all" 
          />
        )}
        {isLoading ? "Signing Out..." : children}
      </button>
    )}
  </div>
);

export default NavigationButton;