import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = {
  Catering: [
    'First Anniversary',
    'Silver Jubilee',
    'Golden Jubilee',
    'Wedding Anniversary',
    'Marriage Anniversary',
  ],
  'Religious Events': [
    'Holi',
    'Ganesh Chaturthi',
    'Diwali',
    'Eid al-Fitr',
    'Christmas',
  ],
  Decorations: [
    'Birthday Decorations',
    'Anniversary Decorations',
    'Baby Shower Decorations',
    'Baby Welcome Decorations',
    'Kids Birthday Decorations',
    'Bachelorette Decorations',
  ],
};

const CategoriesNav = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="w-full bg-sky-50 shadow-md hidden md:block">
      <div className="container mx-auto">
        <nav className="relative">
          <ul className="flex justify-between px-4 ">
            {Object.entries(categories).map(([category, subCategories]) => (
              <li
                key={category}
                className="relative group"
                onMouseEnter={() => setHoveredCategory(category)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <button className="font-secondary flex items-center gap-1 px-4 py-2 text-gray-800 hover:text-purple-700 transition-colors rounded-lg hover:bg-gradient-to-br from-purple-50 to-pink-50 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  {category}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      hoveredCategory === category ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <div
                  className={`absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-purple-200 overflow-hidden transition-all duration-200 ${
                    hoveredCategory === category
                      ? 'opacity-100 visible translate-y-0 z-40'
                      : 'opacity-0 invisible translate-y-2'
                  }`}
                >
                  <div className="py-2">
                    {subCategories.map((subCategory) => (
                      <a
                        key={subCategory}
                        href="#"
                        className="font-happiness block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 transition-colors"
                      >
                        {subCategory}
                      </a>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default CategoriesNav;