import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { selectIsLoggedIn } from '../store/appSlice';
import * as apiClient from '../api/BookingApi';
import Loading from '../components/ui/Loading';
import BookingCard from '../components/booking/BookingCard';
import BookingDetailsModal from '../components/booking/BookingDetailsModal';

const MyBookingsPage = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const queryClient = useQueryClient();

  // Fetch user bookings
  const {
    data: bookings,
    isLoading,
    isError,
    error,
  } = useQuery('userBookings', apiClient.getUserBookings, {
    enabled: isLoggedIn,
    retry: 2,
  });

  // Mutation to update booking status
  const updateStatusMutation = useMutation(
    ({ bookingId, status }) => apiClient.updateBookingStatus(bookingId, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userBookings'); // Refresh bookings after update
      },
    }
  );

  const handleViewDetails = async (bookingId) => {
    try {
      const booking = await apiClient.getBookingById(bookingId);
      setSelectedBooking(booking);
    } catch (error) {
      console.error('Error fetching booking details:', error);
    }
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await updateStatusMutation.mutateAsync({ bookingId, status });
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  if (isLoading) return <Loading />;
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
        <div className="text-center text-red-500">
          Error fetching bookings: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-black to-zinc-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <h1 className="text-4xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          My Bookings
        </h1>

        {bookings?.length === 0 ? (
          <div className="text-center text-white">
            <p>No bookings found.</p>
            <p>Start by booking a product or service!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings?.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onViewDetails={() => handleViewDetails(booking._id)}
                onUpdateStatus={(status) => handleUpdateStatus(booking._id, status)}
              />
            ))}
          </div>
        )}

        {selectedBooking && (
          <BookingDetailsModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
            onUpdateStatus={(status) => handleUpdateStatus(selectedBooking._id, status)}
          />
        )}
      </motion.div>
    </div>
  );
};

export default MyBookingsPage;