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
    <div className="w-full bg-black py-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
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
                <div className="relative overflow-hidden rounded-lg md:rounded-2xl bg-zinc-900 
                  transition-all duration-300 hover:scale-105 border border-zinc-800 
                  hover:border-zinc-700 hover:shadow-lg hover:shadow-white/10 flex flex-col items-center justify-center py-6">
                  <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center 
                    mb-4 group-hover:bg-white transition-all duration-300">
                    <IconComponent 
                      className="w-8 h-8 text-white group-hover:text-black transition-colors" 
                    />
                  </div>
                  <span className="text-white text-sm md:text-base text-center 
                    group-hover:text-zinc-300 transition-colors">
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