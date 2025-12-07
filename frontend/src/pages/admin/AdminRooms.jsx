import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Plus, Edit, Trash2 } from 'lucide-react';

const AdminRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [formData, setFormData] = useState({
        roomType: 'Single',
        pricePerNight: '',
        maxGuests: '',
        description: '',
        facilities: '' // Comma separated
    });

    const [selectedFiles, setSelectedFiles] = useState([]);

    const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state

    useEffect(() => {
        fetchRooms();
    }, []);
    // ...
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return; // Prevent double submission
        setIsSubmitting(true);

        const payload = {
            ...formData,
            facilities: formData.facilities.split(',').map(f => f.trim())
        };

        try {
            let roomId;
            if (currentRoom) {
                await api.put(`/rooms/${currentRoom.id}`, payload);
                roomId = currentRoom.id;
            } else {
                const response = await api.post('/rooms', payload);
                roomId = response.data.id;
            }

            if (selectedFiles && selectedFiles.length > 0) {
                for (let i = 0; i < selectedFiles.length; i++) {
                    const form = new FormData();
                    form.append('file', selectedFiles[i]);
                    await api.post(`/rooms/${roomId}/photo`, form, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }
            }

            setIsModalOpen(false);
            setCurrentRoom(null);
            setSelectedFiles([]);
            setFormData({
                roomType: 'Single',
                pricePerNight: '',
                maxGuests: '',
                description: '',
                facilities: ''
            });
            fetchRooms();
        } catch (error) {
            console.error("Error saving room", error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to save room";
            alert(`Error: ${errorMessage}`);
        } finally {
            setIsSubmitting(false); // Re-enable button
        }
    };
    // ...

    const fetchRooms = async () => {
        try {
            const response = await api.get('/rooms/search');
            setRooms(response.data);
        } catch (error) {
            console.error("Error fetching rooms", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    const handleEdit = (room) => {
        setCurrentRoom(room);
        setFormData({
            roomType: room.roomType,
            pricePerNight: room.pricePerNight,
            maxGuests: room.maxGuests,
            description: room.description,
            facilities: room.facilities.join(', ')
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this room?")) return;
        try {
            await api.delete(`/rooms/${id}`);
            fetchRooms();
        } catch (error) {
            console.error("Error deleting room", error);
            alert("Failed to delete room");
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

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Room Management</h1>
                <button
                    onClick={() => { setCurrentRoom(null); setIsModalOpen(true); }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
                >
                    <Plus size={20} />
                    <span>Add Room</span>
                </button>
            </div>

            {loading ? <div>Loading...</div> : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {rooms.map(room => (
                                <tr key={room.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img
                                            src={room.photos && room.photos.length > 0
                                                ? getImageUrl(room.photos[0].url)
                                                : 'https://via.placeholder.com/50'}
                                            alt="Room"
                                            className="h-10 w-10 rounded-full object-cover"
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/50?text=NA'; }}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{room.roomType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">${room.pricePerNight}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{room.maxGuests}</td>
                                    <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                                        <button onClick={() => handleEdit(room)} className="text-blue-600 hover:text-blue-900"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(room.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">{currentRoom ? 'Edit Room' : 'Add New Room'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <select name="roomType" value={formData.roomType} onChange={handleInputChange} className="mt-1 block w-full border rounded-md p-2">
                                    <option value="Single">Single</option>
                                    <option value="Double">Double</option>
                                    <option value="Deluxe">Deluxe</option>
                                    <option value="Suite">Suite</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Price Per Night</label>
                                <input type="number" name="pricePerNight" value={formData.pricePerNight} onChange={handleInputChange} className="mt-1 block w-full border rounded-md p-2" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Max Guests</label>
                                <input type="number" name="maxGuests" value={formData.maxGuests} onChange={handleInputChange} className="mt-1 block w-full border rounded-md p-2" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} className="mt-1 block w-full border rounded-md p-2" rows="3" required></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Facilities (comma separated)</label>
                                <input type="text" name="facilities" value={formData.facilities} onChange={handleInputChange} className="mt-1 block w-full border rounded-md p-2" placeholder="WiFi, AC, TV" />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700">Room Photos</label>
                                <input type="file" multiple onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                <p className="text-xs text-gray-500 mt-1">You can select multiple files.</p>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-md hover:bg-gray-100" disabled={isSubmitting}>Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRooms;
