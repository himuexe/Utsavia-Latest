import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as apiClient from "../../api/ItemApi"; 

const CategoryCards = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiClient.getSubCategories(); 
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError(error.message); 
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-full bg-white py-12 border-t border-[#F0F0F0]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#2D3436]">
          Make Every Occasion Extra Special
        </h2>

        {error && (
          <div className="text-[#FF6B6B] text-center mb-4 bg-[#FF6B6B]/10 py-2 rounded-lg">
            Failed to fetch categories
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/themes/${category._id}`}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg md:rounded-2xl bg-[#F9F9F9] 
                transition-all duration-300 hover:scale-105 border border-[#F0F0F0] 
                hover:border-[#FF6B6B] hover:shadow-lg hover:shadow-[#FF6B6B]/10">
                <div className="aspect-4/3 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 
                      group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                </div>
              </div>
              <div className="p-2 md:p-4">
                <h3 className="text-[#2D3436] text-sm md:text-lg font-semibold text-center 
                  group-hover:text-[#FF6B6B] transition-colors">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryCards;