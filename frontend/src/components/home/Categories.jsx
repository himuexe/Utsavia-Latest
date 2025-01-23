import React from 'react';
import { Cake, Home, Gift, Boxes, Church, Users, PartyPopper, Building } from 'lucide-react';

const categories = [
  { name: 'Decorations', icon: PartyPopper },
  { name: 'Pooja', icon: Church },
  { name: 'Birthday Parties', icon: Cake },
  { name: 'Baby Shower', icon: Gift },
  { name: 'Wedding Anniversaries', icon: Boxes },
  { name: 'Society Events', icon: Building },
  { name: 'Festive Celebrations', icon: Users },
  { name: 'House Warming', icon: Home },
];

const Categories = () => {
  return (
    <div className="w-full bg-white py-12 border-t border-[#F0F0F0]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#2D3436]">
          Popular Categories
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.name}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg md:rounded-2xl bg-[#F9F9F9] 
                  transition-all duration-300 hover:scale-105 border border-[#F0F0F0] 
                  hover:border-[#FF6B6B] hover:shadow-lg hover:shadow-[#FF6B6B]/10 flex flex-col items-center justify-center py-6">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center 
                    mb-4 group-hover:bg-[#FF6B6B] transition-all duration-300">
                    <IconComponent 
                      className="w-8 h-8 text-[#2D3436] group-hover:text-white transition-colors" 
                    />
                  </div>
                  <span className="text-[#2D3436] text-sm md:text-base text-center 
                    group-hover:text-[#FF6B6B] transition-colors">
                    {category.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;