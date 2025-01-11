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
    <div className="w-full bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-slate-700 font-primary">
          Popular Categories
        </h2>
        
        <div className="grid grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.name}
                className="flex flex-col items-center group cursor-pointer transition-transform transform hover:scale-105"
              >
                <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center 
                  group-hover:shadow-lg transition-all duration-300 border border-purple-200
                  group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-pink-500">
                  <IconComponent 
                    className="w-8 h-8 text-purple-500 group-hover:text-white transition-colors" 
                  />
                </div>
                <span className="font-happiness mt-2 text-sm md:text-base text-gray-700 text-center group-hover:text-purple-600 transition-colors">
                  {category.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;