// File: src/main/js/views/dashboard/DashboardView.tsx
import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/AuthProvider';
import { BarChart, LineChart, PieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Line, Pie, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Award, User, LogOut, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Sample data - would be fetched from Spring backend in production
const sampleGradeData = [
    { name: 'A', value: 35, fill: '#4361ee' },
    { name: 'B', value: 40, fill: '#3a86ff' },
    { name: 'C', value: 15, fill: '#4cc9f0' },
    { name: 'D', value: 8, fill: '#4895ef' },
    { name: 'F', value: 2, fill: '#560bad' },
];

const sampleAttendanceData = [
    { month: 'Jan', attendance: 92 },
    { month: 'Feb', attendance: 88 },
    { month: 'Mar', attendance: 95 },
    { month: 'Apr', attendance: 90 },
    { month: 'May', attendance: 87 },
    { month: 'Jun', attendance: 94 },
];

const samplePerformanceData = [
    { subject: 'Math', score: 78, fullMark: 100 },
    { subject: 'Physics', score: 85, fullMark: 100 },
    { subject: 'Chemistry', score: 65, fullMark: 100 },
    { subject: 'Literature', score: 92, fullMark: 100 },
    { subject: 'History', score: 88, fullMark: 100 },
    { subject: 'Computer Science', score: 95, fullMark: 100 },
];

// Neumorphic components
const NeuCard = ({ children, className = '' }) => (
    <div className={`bg-gray-100 rounded-xl p-6 shadow-[8px_8px_16px_#d1d1d1,_-8px_-8px_16px_#ffffff] ${className}`}>
        {children}
    </div>
);

const NeuButton = ({ children, active, onClick, className = '' }) => (
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

// Layout component
const Layout = ({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { logout, user } = useAuth();
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

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-white p-6 shadow-xl">
                <div className="mb-10">
                    <h1 className="text-2xl font-bold text-blue-600">UniStats</h1>
                    <p className="text-gray-500 text-sm">Student Portal</p>
                </div>

                <nav className="flex-1 space-y-4">
                    <Link to="/" className={`flex items-center gap-2 p-4 rounded-xl transition-all duration-300 
            ${activeSection === 'dashboard'
                        ? 'bg-blue-50 text-blue-600 shadow-[inset_4px_4px_8px_#d1d1d1,_inset_-4px_-4px_8px_#ffffff]'
                        : 'bg-gray-100 shadow-[5px_5px_10px_#d1d1d1,_-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#d1d1d1,_-2px_-2px_5px_#ffffff]'}`
                    }>
                        <TrendingUp size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/grades" className={`flex items-center gap-2 p-4 rounded-xl transition-all duration-300 
            ${activeSection === 'grades'
                        ? 'bg-blue-50 text-blue-600 shadow-[inset_4px_4px_8px_#d1d1d1,_inset_-4px_-4px_8px_#ffffff]'
                        : 'bg-gray-100 shadow-[5px_5px_10px_#d1d1d1,_-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#d1d1d1,_-2px_-2px_5px_#ffffff]'}`
                    }>
                        <Award size={20} />
                        <span>Grades</span>
                    </Link>
                    <Link to="/attendance" className={`flex items-center gap-2 p-4 rounded-xl transition-all duration-300 
            ${activeSection === 'attendance'
                        ? 'bg-blue-50 text-blue-600 shadow-[inset_4px_4px_8px_#d1d1d1,_inset_-4px_-4px_8px_#ffffff]'
                        : 'bg-gray-100 shadow-[5px_5px_10px_#d1d1d1,_-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#d1d1d1,_-2px_-2px_5px_#ffffff]'}`
                    }>
                        <Users size={20} />
                        <span>Attendance</span>
                    </Link>
                    <Link to="/profile" className={`flex items-center gap-2 p-4 rounded-xl transition-all duration-300 
            ${activeSection === 'profile'
                        ? 'bg-blue-50 text-blue-600 shadow-[inset_4px_4px_8px_#d1d1d1,_inset_-4px_-4px_8px_#ffffff]'
                        : 'bg-gray-100 shadow-[5px_5px_10px_#d1d1d1,_-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#d1d1d1,_-2px_-2px_5px_#ffffff]'}`
                    }>
                        <User size={20} />
                        <span>Profile</span>
                    </Link>
                </nav>

                <div className="mt-auto pt-6">
                    <NeuButton
                        onClick={handleLogout}
                        active={false}
                        className="w-full justify-center text-red-500"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </NeuButton>
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

            {/* Mobile sidebar */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden">
                    <div className="bg-white w-64 h-full p-6 shadow-xl">
                        <div className="mb-10">
                            <h1 className="text-2xl font-bold text-blue-600">UniStats</h1>
                            <p className="text-gray-500 text-sm">Student Portal</p>
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
                                <span>Grades</span>
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
                                <span>Attendance</span>
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
                                <span>Profile</span>
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
            <main className="flex-1 p-4 md:p-8 md:pt-6 md:ml-64 mt-16 md:mt-0">
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

// Dashboard content
const DashboardView = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // This would normally fetch dashboard data from your Spring backend
    useEffect(() => {
        setLoading(true);
        // Simulating API call
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, []);

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-blue-200 animate-spin"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <NeuCard className="md:col-span-2">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-700">Welcome back, {user?.name}</h2>
                            <p className="text-gray-500">Student ID: {user?.studentId} | {user?.program} - Year {user?.year}</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-xl shadow-[inset_3px_3px_6px_#d1d1d1,_inset_-3px_-3px_6px_#ffffff]">
                            <div className="text-center">
                                <p className="text-gray-500">Current GPA</p>
                                <p className="text-3xl font-bold text-blue-600">{user?.gpa}</p>
                            </div>
                        </div>
                    </div>
                </NeuCard>

                <NeuCard>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Grade Distribution</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={sampleGradeData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                label
                            />
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </NeuCard>

                <NeuCard>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Attendance Rate</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart
                            data={sampleAttendanceData}
                            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" />
                            <YAxis domain={[60, 100]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="attendance" stroke="#4361ee" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </NeuCard>

                <NeuCard className="md:col-span-2">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Subject Performance</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={samplePerformanceData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="subject" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Bar dataKey="score" fill="#4cc9f0" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </NeuCard>
            </div>
        </Layout>
    );
};

export default DashboardView;