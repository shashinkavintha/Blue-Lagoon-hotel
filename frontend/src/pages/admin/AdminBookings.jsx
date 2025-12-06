import React, { useState, useEffect } from 'react';
import api from '../../api';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await api.get('/bookings');
            setBookings(response.data);
        } catch (error) {
            console.error("Error fetching bookings", error);
        } finally {
            setLoading(false);
        }
    };

    // Note: To implement status updates, we'd need an endpoint in BookingController like PUT /bookings/{id}/status
    // Just placeholder for now as the backend summary only mentioned cancel.
    const handleStatusUpdate = async (id, status) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        try {
            await api.post(`/bookings/${id}/cancel`);
            alert("Booking cancelled successfully");
            fetchBookings(); // Refresh the list
        } catch (error) {
            console.error("Cancellation failed", error);
            alert("Failed to cancel booking: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Booking Management</h1>
            {loading ? <div>Loading...</div> : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.map(booking => (
                                <tr key={booking.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.bookingCode}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.user?.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.room?.roomType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.checkInDate} to {booking.checkOutDate}</td>
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
                                                onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                                                className="text-red-600 hover:text-red-900 font-bold"
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

export default AdminBookings;
