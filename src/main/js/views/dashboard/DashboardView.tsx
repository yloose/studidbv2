// File: src/main/js/views/dashboard/DashboardView.tsx
import React, {useState, useEffect, useMemo} from 'react';
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
import { calculateWeightedAverage } from '../../utils/gradeCalculator';
import { getModulesByCategory, getCategoryForModule } from '../../utils/moduleMapping';
import {sortBySemester} from "../../utils/utils";

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

// Sort options for the grades overview tew
const SORT_OPTIONS = {
    BEST: "best",
    WORST: "worst",
    LATEST: "latest",
    OLDEST: "oldest",
    HIGHEST_ECTS: "highest-ects",
};

const DashboardView = () => {
    const { data } = useAuth();
    const [sortBy, setSortBy] = useState(SORT_OPTIONS.BEST);
    const [showSortOptions, setShowSortOptions] = useState(false);

    // Create CategoryMap for hexagon chart
    const categoryMap = {};

    data.examResults.forEach(mod => {
        if (!categoryMap[getCategoryForModule(mod.moduleCode)]) {
            categoryMap[getCategoryForModule(mod.moduleCode)] = 0;
        }
        categoryMap[getCategoryForModule(mod.moduleCode)] += parseInt(mod.ects);
    });

    const pieData = Object.entries(categoryMap).map(([category, totalECTS]) => ({
        name: category,
        value: totalECTS,
    }));

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

    const ectsPerSemester = useMemo(() => {
        let groupedData: Object = Object.groupBy(data.examResults.filter(x => x.grade != "5.0"), ({semester}) => semester);
        Object.keys(groupedData).forEach(key => groupedData[key] = groupedData[key].reduce((acc, x) => acc + parseInt(x.ects), 0));
        return sortBySemester(Object.entries(groupedData).map(arr => ({semester: arr[0], ects: arr[1]})), x => x.semester);
    }, [data.examResults]);

    // Notenverteilung
    const gradesData: Object = Object.groupBy(data.examResults, ({grade}) =>
        grade
    );

    Object.keys(gradesData).forEach((key, index) => gradesData[key] = gradesData[key].reduce((acc, x) => acc + 1, 0));
    const gradesDataObj = Object.entries(gradesData).map((arr) => ({grade: arr[0], count: arr[1]})).sort((a, b) => parseFloat(b.grade) - parseFloat(a.grade));

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
                                    <p className="text-3xl font-bold text-blue-600">{calculateWeightedAverage(data.examResults)}</p>
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
                                key={grade.moduleCode}
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

                <NeuCard className="min-h-[300px] flex flex-col justify-between"> {/* Match height with Notenübersicht */}
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Notenverteilung</h3>
                    <div className="flex-grow">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={gradesDataObj}>
                                <XAxis dataKey="grade" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#0D47A1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </NeuCard>



                <NeuCard>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">ECTS pro Semester</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart
                            data={ectsPerSemester}
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
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} ECTS`, 'ECTS']} />
                        </PieChart>
                    </ResponsiveContainer>
                </NeuCard>
            </div>
        </Layout>
    );
};

export default DashboardView;