import { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, InfoIcon } from "lucide-react";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const toastStyles = {
    SUCCESS: {
      background: "bg-icon", 
      border: "border-icon/20",
      icon: <CheckCircle className="mr-2 h-5 w-5 text-white" />,
    },
    ERROR: {
      background: "bg-red-500", 
      border: "border-red-600",
      icon: <XCircle className="mr-2 h-5 w-5 text-white" />,
    },
    WARNING: {
      background: "bg-marigold", 
      border: "border-marigold/20",
      icon: <AlertCircle className="mr-2 h-5 w-5 text-white" />,
    },
    INFO: {
      background: "bg-secondary", 
      border: "border-secondary/20",
      icon: <InfoIcon className="mr-2 h-5 w-5 text-white" />,
    },
  };

  const { background, border, icon } = toastStyles[type] || toastStyles.INFO;
  
  return (
    <div 
      className={`
        fixed top-5 right-5 z-50 py-3 px-4
        text-white font-semibold 
        rounded-lg shadow-lg
        border-l-4 ${border}
        transform transition-all duration-300 ease-in-out
        ${background} font-happiness
      `}
    >
      <div className="flex items-center">
        {icon}
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;