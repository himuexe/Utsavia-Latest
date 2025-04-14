import { X } from "lucide-react";
const SidePanel = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
  
    return (
      <>
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40"
          onClick={onClose}
        />
        <div className="fixed top-0 right-0 w-80 h-full bg-background z-50 shadow-2xl p-8 flex flex-col border-l border-primary">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-secondary text-secondary">{title}</h2>
            <button
              onClick={onClose}
              className="text-primary transition-colors group"
            >
              <X className="h-6 w-6 text-icon group group-hover:text-hover1" />
            </button>
          </div>
          <div className="space-y-4 text-[#2D3436]">{children}</div>
        </div>
      </>
    );
  };

  export default SidePanel