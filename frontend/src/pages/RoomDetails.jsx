import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const RoomDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [bookingError, setBookingError] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isBooking, setIsBooking] = useState(false);

    // Guest contact fields
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [guestPhone, setGuestPhone] = useState('');

    useEffect(() => {
        fetchRoomDetails();
    }, [id]);

    const fetchRoomDetails = async () => {
        try {
            const response = await api.get(`/rooms/${id}`);
            setRoom(response.data);
        } catch (error) {
            console.error("Error fetching room details", error);
        } finally {
            setLoading(false);
        }
    };

    const nextImage = () => {
        if (room.photos && room.photos.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % room.photos.length);
        }
    };

    const prevImage = () => {
        if (room.photos && room.photos.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + room.photos.length) % room.photos.length);
        }
    };

    const handleBookNow = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isBooking) return; // Prevent double submission

        setBookingError(''); // Clear previous errors

        if (!user) {
            navigate('/login');
            return;
        }

        if (!checkIn || !checkOut) {
            setBookingError("Please select both check-in and check-out dates");
            return;
        }

        // Validate dates
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkInDate < today) {
            setBookingError("Check-in date cannot be in the past");
            return;
        }

        if (checkOutDate <= checkInDate) {
            setBookingError("Check-out date must be after check-in date");
            return;
        }

        setIsBooking(true);

        try {
            const bookingData = {
                roomId: room.id,
                checkInDate: checkIn,
                checkOutDate: checkOut,
                numOfAdults: 1,
                numOfChildren: 0,
                specialRequests: '',
                userId: user.id,
                // Guest contact fields
                guestName: guestName,
                guestEmail: guestEmail,
                guestPhone: guestPhone
            };

            console.log("Submitting booking:", bookingData);

            // Call booking API directly (which is now open)
            const response = await api.post('/bookings', bookingData);
            console.log("Booking response:", response.data);

            // Redirect to My Bookings on success
            alert("Booking Successful! Pay on Arrival.");
            navigate('/my-bookings');

        } catch (error) {
            console.error("Booking Error:", error);
            const msg = error.response?.data?.message || error.response?.data?.error || error.message || "Booking failed. Please try again.";
            setBookingError(`Failed: ${msg}`);
            setIsBooking(false);
        }
    };

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        const filename = url.split('/').pop();
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
        const BASE_URL = API_BASE_URL.replace('/api', '');
        return `${BASE_URL}/uploads/${filename}`;
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!room) return <div className="text-center py-20">Room not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Images Carousel */}
                <div className="relative h-96 mb-8 rounded-lg overflow-hidden shadow-xl group bg-gray-200">
                    <img
                        src={room.photos && room.photos.length > 0 ? getImageUrl(room.photos[currentImageIndex].url) : 'https://via.placeholder.com/600x400?text=No+Image'}
                        alt={room.roomType}
                        className="w-full h-full object-cover transition-all duration-500"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found'; }}
                    />

                    {room.photos && room.photos.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition backdrop-blur-sm"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition backdrop-blur-sm"
                            >
                                <ChevronRight size={24} />
                            </button>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                                {room.photos.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Details */}
                <div>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{room.roomType}</h1>
                            <p className="text-gray-500 mt-2">Max Guests: {room.maxGuests}</p>
                        </div>
                        <span className="text-2xl font-bold text-blue-600">${room.pricePerNight} <span className="text-sm font-normal text-gray-500">/ night</span></span>
                    </div>

                    <p className="mt-6 text-gray-600 leading-relaxed">{room.description}</p>

                    <div className="mt-8">
                        <h3 className="text-lg font-bold mb-3">Facilities</h3>
                        <div className="flex flex-wrap gap-2">
                            {room.facilities.map((facility, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {facility}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="mt-10 bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-bold mb-4">Book this Room</h3>
                        {bookingError && <p className="text-red-500 mb-2">{bookingError}</p>}
                        <form onSubmit={handleBookNow}>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Check In</label>
                                    <input
                                        type="date"
                                        value={checkIn}
                                        onChange={(e) => {
                                            setCheckIn(e.target.value);
                                            setBookingError(''); // Clear error when user changes date
                                        }}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="mt-1 block w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Check Out</label>
                                    <input
                                        type="date"
                                        value={checkOut}
                                        onChange={(e) => {
                                            setCheckOut(e.target.value);
                                            setBookingError(''); // Clear error when user changes date
                                        }}
                                        min={checkIn || new Date().toISOString().split('T')[0]}
                                        className="mt-1 block w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Guest Contact Fields */}
                            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="text-sm font-bold text-gray-700 mb-3">Guest Contact Details</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                                        <input
                                            type="text"
                                            value={guestName}
                                            onChange={(e) => setGuestName(e.target.value)}
                                            placeholder="Enter guest name"
                                            className="mt-1 block w-full px-3 py-2 border rounded-md"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email *</label>
                                        <input
                                            type="email"
                                            value={guestEmail}
                                            onChange={(e) => setGuestEmail(e.target.value)}
                                            placeholder="Enter guest email"
                                            className="mt-1 block w-full px-3 py-2 border rounded-md"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                                        <input
                                            type="tel"
                                            value={guestPhone}
                                            onChange={(e) => setGuestPhone(e.target.value)}
                                            placeholder="Enter phone number"
                                            className="mt-1 block w-full px-3 py-2 border rounded-md"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isBooking}
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isBooking ? 'Booking...' : (user ? 'Book Now (Pay on Arrival)' : 'Login to Book')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetails;
