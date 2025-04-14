const CompanyLogo = ({ onClick }) => (
  <div onClick={onClick} className="cursor-pointer select-none flex items-center gap-3">
    <h1 className="text-4xl text-[#2D3436] tracking-tight font-happiness flex items-center">
      Utsavia
    </h1>
  </div>
);

export default CompanyLogo;