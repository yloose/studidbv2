// File: src/main/js/views/dashboard/DashboardView.tsx
import React, { useState, useEffect } from 'react';
import { Layout, NeuCard } from '../components/Layout';
import useAuth from '../../hooks/AuthProvider';
import {
    BarChart,
    LineChart,
    PieChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Bar,
    Line,
    Pie,
    ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, Radar, PolarRadiusAxis
} from 'recharts';

// Sample data - would be fetched from Spring backend in production
const sampleGradeData = [
    { name: 'A', value: 35, fill: '#4361ee' },
    { name: 'B', value: 40, fill: '#3a86ff' },
    { name: 'C', value: 15, fill: '#4cc9f0' },
    { name: 'D', value: 8, fill: '#4895ef' },
    { name: 'F', value: 2, fill: '#560bad' },
];

const sampleECTSData = [
    { semester: 'WiSe 22/23', ECTS: 28 },
    { semester: 'SoSe23', ECTS: 33 },
    { semester: 'WiSe 23/24', ECTS: 27 },
    { semester: 'SoSe 24', ECTS: 54 },
    { semester: 'WiSe 24/25', ECTS: 23 },
    { semester: 'SoSe 25', ECTS: 0 },
];

const modules = [
    { name: "Berechnung und Logik", category: "Theoretische Informatik", ects: 4 },
    { name: "Analyse von Algotihmen und Komplexität", category: "Theoretische Informatik", ects: 4 },
    { name: "Compilerbau", category: "Theoretische Informatik", ects: 5 },
    { name: "Softwarearchitektur", category: "Software Engineering", ects: 3 },
    { name: "Data Science", category: "Data Science", ects: 4 },
    { name: "Deep Learning", category: "Machine Learning", ects: 5 },
    { name: "Big Data", category: "Data Science", ects: 2 },
    { name: "Statistische Methoden", category: "Data Science", ects: 3 },
];

const categoryMap = {};

modules.forEach(mod => {
    if (!categoryMap[mod.category]) {
        categoryMap[mod.category] = 0;
    }
    categoryMap[mod.category] += mod.ects;
});

const radarData = Object.entries(categoryMap).map(([category, totalECTS]) => ({
    category,
    ects: totalECTS,
}));

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
                        {/* Left Info */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-700">Willkommen zurück, {user?.name}</h2>
                            <p className="text-gray-500">
                                Matrikelnummer: {user?.studentId} | {user?.program} - Semester {user?.year}
                            </p>
                        </div>

                        {/* Note + ECTS together */}
                        <div className="flex gap-4">
                            {/* GPA Box */}
                            <div className="p-4 bg-blue-50 rounded-xl shadow-[inset_3px_3px_6px_#d1d1d1,_inset_-3px_-3px_6px_#ffffff]">
                                <div className="text-center">
                                    <p className="text-gray-500">Note</p>
                                    <p className="text-3xl font-bold text-blue-600">{user?.gpa}</p>
                                </div>
                            </div>

                            {/* ECTS Box */}
                            <div className="p-4 bg-blue-50 rounded-xl shadow-[inset_3px_3px_6px_#d1d1d1,_inset_-3px_-3px_6px_#ffffff]">
                                <div className="text-center">
                                    <p className="text-gray-500">ECTS</p>
                                    <p className="text-3xl font-bold text-blue-600">
                                        {sampleECTSData.reduce((sum, curr) => sum + curr.ECTS, 0)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </NeuCard>

                <NeuCard>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Notenverteilung</h3>
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
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">ECTS pro Semester</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart
                            data={sampleECTSData}
                            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="semester" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="ECTS" stroke="#4361ee" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </NeuCard>

                <NeuCard>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Modulverteilung</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <RadarChart data={radarData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="category" />
                            <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                            <Radar name="ECTS" dataKey="ects" stroke="#3f45aa" fill="#4361ee" fillOpacity={0.6} />
                            <Legend />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                </NeuCard>
            </div>
        </Layout>
    );
};

export default DashboardView;