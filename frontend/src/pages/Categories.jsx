import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as apiClient from '../api/ItemApi';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  
  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getSubCategories();
        setCategories(data);
        setFilteredCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter categories based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchTerm, categories]);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <Link to="/" className="flex items-center text-primary hover:text-secondary mb-4">
            <IoMdArrowRoundBack className="mr-1" /> Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-happiness text-primary mb-2">
            Decoration Themes
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Browse our beautiful decoration themes for every occasion. Find the perfect decorations for your event.
          </p>
        </div>
      </div>
      
      {/* Search Box */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-8 border border-gray-100">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search themes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <FaSearch className="absolute left-3 top-4 text-gray-400" />
          {searchTerm && (
            <button 
              onClick={handleClearSearch}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>
      
      {/* Categories Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading themes...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          {error}
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-2xl font-semibold mb-2">No themes found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search</p>
          <button 
            onClick={handleClearSearch}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <>
          {/* Results Count */}
          {searchTerm && (
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredCategories.length} {filteredCategories.length === 1 ? 'theme' : 'themes'}
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>
          )}
          
          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <Link
                key={category._id}
                to={`/themes/${category._id}`}
                className="group"
              >
                <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                  <div className="relative overflow-hidden">
                    <div className="aspect-[4/3]">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    {category.isPopular && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-marigold/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                          Popular
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-lg mb-1 text-gray-800 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
                      {category.priceRange && (
                        <span className="text-sm text-gray-600">
                          {category.priceRange}
                        </span>
                      )}
                      <span className="text-secondary group-hover:text-primary transition-colors font-semibold text-sm">
                        View Items →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoriesPage;