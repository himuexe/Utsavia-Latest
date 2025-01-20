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
    <div className="w-full bg-gradient-to-br from-purple-50 to-pink-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          Make Every Occasion Extra Special
        </h2>

        {error && <div className="text-red-500 text-center mb-4">Failed to fetch categories</div>}

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/themes/${category._id}`}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg md:rounded-2xl bg-white shadow-lg 
                transition-transform duration-300 hover:shadow-xl border border-purple-200">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 
                      group-hover:scale-105"
                  />
                </div>
              </div>
              <div className="p-2 md:p-4">
                <h3 className="text-purple-600 text-sm md:text-lg font-semibold text-center">
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