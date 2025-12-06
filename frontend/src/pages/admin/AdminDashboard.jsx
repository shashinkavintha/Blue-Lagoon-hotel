import React, { useEffect, useState } from 'react';
import api from '../../api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalBookings: 0,
        totalRooms: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-6">Loading dashboard stats...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-bold uppercase">Total Bookings</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalBookings}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-bold uppercase">Total Rooms</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalRooms}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-bold uppercase">Revenue</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">${stats.totalRevenue ? stats.totalRevenue.toLocaleString() : '0'}</p>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-gray-500">No recent activity.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
