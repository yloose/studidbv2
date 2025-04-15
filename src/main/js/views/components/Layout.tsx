// File: src/main/js/views/components/Layout.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/AuthProvider';
import { TrendingUp, Users, Award, User, LogOut, Menu, X } from 'lucide-react';

// Neumorphic components
export const NeuCard = ({ children, className = '' }) => (
    <div className={`bg-gray-100 rounded-xl p-6 shadow-[8px_8px_16px_#d1d1d1,_-8px_-8px_16px_#ffffff] ${className}`}>
        {children}
    </div>
);

export const NeuButton = ({ children, active, onClick, className = '' }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 p-4 rounded-xl transition-all duration-300 
      ${active
            ? 'bg-blue-50 text-blue-600 shadow-[inset_4px_4px_8px_#d1d1d1,_inset_-4px_-4px_8px_#ffffff]'
            : 'bg-gray-100 shadow-[5px_5px_10px_#d1d1d1,_-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#d1d1d1,_-2px_-2px_5px_#ffffff]'}
      ${className}`
        }
    >
        {children}
    </button>
);

// Global layout state - ensures consistent sidebar state across all components
let globalIsHovered = false;

// Layout component
export const Layout = ({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    // Use the global hover state to prevent resetting on route changes
    const [isHovered, setIsHovered] = useState(globalIsHovered);
    const location = useLocation();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const getActiveSection = () => {
        const path = location.pathname;
        if (path === '/') return 'dashboard';
        if (path === '/grades') return 'grades';
        if (path === '/attendance') return 'attendance';
        if (path === '/profile') return 'profile';
        return '';
    };

    const activeSection = getActiveSection();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Handle hover effect
    const handleMouseEnter = () => {
        setIsHovered(true);
        globalIsHovered = true;
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        globalIsHovered = false;
    };

    // Force update the hover state when location changes
    useEffect(() => {
        setIsHovered(globalIsHovered);
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar - Desktop */}
            <aside
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`hidden md:flex flex-col fixed h-full bg-white shadow-xl z-20 transition-all duration-300 ${
                    isHovered ? 'w-64 p-6' : 'w-16 py-6 px-2'
                }`}
            >
                <div className={`mb-10 ${isHovered ? '' : 'flex justify-center'}`}>
                    {isHovered ? (
                        <>
                            <h1 className="text-2xl font-bold text-blue-600">UniStats</h1>
                            <p className="text-gray-500 text-sm">Student Portal</p>
                        </>
                    ) : (
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                            U
                        </div>
                    )}
                </div>

                <nav className="flex-1 space-y-4">
                    <Link to="/" className={`flex items-center ${isHovered ? 'gap-2' : 'justify-center'} p-4 rounded-xl transition-all duration-300 
            ${activeSection === 'dashboard'
                        ? 'bg-blue-50 text-blue-600 shadow-[inset_4px_4px_8px_#d1d1d1,_inset_-4px_-4px_8px_#ffffff]'
                        : 'bg-gray-100 shadow-[5px_5px_10px_#d1d1d1,_-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#d1d1d1,_-2px_-2px_5px_#ffffff]'}`
                    }>
                        <TrendingUp size={isHovered ? 20 : 24} />
                        {isHovered && <span>Dashboard</span>}
                    </Link>
                    <Link to="/grades" className={`flex items-center ${isHovered ? 'gap-2' : 'justify-center'} p-4 rounded-xl transition-all duration-300 
            ${activeSection === 'grades'
                        ? 'bg-blue-50 text-blue-600 shadow-[inset_4px_4px_8px_#d1d1d1,_inset_-4px_-4px_8px_#ffffff]'
                        : 'bg-gray-100 shadow-[5px_5px_10px_#d1d1d1,_-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#d1d1d1,_-2px_-2px_5px_#ffffff]'}`
                    }>
                        <Award size={isHovered ? 20 : 24} />
                        {isHovered && <span>Grades</span>}
                    </Link>
                    <Link to="/attendance" className={`flex items-center ${isHovered ? 'gap-2' : 'justify-center'} p-4 rounded-xl transition-all duration-300 
            ${activeSection === 'attendance'
                        ? 'bg-blue-50 text-blue-600 shadow-[inset_4px_4px_8px_#d1d1d1,_inset_-4px_-4px_8px_#ffffff]'
                        : 'bg-gray-100 shadow-[5px_5px_10px_#d1d1d1,_-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#d1d1d1,_-2px_-2px_5px_#ffffff]'}`
                    }>
                        <Users size={isHovered ? 20 : 24} />
                        {isHovered && <span>Attendance</span>}
                    </Link>
                    <Link to="/profile" className={`flex items-center ${isHovered ? 'gap-2' : 'justify-center'} p-4 rounded-xl transition-all duration-300 
            ${activeSection === 'profile'
                        ? 'bg-blue-50 text-blue-600 shadow-[inset_4px_4px_8px_#d1d1d1,_inset_-4px_-4px_8px_#ffffff]'
                        : 'bg-gray-100 shadow-[5px_5px_10px_#d1d1d1,_-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#d1d1d1,_-2px_-2px_5px_#ffffff]'}`
                    }>
                        <User size={isHovered ? 20 : 24} />
                        {isHovered && <span>Profile</span>}
                    </Link>
                </nav>

                <div className="mt-auto pt-6">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center ${isHovered ? 'gap-2' : 'justify-center'} p-4 rounded-xl transition-all duration-300 w-full text-red-500 bg-gray-100 shadow-[5px_5px_10px_#d1d1d1,_-5px_-5px_10px_#ffffff]`}
                    >
                        <LogOut size={isHovered ? 20 : 24} />
                        {isHovered && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile menu button */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-20 p-4 shadow-md flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-600">UniStats</h1>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 rounded-lg bg-gray-100 shadow-[3px_3px_6px_#d1d1d1,_-3px_-3px_6px_#ffffff]"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile sidebar testttt */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden">
                    <div className="bg-white w-64 h-full p-6 shadow-xl">
                        <div className="mb-10">
                            <h1 className="text-2xl font-bold text-blue-600">StudiDB V2</h1>
                            <p className="text-gray-500 text-sm">Studierendendatenbank</p>
                        </div>

                        <nav className="flex-1 space-y-4">
                            <Link
                                to="/"
                                className={`flex items-center gap-2 p-4 rounded-xl transition-all duration-300 
                  ${activeSection === 'dashboard'
                                    ? 'bg-blue-50 text-blue-600 shadow-[inset_4px_4px_8px_#d1d1d1,_inset_-4px_-4px_8px_#ffffff]'
                                    : 'bg-gray-100 shadow-[5px_5px_10px_#d1d1d1,_-5px_-5px_10px_#ffffff]'}`
                                }
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <TrendingUp size={20} />
                                <span>Dashboard</span>
                            </Link>
                            <Link
                                to="/grades"
                                className={`flex items-center gap-2 p-4 rounded-xl transition-all duration-300 
                  ${activeSection === 'grades'
                                    ? 'bg-blue-50 text-blue-600 shadow-[inset_4px_4px_8px_#d1d1d1,_inset_-4px_-4px_8px_#ffffff]'
                                    : 'bg-gray-100 shadow-[5px_5px_10px_#d1d1d1,_-5px_-5px_10px_#ffffff]'}`
                                }
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Award size={20} />
                                <span>Notenübersicht</span>
                            </Link>
                            <Link
                                to="/attendance"
                                className={`flex items-center gap-2 p-4 rounded-xl transition-all duration-300 
                  ${activeSection === 'attendance'
                                    ? 'bg-blue-50 text-blue-600 shadow-[inset_4px_4px_8px_#d1d1d1,_inset_-4px_-4px_8px_#ffffff]'
                                    : 'bg-gray-100 shadow-[5px_5px_10px_#d1d1d1,_-5px_-5px_10px_#ffffff]'}`
                                }
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Users size={20} />
                                <span>Belegte Module</span>
                            </Link>
                            <Link
                                to="/profile"
                                className={`flex items-center gap-2 p-4 rounded-xl transition-all duration-300 
                  ${activeSection === 'profile'
                                    ? 'bg-blue-50 text-blue-600 shadow-[inset_4px_4px_8px_#d1d1d1,_inset_-4px_-4px_8px_#ffffff]'
                                    : 'bg-gray-100 shadow-[5px_5px_10px_#d1d1d1,_-5px_-5px_10px_#ffffff]'}`
                                }
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <User size={20} />
                                <span>Profil</span>
                            </Link>
                        </nav>

                        <div className="mt-auto pt-6">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 p-4 rounded-xl transition-all duration-300 w-full justify-center text-red-500 bg-gray-100 shadow-[5px_5px_10px_#d1d1d1,_-5px_-5px_10px_#ffffff]"
                            >
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main content */}
            <main className={`flex-1 p-4 md:p-8 md:pt-6 transition-all duration-300 ${
                isHovered ? 'md:ml-64' : 'md:ml-16'
            } mt-16 md:mt-0`}>
                <header className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-700">
                        {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                    </h2>
                </header>

                {children}
            </main>
        </div>
    );
};

export default Layout;