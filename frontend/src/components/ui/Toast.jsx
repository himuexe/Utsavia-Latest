import { useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const toastStyles = {
    SUCCESS: {
      background: "bg-[#4ECDC4]", // Turquoise for success
      icon: <CheckCircle className="mr-2 text-white" />,
    },
    ERROR: {
      background: "bg-[#FF6B6B]", // Coral Pink for error
      icon: <XCircle className="mr-2 text-white" />,
    },
  };

  const { background, icon } = toastStyles[type] || toastStyles.ERROR;
  const styles = `
    fixed top-5 right-5 z-50 p-4 
    text-white text-lg font-semibold 
    rounded-lg shadow-lg transition-transform 
    duration-300 ease-in-out transform 
    ${background}
  `;

  return (
    <div className={styles}>
      <div className="flex items-center">
        {icon}
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;