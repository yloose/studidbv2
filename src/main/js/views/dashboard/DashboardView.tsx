// File: src/main/js/views/dashboard/DashboardView.tsx
import React, { useState, useEffect } from 'react';
import { Layout, NeuCard } from '../components/Layout';
import useAuth from '../../hooks/AuthProvider';
import { BarChart, LineChart, PieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Line, Pie, ResponsiveContainer } from 'recharts';

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