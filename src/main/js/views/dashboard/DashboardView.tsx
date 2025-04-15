// File: src/main/js/views/dashboard/DashboardView.tsx
import React, { useState, useEffect } from 'react';
import { Layout, NeuCard } from '../components/Layout';
import useAuth, {AuthProvider} from '../../hooks/AuthProvider';
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
    RadarChart, PolarGrid, PolarAngleAxis, Radar, PolarRadiusAxis, Cell
} from 'recharts';
import { ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import {Link} from "react-router-dom";

// Colors for different segments - blue fade
const COLORS = [
    '#0D47A1', // 1.0 (darkest blue - best grade)
    '#1565C0', // 1.3
    '#1976D2', // 1.7
    '#1E88E5', // 2.0
    '#2196F3', // 2.3
    '#42A5F5', // 2.7
    '#64B5F6', // 3.0
    '#90CAF9', // 3.3
    '#BBDEFB', // 3.7
    '#E3F2FD', // 4.0
    '#F5F9FF'  // 5.0 (lightest blue - worst grade)
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

// Sort options for the grades overview tew
const SORT_OPTIONS = {
    BEST: "best",
    WORST: "worst",
    LATEST: "latest",
    OLDEST: "oldest",
    HIGHEST_ECTS: "highest-ects",
};

const DashboardView = () => {
    const { data, loading } = useAuth();
    const [sortBy, setSortBy] = useState(SORT_OPTIONS.BEST);
    const [showSortOptions, setShowSortOptions] = useState(false);

    // Sort grades based on selected option
    const getSortedGrades = () => {
        const sortedGrades = [...data.examResults];

        switch (sortBy) {
            case SORT_OPTIONS.BEST:
                return sortedGrades.sort((a, b) => a.grade - b.grade);
            case SORT_OPTIONS.WORST:
                return sortedGrades.sort((a, b) => b.grade - a.grade);
            case SORT_OPTIONS.LATEST:
                return sortedGrades.sort((a, b) => {
                    // Extract year and semester for sorting
                    const getTermValue = (term) => {
                        const year = parseInt(term.match(/\d{2}\/\d{2}|\d{2}/)[0].split('/')[0]) + 2000;
                        const isSummer = term.includes('SS');
                        return year * 10 + (isSummer ? 1 : 0);
                    };
                    return getTermValue(b.semester) - getTermValue(a.semester);
                });
            case SORT_OPTIONS.OLDEST:
                return sortedGrades.sort((a, b) => {
                    // Extract year and semester for sorting
                    const getTermValue = (term) => {
                        const year = parseInt(term.match(/\d{2}\/\d{2}|\d{2}/)[0].split('/')[0]) + 2000;
                        const isSummer = term.includes('SS');
                        return year * 10 + (isSummer ? 1 : 0);
                    };
                    return getTermValue(a.semester) - getTermValue(b.semester);
                });
            case SORT_OPTIONS.HIGHEST_ECTS:
                return sortedGrades.sort((a, b) => b.ects - a.ects);
            default:
                return sortedGrades;
        }
    };

    // Get top 5 grades based on current sort
    const topGrades = getSortedGrades().slice(0, 5);

    // Get friendly label for sort option
    const getSortLabel = () => {
        switch (sortBy) {
            case SORT_OPTIONS.BEST:
                return "Beste Noten";
            case SORT_OPTIONS.WORST:
                return "Schlechteste Noten";
            case SORT_OPTIONS.LATEST:
                return "Neueste Noten";
            case SORT_OPTIONS.OLDEST:
                return "Älteste Noten";
            case SORT_OPTIONS.HIGHEST_ECTS:
                return "Höchste ECTS";
            default:
                return "Sortieren nach";
        }
    };

    // ECTS per semester
    // Filter out unpassed modules and group by semester
    const ectsData = Object.groupBy(data.examResults.filter((x) => x.grade != "5.0"), ({semester}) =>
        semester
    );
    // Accumulate the ECTS for each semester and rearrange in list of objects
    Object.keys(ectsData).forEach((key, index) => ectsData[key] = ectsData[key].reduce((acc, x) => acc + parseInt(x.ects), 0));
    const ectsDataObj = Object.entries(ectsData).map((arr) => ({semester: arr[0], ects: arr[1]}));

    // Notenverteilung
    const gradesData = Object.groupBy(data.examResults, ({grade}) =>
        grade
    );

    Object.keys(gradesData).forEach((key, index) => gradesData[key] = gradesData[key].reduce((acc, x) => acc + 1, 0));
    const gradesDataObj = Object.entries(gradesData).map((arr) => ({grade: arr[0], count: arr[1]}));

console.log(gradesData);
    console.log(gradesDataObj);

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
                            <h2 className="text-2xl font-bold text-gray-700">Willkommen zurück, {data.userInfo.name}</h2>
                            <p className="text-gray-500">
                                Matrikelnummer: n/a | {data.userSemester.major} - Semester {data.userSemester.semester}
                            </p>
                        </div>

                        {/* Note + ECTS together */}
                        <div className="flex gap-4">
                            {/* GPA Box */}
                            <div className="p-4 bg-blue-50 rounded-xl shadow-[inset_3px_3px_6px_#d1d1d1,_inset_-3px_-3px_6px_#ffffff]">
                                <div className="text-center">
                                    <p className="text-gray-500">Schnitt</p>
                                    <p className="text-3xl font-bold text-blue-600">{((data?.examResults?.filter(x => x.grade != "5.0").reduce((sum, curr) => sum + parseInt(curr.grade), 0)) / data?.examResults?.filter(x => x.grade != "5.0").length).toFixed(2)}</p>
                                </div>
                            </div>

                            {/* ECTS Box */}
                            <div className="p-4 bg-blue-50 rounded-xl shadow-[inset_3px_3px_6px_#d1d1d1,_inset_-3px_-3px_6px_#ffffff]">
                                <div className="text-center">
                                    <p className="text-gray-500">ECTS</p>
                                    <p className="text-3xl font-bold text-blue-600">
                                        {data?.examResults?.filter(x => x.grade != "5.0").reduce((sum, curr) => sum + parseInt(curr.ects), 0)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </NeuCard>

                {/* Grades Overview Card */}
                <NeuCard>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-700">Notenübersicht</h3>
                        <div className="relative">
                            <button
                                onClick={() => setShowSortOptions(!showSortOptions)}
                                className="flex items-center gap-1 px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-lg shadow-[2px_2px_5px_#d1d1d1,_-2px_-2px_5px_#ffffff] hover:shadow-[1px_1px_3px_#d1d1d1,_-1px_-1px_3px_#ffffff] transition-all duration-300"
                            >
                                {getSortLabel()} <ArrowUpDown size={16} />
                            </button>

                            {showSortOptions && (
                                <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg z-10 py-1 text-sm border border-gray-200">
                                    <button
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${sortBy === SORT_OPTIONS.BEST ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                                        onClick={() => {
                                            setSortBy(SORT_OPTIONS.BEST);
                                            setShowSortOptions(false);
                                        }}
                                    >
                                        Beste Noten
                                    </button>
                                    <button
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${sortBy === SORT_OPTIONS.WORST ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                                        onClick={() => {
                                            setSortBy(SORT_OPTIONS.WORST);
                                            setShowSortOptions(false);
                                        }}
                                    >
                                        Schlechteste Noten
                                    </button>
                                    <button
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${sortBy === SORT_OPTIONS.LATEST ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                                        onClick={() => {
                                            setSortBy(SORT_OPTIONS.LATEST);
                                            setShowSortOptions(false);
                                        }}
                                    >
                                        Neueste Noten
                                    </button>
                                    <button
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${sortBy === SORT_OPTIONS.OLDEST ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                                        onClick={() => {
                                            setSortBy(SORT_OPTIONS.OLDEST);
                                            setShowSortOptions(false);
                                        }}
                                    >
                                        Älteste Noten
                                    </button>
                                    <button
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${sortBy === SORT_OPTIONS.HIGHEST_ECTS ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                                        onClick={() => {
                                            setSortBy(SORT_OPTIONS.HIGHEST_ECTS);
                                            setShowSortOptions(false);
                                        }}
                                    >
                                        Höchste ECTS
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="overflow-hidden">
                        {topGrades.map((grade, index) => (
                            <div
                                key={grade.id}
                                className={`flex justify-between items-center py-3 ${
                                    index !== topGrades.length - 1 ? 'border-b border-gray-200' : ''
                                }`}
                            >
                                <div>
                                    <h4 className="font-medium text-gray-800">{grade.moduleName}</h4>
                                    <p className="text-sm text-gray-500">{grade.semester}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-sm">{grade.ects} ECTS</span>
                                    <span className={`font-bold text-lg ${
                                        grade.grade <= 1.5 ? 'text-green-600' :
                                            grade.grade <= 2.5 ? 'text-blue-600' :
                                                grade.grade <= 3.5 ? 'text-orange-500' : 'text-red-500'
                                    }`}>
                                        {grade.grade}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 text-center">
                        <Link
                            to="/grades"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Alle Noten anzeigen →
                        </Link>
                    </div>
                </NeuCard>

                <NeuCard>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Notenverteilung</h3>
                    <ResponsiveContainer width="100%" height={220} className="flex items-center justify-center">
                        <PieChart>
                            <Pie
                                data={gradesDataObj}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="count"
                                nameKey="grade"
                                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {gradesDataObj?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value, name, props) => [value, 'Anzahl']} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </NeuCard>

                <NeuCard>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">ECTS pro Semester</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart
                            data={ectsDataObj}
                            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="semester" />
                            <YAxis domain={[0, 60]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="ects" stroke="#4361ee" strokeWidth={2} dot={{ r: 4 }} />
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