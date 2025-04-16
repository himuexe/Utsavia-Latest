import React from "react";
import { useQuery } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import * as apiClient from "../api/ItemApi";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "../components/theme/Card";
import { MapPin } from "lucide-react";
import ThemeSkeleton from "../components/theme/ThemeSkeleton";
import { IoMdArrowRoundBack } from "react-icons/io";
const ThemesPage = ({ selectedCity }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: { items } = { items: [] },
    isLoading,
    isError,
  } = useQuery(
    ["items", id, selectedCity],
    () => apiClient.getItems(id, selectedCity),
    {
      retry: 2,
      staleTime: 300000,
    }
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-50min-h-screen">
        <h1 className="text-3xl  text-primary font-primary mb-8">
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
      <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
        <h1 className="text-3xl font-bold text-[#FF6B6B] mb-8">
          No Themes Found
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
      <div
        onClick={() => window.history.back()}
        className="flex items-center text-primary hover:text-secondary mb-4 cursor-pointer"
      >
        <IoMdArrowRoundBack className="mr-1" /> Back
      </div>
      <h1 className="text-3xl  text-primary font-happiness mb-8">All Themes</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.length > 0 ? (
          items.map((theme) => (
            <Card
              key={theme._id}
              className="bg-[#F9F9F9] border border-[#F0F0F0] h-auto"
            >
              <CardHeader>
                <div className="aspect-4/3 relative overflow-hidden rounded-lg">
                  <img
                    src={theme.image}
                    alt={theme.name}
                    className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
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
                  <h3 className="text-xl font-secondary text-primary line-clamp-2">
                    {theme.name}
                  </h3>
                  <p className="text-primary text-sm line-clamp-2">
                    {theme.description ||
                      "Transform your special moments into unforgettable memories."}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl font-semibold text-icon">
                    ₹{theme.prices[0]?.price.toLocaleString() || "N/A"}
                  </span>
                  <button
                    onClick={() => navigate(`/info/${theme._id}`)}
                    className="px-4 py-2 bg-secondary/70 text-white
                    rounded-xl hover:bg-primary  shadow-lg
                    transition-all duration-300 font-medium cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-[#2D3436]/80">No themes available.</p>
        )}
      </div>
    </div>
  );
};

export default ThemesPage;
