import React from 'react';
import { Search, Filter, Menu, X, Sparkles } from 'lucide-react';

const SimpleSearchBar = () => {
  const [searchText, setSearchText] = React.useState('');
  const [category, setCategory] = React.useState('all');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSearch = () => {
    console.log('Searching for:', searchText, 'in category:', category);
    setIsMenuOpen(false);
  };

  if (isMobile) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-white 
        rounded-2xl shadow-lg p-4 border border-[#F0F0F0]">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-[#2D3436] hover:text-[#FF6B6B] rounded-xl
              hover:bg-[#F0F0F0] transition-all duration-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2D3436]" />
            <input
              type="text"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              placeholder="Find your perfect celebration..."
              className="w-full pl-10 p-3 rounded-xl border border-[#F0F0F0] 
                focus:outline-hidden focus:ring-2 focus:ring-[#FF6B6B]
                bg-[#F9F9F9] text-[#2D3436] placeholder-[#2D3436]/50"
            />
            <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#2D3436] hover:bg-[#F0F0F0] rounded-full transition-all duration-300"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="mt-4 space-y-4 animate-in slide-in-from-top">
            <div>
              <label className="text-sm font-medium text-[#2D3436] mb-1 flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#2D3436]" />
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#F0F0F0] 
                  focus:outline-hidden focus:ring-2 focus:ring-[#FF6B6B]
                  bg-[#F9F9F9] text-[#2D3436] appearance-none"
              >
                <option value="all">All Celebrations</option>
                <option value="events">Special Events</option>
                <option value="packages">Party Packages</option>
                <option value="materials">Event Materials</option>
              </select>
            </div>

            <button
              onClick={handleSearch}
              className="w-full bg-[#FF6B6B] 
                text-white p-3 rounded-xl hover:opacity-90 transition-opacity
                flex items-center justify-center gap-2 shadow-lg"
            >
              <Sparkles className="w-5 h-5 text-white" />
              <span>Find Events</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white 
      rounded-2xl shadow-lg p-6 mb-6 select-none border border-[#F0F0F0]">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2D3436]" />
          <input
            type="text"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="Find your perfect celebration..."
            className="w-full pl-10 p-3 rounded-xl border border-[#F0F0F0] 
              focus:outline-hidden focus:ring-2 focus:ring-[#FF6B6B]
              bg-[#F9F9F9] text-[#2D3436] placeholder-[#2D3436]/50"
          />
          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#2D3436] hover:bg-[#F0F0F0] rounded-full transition-all duration-300"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        <div className="w-56 relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2D3436]" />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full pl-10 p-3 rounded-xl border border-[#F0F0F0] 
              focus:outline-hidden focus:ring-2 focus:ring-[#FF6B6B]
              bg-[#F9F9F9] text-[#2D3436] appearance-none"
          >
            <option value="all">All Celebrations</option>
            <option value="events">Special Events</option>
            <option value="packages">Party Packages</option>
            <option value="materials">Event Materials</option>
          </select>
        </div>

        <button
          onClick={handleSearch}
          className="bg-[#FF6B6B] 
            text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity
            flex items-center gap-2 shadow-lg"
        >
          <Sparkles className="w-5 h-5 text-white" />
          <span>Find Events</span>
        </button>
      </div>
    </div>
  );
};

export default SimpleSearchBar;