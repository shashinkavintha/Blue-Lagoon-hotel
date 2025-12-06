import React, { useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, BedDouble, CalendarCheck, LogOut } from 'lucide-react';

const AdminLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    if (!user || user.role !== 'ADMIN') {
        // In a real app, you might want to redirect or show a "Not Authorized" page.
        // For now, we'll redirect to login.
        // Note: Better to handle this in a route guard component.
        navigate('/login');
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? 'bg-gray-700' : '';
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold border-b border-gray-700">
                    Admin Panel
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin" className={`flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition ${isActive('/admin')}`}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/admin/rooms" className={`flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition ${isActive('/admin/rooms')}`}>
                        <BedDouble size={20} />
                        <span>Rooms</span>
                    </Link>
                    <Link to="/admin/bookings" className={`flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition ${isActive('/admin/bookings')}`}>
                        <CalendarCheck size={20} />
                        <span>Bookings</span>
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 text-red-400 hover:text-red-300 w-full px-4 py-3"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
