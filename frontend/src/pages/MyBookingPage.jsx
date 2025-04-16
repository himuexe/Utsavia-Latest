import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { showToast } from "../store/appSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { selectIsLoggedIn } from "../store/appSlice";
import * as apiClient from "../api/BookingApi";
import Loading from "../components/ui/Loading";
import BookingCard from "../components/booking/BookingCard";
import BookingDetailsModal from "../components/booking/BookingDetailsModal";
import NotFoundPage from "./404";
import { IoMdArrowRoundBack } from "react-icons/io";

const MyBookingsPage = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeTab, setActiveTab] = useState("active");
  const queryClient = useQueryClient();

  // Fetch user bookings
  const {
    data: bookings,
    isLoading,
    isError,
  } = useQuery("userBookings", apiClient.getUserBookings, {
    enabled: isLoggedIn,
    retry: 2,
  });

  // Mutation to update booking status
  const updateStatusMutation = useMutation(
    ({ bookingId, status }) => apiClient.updateBookingStatus(bookingId, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("userBookings");
      },
    }
  );

  const handleViewDetails = async (bookingId) => {
    try {
      const booking = await apiClient.getBookingById(bookingId);
      setSelectedBooking(booking);
    } catch (error) {
      dispatch(
        showToast({ message: "Failed to fetch booking details", type: "ERROR" })
      );
    }
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await updateStatusMutation.mutateAsync({ bookingId, status });
    } catch (error) {
      dispatch(
        showToast({ message: "Failed to update booking status", type: "ERROR" })
      );
    }
  };

  if (isLoading) return <Loading />;
  if (isError) {
    return <NotFoundPage />;
  }

  // Separate bookings into active and completed/cancelled
  const activeBookings = bookings?.filter(
    (booking) =>
      booking.status !== "completed" && booking.status !== "cancelled"
  );

  const completedBookings = bookings?.filter(
    (booking) =>
      booking.status === "completed" || booking.status === "cancelled"
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-gray-50 min-h-screen ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          onClick={() => window.history.back()}
          className="flex items-center text-primary hover:text-secondary mb-4 cursor-pointer"
        >
          <IoMdArrowRoundBack className="mr-1" /> Back
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl text-primary font-secondary mb-2">
                My Bookings
              </h1>
              <p className="text-gray-500">
                View and manage all your bookings in one place
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-1 inline-flex">
              <button
                onClick={() => setActiveTab("active")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "active"
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-500 hover:text-primary"
                }`}
              >
                Active Bookings
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "history"
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-500 hover:text-primary"
                }`}
              >
                Booking History
              </button>
            </div>
          </div>

          {/* Active Bookings Section */}
          {activeTab === "active" && (
            <motion.section
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-primary">
                  Active Bookings
                </h2>
                <p className="text-sm text-gray-500 bg-white py-1 px-3 rounded-full shadow-sm">
                  {activeBookings?.length}{" "}
                  {activeBookings?.length === 1 ? "booking" : "bookings"}
                </p>
              </div>

              {activeBookings?.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-2xl shadow-md p-12 text-center"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    No active bookings
                  </h3>
                  <p className="text-gray-500 mb-6">
                    You don't have any active bookings at the moment
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeBookings?.map((booking) => (
                    <motion.div key={booking._id} variants={itemVariants}>
                      <BookingCard
                        booking={booking}
                        onViewDetails={() => handleViewDetails(booking._id)}
                        onUpdateStatus={(status) =>
                          handleUpdateStatus(booking._id, status)
                        }
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.section>
          )}

          {/* Completed/Cancelled Bookings Section */}
          {activeTab === "history" && (
            <motion.section
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-primary">
                  Booking History
                </h2>
                <p className="text-sm text-gray-500 bg-white py-1 px-3 rounded-full shadow-sm">
                  {completedBookings?.length}{" "}
                  {completedBookings?.length === 1 ? "booking" : "bookings"}
                </p>
              </div>

              {completedBookings?.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-2xl shadow-md p-12 text-center"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    No booking history
                  </h3>
                  <p className="text-gray-500">
                    Your completed and cancelled bookings will appear here
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedBookings?.map((booking) => (
                    <motion.div key={booking._id} variants={itemVariants}>
                      <BookingCard
                        booking={booking}
                        onViewDetails={() => handleViewDetails(booking._id)}
                        onUpdateStatus={(status) =>
                          handleUpdateStatus(booking._id, status)
                        }
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.section>
          )}
        </motion.div>
      </div>

      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdateStatus={(status) =>
            handleUpdateStatus(selectedBooking._id, status)
          }
        />
      )}
    </div>
  );
};

export default MyBookingsPage;
