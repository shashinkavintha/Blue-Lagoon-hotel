import React from 'react';
import { Link } from 'react-router-dom';
import bgImage from '../assets/bg.png'; // Make sure this path corresponds to where I copied the image

import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="font-sans antialiased overflow-x-hidden">
            {/* Hero Section */}
            <div className="relative h-screen flex items-center justify-center">
                {/* Background Image with Parallax-like Feel */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
                    style={{ backgroundImage: `url(${bgImage})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl">
                            Blue Lagoon
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto font-light tracking-wide">
                            Experience the epitome of luxury where the endless ocean meets timeless elegance.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link to="/rooms" className="group bg-white text-gray-900 font-semibold py-4 px-10 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.7)]">
                            Book Your Stay
                        </Link>
                        <Link to="/contact" className="group bg-transparent border border-white/40 backdrop-blur-sm text-white font-semibold py-4 px-10 rounded-full transition-all duration-300 hover:bg-white/10 hover:border-white hover:scale-105">
                            Contact Us
                        </Link>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
                >
                    <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </motion.div>
            </div>

            {/* Highlights Section */}
            <div className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">Discover Paradise</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">Why Choose Us?</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { icon: "🌊", title: "Ocean View Rooms", desc: "Wake up to the symphony of waves with exclusive panoramic views of the turquoise lagoon." },
                            { icon: "🍽️", title: "Exquisite Dining", desc: "Savor a culinary journey curating local flavors and international masterpieces." },
                            { icon: "✨", title: "Luxury Spa", desc: "Rejuvenate your senses with holistic treatments designed for pure relaxation." }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-gray-50 border border-gray-100 p-8 rounded-2xl hover:shadow-xl transition-shadow duration-300 group"
                            >
                                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-gray-900">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed font-light">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
