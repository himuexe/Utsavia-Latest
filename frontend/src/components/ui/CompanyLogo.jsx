import { PartyPopper } from "lucide-react";

const CompanyLogo = ({ onClick }) => (
  <div onClick={onClick} className="cursor-pointer select-none flex items-center gap-3">
    <div className="w-12 h-12 bg-[#FF6B6B] rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg">
      <PartyPopper className="w-7 h-7 text-white transform -rotate-12" />
    </div>
    <h1 className="text-4xl font-bold text-[#2D3436] tracking-tight flex items-center">
      Utsavia
      <span className="text-xs bg-[#FFD166] text-black px-3 py-1 rounded-full ml-3 uppercase tracking-wider font-medium">
        Events
      </span>
    </h1>
  </div>
);

export default CompanyLogo;