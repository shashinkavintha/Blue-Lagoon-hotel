import React, { useState, useEffect } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import { Search, AlertCircle } from 'lucide-react';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        roomType: '',
        minPrice: '',
        maxPrice: '',
        maxGuests: ''
    });

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (filters.roomType) params.roomType = filters.roomType;
            if (filters.minPrice) params.minPrice = filters.minPrice;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;
            if (filters.maxGuests) params.maxGuests = filters.maxGuests;

            const response = await api.get('/rooms/search', { params });
            setRooms(response.data);
        } catch (error) {
            console.error("Error fetching rooms", error);
            setError("Failed to load rooms. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchRooms();
    };

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        const filename = url.split('/').pop();
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
        const BASE_URL = API_BASE_URL.replace('/api', '');
        return `${BASE_URL}/uploads/${filename}`;
    };

    return (
        <div className="bg-gray-100 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Available Rooms</h1>

                {/* Search Bar */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select
                                name="roomType"
                                value={filters.roomType}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full px-3 py-2 border rounded-md"
                            >
                                <option value="">All Types</option>
                                <option value="Single">Single</option>
                                <option value="Double">Double</option>
                                <option value="Deluxe">Deluxe</option>
                                <option value="Suite">Suite</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Min Price</label>
                            <input
                                type="number"
                                name="minPrice"
                                value={filters.minPrice}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full px-3 py-2 border rounded-md"
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Max Price</label>
                            <input
                                type="number"
                                name="maxPrice"
                                value={filters.maxPrice}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full px-3 py-2 border rounded-md"
                                placeholder="1000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Guests</label>
                            <input
                                type="number"
                                name="maxGuests"
                                value={filters.maxGuests}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full px-3 py-2 border rounded-md"
                                placeholder="1"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex justify-center items-center gap-2"
                            >
                                <Search size={18} /> Search
                            </button>
                        </div>
                    </form>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 flex items-center">
                        <AlertCircle className="mr-2" size={24} />
                        <p>{error}</p>
                    </div>
                )}

                {/* Rooms Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                ) : !error && rooms.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg mb-2">No rooms found matching your criteria.</p>
                        <p className="text-gray-400">Try adjusting your filters or search for something else.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {rooms.map((room) => (
                            <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                <img
                                    src={room.photos && room.photos.length > 0
                                        ? getImageUrl(room.photos[0].url)
                                        : 'https://via.placeholder.com/400x300?text=No+Image'}
                                    alt={room.roomType}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-xl font-bold text-gray-800">{room.roomType}</h3>
                                        <span className="text-blue-600 font-bold">${room.pricePerNight}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{room.description}</p>
                                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                        <span>Max Guests: {room.maxGuests}</span>
                                    </div>
                                    <Link
                                        to={`/rooms/${room.id}`}
                                        className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Rooms;
