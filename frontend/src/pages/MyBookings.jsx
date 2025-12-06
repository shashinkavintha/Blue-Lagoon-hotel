import React, { useState, useEffect } from 'react';
import api from '../api';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
        const query = new URLSearchParams(window.location.search);
        if (query.get("success")) {
            alert("Payment Successful! Booking Confirmed.");
        }
        if (query.get("canceled")) {
            alert("Payment Canceled.");
        }
    }, []);

    const fetchBookings = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                console.warn("No user ID found in storage");
                return;
            }
            // Use the "Escape Hatch" public endpoint
            const response = await api.get(`/bookings/user/${userId}`);
            setBookings(response.data);
        } catch (error) {
            console.error("Error fetching bookings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        try {
            await api.post(`/bookings/${id}/cancel`);
            fetchBookings(); // Refresh
        } catch (error) {
            console.error("Cancellation failed", error);
            alert("Failed to cancel booking");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bookings</h1>
            {loading ? (
                <div>Loading...</div>
            ) : bookings.length === 0 ? (
                <div className="text-gray-500">You have no bookings yet.</div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.bookingCode}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.room?.roomType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.checkInDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.checkOutDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${booking.totalPrice}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                                booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {booking.status !== 'CANCELLED' && booking.status !== 'CHECKED_OUT' && (
                                            <button
                                                onClick={() => handleCancel(booking.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
