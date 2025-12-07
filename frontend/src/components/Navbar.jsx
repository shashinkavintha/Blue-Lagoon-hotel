import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        navigate('/login');
        setIsOpen(false);
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    const NavLinks = ({ mobile = false }) => (
        <>
            <Link to="/" className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${mobile ? 'block py-2' : ''}`} onClick={() => mobile && setIsOpen(false)}>Home</Link>
            <Link to="/rooms" className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${mobile ? 'block py-2' : ''}`} onClick={() => mobile && setIsOpen(false)}>Rooms</Link>
            <Link to="/about" className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${mobile ? 'block py-2' : ''}`} onClick={() => mobile && setIsOpen(false)}>About</Link>
            <Link to="/contact" className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${mobile ? 'block py-2' : ''}`} onClick={() => mobile && setIsOpen(false)}>Contact</Link>

            {token ? (
                <>
                    {role === 'ADMIN' && (
                        <Link to="/admin" className={`text-gray-700 hover:text-blue-600 font-medium ${mobile ? 'block py-2' : ''}`} onClick={() => mobile && setIsOpen(false)}>Admin</Link>
                    )}
                    <Link to="/my-bookings" className={`text-gray-700 hover:text-blue-600 font-medium ${mobile ? 'block py-2' : ''}`} onClick={() => mobile && setIsOpen(false)}>My Bookings</Link>
                    <button
                        onClick={handleLogout}
                        className={`bg-red-500/90 hover:bg-red-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-red-500/30 ${mobile ? 'w-full mt-4' : ''}`}
                    >
                        Logout
                    </button>
                </>
            ) : (
                <Link
                    to="/login"
                    className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-blue-600/30 inline-block ${mobile ? 'w-full text-center mt-4' : ''}`}
                    onClick={() => mobile && setIsOpen(false)}
                >
                    Login
                </Link>
            )}
        </>
    );

    return (
        <nav className="fixed w-full z-50 transition-all duration-300 backdrop-blur-md bg-white/70 border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            Blue Lagoon
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLinks />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="text-gray-700 hover:text-blue-600 focus:outline-none">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden absolute w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xl">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <NavLinks mobile={true} />
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
