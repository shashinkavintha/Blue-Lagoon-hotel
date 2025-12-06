import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="fixed w-full z-50 transition-all duration-300 backdrop-blur-md bg-white/70 border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            Blue Lagoon
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</Link>
                        <Link to="/rooms" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Rooms</Link>
                        <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</Link>
                        <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</Link>

                        <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                            {token ? (
                                <>
                                    {role === 'ADMIN' && (
                                        <Link to="/admin" className="text-gray-700 hover:text-blue-600 font-medium">Admin</Link>
                                    )}
                                    <Link to="/my-bookings" className="text-gray-700 hover:text-blue-600 font-medium">My Bookings</Link>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-500/90 hover:bg-red-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-red-500/30"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-blue-600/30"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
