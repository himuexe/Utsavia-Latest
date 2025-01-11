import React from "react";
import { useQuery } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import * as apiClient from "../api/ItemApi";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/Card";
import { MapPin } from "lucide-react";

const ThemeSkeleton = () => (
  <Card hover={false} className="h-[28rem]">
    <CardHeader>
      <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
        <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
      </div>
    </CardContent>
    <CardFooter>
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4" />
        <div className="h-10 bg-gray-200 rounded animate-pulse w-1/3" />
      </div>
    </CardFooter>
  </Card>
);

const ThemesPage = ({ currentLocation }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: { items } = { items: [] }, 
    isLoading,
    isError,
  } = useQuery(
    ["items", id, currentLocation],
    () => apiClient.getItems(id, currentLocation),
    {
      retry: 2,
      staleTime: 300000,
    }
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold bg-clip-text text-slate-700 font-primary mb-8">
          Loading Themes...
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <ThemeSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-red-600 mb-8 font-primary">
          Error: No Themes Found
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold bg-clip-text text-slate-700 font-primary mb-8">
        All Themes
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.length > 0 ? (
          items.map((theme) => (
            <Card key={theme._id} className="h-auto">
              <CardHeader>
                <div className="aspect-[4/3] relative overflow-hidden rounded-lg shadow-md">
                  <img
                    src={theme.image}
                    alt={theme.name}
                    className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        At your location
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 font-happiness">
                    {theme.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 font-secondary">
                    {theme.description ||
                      "Transform your special moments into unforgettable memories."}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl font-bold bg-clip-text text-slate-700 font-happiness">
                    ₹{theme.prices[0]?.price.toLocaleString() || "N/A"}
                  </span>
                  <button
                    onClick={() => navigate(`/info/${theme._id}`)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 
              text-white rounded-xl hover:shadow-lg hover:shadow-purple-200
              transition-all duration-300 font-medium font-happiness"
                  >
                    View Details
                  </button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p>No themes available.</p>
        )}
      </div>
    </div>
  );
};

export default ThemesPage;