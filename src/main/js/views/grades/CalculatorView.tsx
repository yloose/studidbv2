import React, {useEffect, useState} from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Layout, NeuCard } from '../components/Layout';
import useAuth from "../../hooks/AuthProvider";

// Lookup data structure for calculation weighted avg
const GRUND_MODULES = new Set([
    "Inf-CompSys",
    "Inf-Math-A",
    "Inf-Math-B",
    "infCN-01a",
    "infEAlg-01a",
    "infEInf-01a",
    "infProgOO-01a",
    "infEWInf-01a"
]);

function isGrundModule(moduleCode) {
    return GRUND_MODULES.has(moduleCode);
}

const getCurrentSemester = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    if (month >= 4 && month <= 9) {
        return `SS ${year - 2000}`;
    } else {
        return `WS ${year - 2000}/${year - 2000 + 1}`;
    }
};

// Function to generate upcoming semesters
const getUpcomingSemesters = (count = 5) => {
    const semesters = [];
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;

    if (month >= 4 && month <= 9) {
        semesters.push(`WS ${year - 2000}/${year + 1 - 2000}`);
        for (let i = 1; i < count; i++) {
            if (i % 2 === 1) { // Odd iterations are SS
                semesters.push(`SS ${year + Math.ceil(i/2) - 2000}`);
            } else { // Even iterations are WS
                const winterYear = year + Math.floor(i/2);
                semesters.push(`WS ${winterYear - 2000}/${winterYear + 1 - 2000}`);
            }
        }
    } else {
        semesters.push(`SS ${year - 2000}`);
        for (let i = 0; i < count; i++) {
            if (i % 2 === 0) { // Even iterations are SS
                semesters.push(`SS ${year + Math.floor(i/2) + 1}`);
            } else { // Odd iterations are WS
                const winterYear = year + Math.floor(i/2) + 1;
                semesters.push(`WS ${winterYear - 2000}/${winterYear + 1 - 2000}`);
            }
        }
    }
    return semesters;
};

const CalculatorView = () => {

    // State for semester options
    const [semesterOptions, setSemesterOptions] = useState([]);
    const currentSystemSemester = getCurrentSemester();

    const { data, loading } = useAuth();
    const [hypotheticalModules, setHypotheticalModules] = useState([]);
    const [newModule, setNewModule] = useState({
        name: '',
        grade: '',
        ects: '',
        semester: ''
    });

    const filteredModules = data?.examResults?.filter(module => parseFloat(module.grade) !== 5.0) || [];
    const [currentSemester, setCurrentSemester] = useState('');
    const [showHypothetical, setShowHypothetical] = useState(false);
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [sortBy, setSortBy] = useState('best');

    useEffect(() => {
        setSemesterOptions(getUpcomingSemesters(5));
        setCurrentSemester(currentSystemSemester);
    }, []); // Add empty dependency array to run only once on mount

    // Calculate simple average
    const calculateSimpleAverage = () => {
        if (filteredModules.length === 0) return 0;
        const sum = filteredModules.reduce((total, module) => total + parseFloat(module.grade), 0);
        return (sum / filteredModules.length).toFixed(2);
    };


    // Calculate weighted average
    const calculateWeightedAverage = () => {
        if (filteredModules.length === 0) return 0;
        const totalWeightedGrade = filteredModules.reduce((total, module) => isGrundModule(module.moduleCode)
            ? total + (parseFloat(module.grade) * (parseInt(module.ects)) / 2)
            : total + (parseFloat(module.grade) * parseInt(module.ects)), 0);
        const totalCredits = filteredModules.reduce((total, module) =>
            total + parseFloat(module.ects), 0);
        return (totalWeightedGrade / totalCredits).toFixed(2);
    };

    // Calculate total ECTS
    const calculateTotalECTS = () => {
        if (filteredModules.length === 0) return 0;
        return filteredModules.reduce((total, module) => total + parseFloat(module.ects), 0);
    };

    // Calculate hypothetical average with all hypothetical modules
    const calculateHypotheticalAverage = () => {
        if ((!newModule.grade || !newModule.ects) && hypotheticalModules.length === 0)
            return calculateWeightedAverage();

        // Combine actual modules with hypothetical ones
        const allModules = [
            ...filteredModules.map(module => ({
                grade: parseFloat(module.grade),
                ects: parseFloat(module.ects),
                moduleCode: module.moduleCode // Keep moduleCode for grund module check
            })),
            ...hypotheticalModules.map(module => ({
                grade: parseFloat(module.grade),
                ects: parseFloat(module.ects),
                moduleCode: module.moduleCode // Keep moduleCode for grund module check
            }))
        ];

        // Add the new module if it has values
        if (newModule.grade && newModule.ects) {
            allModules.push({
                grade: parseFloat(newModule.grade),
                ects: parseFloat(newModule.ects),
                moduleCode: `HYPO-TEMP` // Temporary code for the module being added
            });
        }

        // Apply the weighted calculation correctly
        const totalWeightedGrade = allModules.reduce((total, module) =>
                isGrundModule(module.moduleCode)
                    ? total + (module.grade * (module.ects / 2))
                    : total + (module.grade * module.ects),
            0
        );

        const totalCredits = allModules.reduce((total, module) =>
            total + module.ects, 0);

        return (totalWeightedGrade / totalCredits).toFixed(2);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewModule({
            ...newModule,
            [name]: value
        });
    };

    const handleAddModule = () => {
        if (!newModule.name || !newModule.grade || !newModule.ects) {
            alert('Please fill in all fields');
            return;
        }

        // Create a new hypothetical module
        const semester = newModule.semester || currentSemester;
        const moduleToAdd = {
            ...newModule,
            semester,
            id: `hypo-${Date.now()}`, // Add a unique ID
            moduleCode: `HYPO-${hypotheticalModules.length + 1}`,
            moduleName: newModule.name,
            lecturer: 'Hypothetical',
        };

        // Add to hypothetical modules
        setHypotheticalModules([...hypotheticalModules, moduleToAdd]);

        // Clear the form
        setNewModule({ name: '', grade: '', ects: '', semester: '' });

        // Show hypothetical section if it's not already shown
        if (!showHypothetical) {
            setShowHypothetical(true);
        }
    };

    const handleDeleteHypotheticalModule = (id) => {
        setHypotheticalModules(hypotheticalModules.filter(module => module.id !== id));
    };

    // Get friendly label for sort option
    const getSortLabel = () => {
        switch (sortBy) {
            case 'best':
                return "Beste Noten";
            case 'worst':
                return "Schlechteste Noten";
            case 'latest':
                return "Neueste Noten";
            case 'oldest':
                return "Älteste Grades";
            case 'highest-ects':
                return "Höchste ECTS";
            default:
                return "Sort by";
        }
    };

    // Sort examResults based on selected option
    const getSortedModules = () => {
        switch (sortBy) {
            case 'best':
                return [...filteredModules].sort((a, b) => parseFloat(a.grade) - parseFloat(b.grade));
            case 'worst':
                return [...filteredModules].sort((a, b) => parseFloat(b.grade) - parseFloat(a.grade));
            case 'latest':
                return [...filteredModules].sort((a, b) => a.semester < b.semester ? 1 : -1);
            case 'oldest':
                return [...filteredModules].sort((a, b) => a.semester > b.semester ? 1 : -1);
            case 'highest-ects':
                return [...filteredModules].sort((a, b) => parseFloat(b.ects) - parseFloat(a.ects));
            default:
                return filteredModules;
        }
    };

    // Sort hypothetical modules
    const getSortedHypotheticalModules = () => {
        switch (sortBy) {
            case 'best':
                return [...hypotheticalModules].sort((a, b) => parseFloat(a.grade) - parseFloat(b.grade));
            case 'worst':
                return [...hypotheticalModules].sort((a, b) => parseFloat(b.grade) - parseFloat(a.grade));
            case 'latest':
                return [...hypotheticalModules].sort((a, b) => a.semester < b.semester ? 1 : -1);
            case 'oldest':
                return [...hypotheticalModules].sort((a, b) => a.semester > b.semester ? 1 : -1);
            case 'highest-ects':
                return [...hypotheticalModules].sort((a, b) => parseFloat(b.ects) - parseFloat(a.ects));
            default:
                return hypotheticalModules;
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="bg-gray-100 p-8">
                    <div className="max-w-7xl mx-auto">
                        <NeuCard>
                            <p className="text-center py-8">Loading your exam results...</p>
                        </NeuCard>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="bg-gray-100 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Left Column - Averages and Custom Modules */}
                        <div className="md:w-1/3">
                            {/* Three Average Cards */}
                            <div className="grid grid-cols-1 gap-4 mb-6">
                                <NeuCard>
                                    <h2 className="text-sm uppercase tracking-wider text-gray-600 mb-2">Einfacher Durchschnitt</h2>
                                    <p className="text-3xl font-medium text-blue-600">{calculateSimpleAverage()}</p>
                                </NeuCard>

                                <NeuCard>
                                    <h2 className="text-sm uppercase tracking-wider text-gray-600 mb-2">Gewichteter Durchschnitt</h2>
                                    <p className="text-3xl font-medium text-blue-600">{calculateWeightedAverage()}</p>
                                </NeuCard>

                                <NeuCard>
                                    <h2 className="text-sm uppercase tracking-wider text-gray-600 mb-2">ECTS</h2>
                                    <p className="text-3xl font-medium text-blue-600">{calculateTotalECTS()}</p>
                                </NeuCard>
                            </div>

                            {/* Custom Module Input Section */}
                            <NeuCard>
                                <h3 className="text-xl font-semibold text-gray-700 mb-4">Modul hinzufügen</h3>

                                {/* Add New Module Form */}
                                <div className="grid grid-cols-1 gap-4 mb-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 mb-2 block">Modulname</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={newModule.name}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g. Computer Science"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600 mb-2 block">Note</label>
                                        <input
                                            type="number"
                                            name="grade"
                                            value={newModule.grade}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="1.0-5.0"
                                            min="1.0"
                                            max="5.0"
                                            step="0.1"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600 mb-2 block">ECTS</label>
                                        <input
                                            type="number"
                                            name="ects"
                                            value={newModule.ects}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g. 6"
                                            min="1"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600 mb-2 block">Semester</label>
                                        <select
                                            name="semester"
                                            value={newModule.semester}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Derzeitig ({currentSemester})</option>
                                            {semesterOptions.map((semester, index) => (
                                                <option key={`semester-${index}`} value={semester}>
                                                    {semester}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={handleAddModule}
                                        className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none transition-colors duration-300"
                                    >
                                        Add Module
                                    </button>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="showHypothetical"
                                            checked={showHypothetical}
                                            onChange={() => setShowHypothetical(!showHypothetical)}
                                            className="mr-2"
                                        />
                                        <label htmlFor="showHypothetical" className="text-gray-600 text-sm">
                                            Show hypothetical
                                        </label>
                                    </div>
                                </div>

                                {/* Hypothetical Grade */}
                                {showHypothetical && (newModule.grade || hypotheticalModules.length > 0) && (
                                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                        <h2 className="text-sm font-medium text-gray-600 mb-2">Hypothetical Average</h2>
                                        <div className="flex items-center">
                                            <div className="text-3xl font-medium text-blue-600 mr-3">{calculateHypotheticalAverage()}</div>
                                            <div className="text-sm text-gray-500">
                                                Current: {calculateWeightedAverage()}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </NeuCard>
                        </div>

                        {/* Right Column - All Modules */}
                        <div className="md:w-2/3">
                            <NeuCard className="h-full">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold text-gray-700">Deine Module</h3>

                                    {/* Sort dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowSortOptions(!showSortOptions)}
                                            className="flex items-center gap-1 px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-lg shadow-[2px_2px_5px_#d1d1d1,_-2px_-2px_5px_#ffffff] hover:shadow-[1px_1px_3px_#d1d1d1,_-1px_-1px_3px_#ffffff] transition-all duration-300"
                                        >
                                            {getSortLabel()}
                                            <ArrowUpDown size={16} className="ml-1" />
                                        </button>

                                        {showSortOptions && (
                                            <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg z-10 py-1 text-sm border border-gray-200">
                                                <button
                                                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${sortBy === 'best' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                                                    onClick={() => {
                                                        setSortBy('best');
                                                        setShowSortOptions(false);
                                                    }}
                                                >
                                                    Beste Noten
                                                </button>
                                                <button
                                                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${sortBy === 'worst' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                                                    onClick={() => {
                                                        setSortBy('worst');
                                                        setShowSortOptions(false);
                                                    }}
                                                >
                                                    Schlechteste Grades
                                                </button>
                                                <button
                                                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${sortBy === 'latest' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                                                    onClick={() => {
                                                        setSortBy('latest');
                                                        setShowSortOptions(false);
                                                    }}
                                                >
                                                    Neueste Grades
                                                </button>
                                                <button
                                                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${sortBy === 'oldest' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                                                    onClick={() => {
                                                        setSortBy('oldest');
                                                        setShowSortOptions(false);
                                                    }}
                                                >
                                                    Älteste Grades
                                                </button>
                                                <button
                                                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${sortBy === 'highest-ects' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                                                    onClick={() => {
                                                        setSortBy('highest-ects');
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
                                    {!data || !data.examResults || filteredModules.length === 0 ? (
                                        <p className="text-center py-8 text-gray-500">No passing modules found. Modules with grade 5.0 are excluded.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {/* Hypothetical modules section */}
                                            {showHypothetical && hypotheticalModules.length > 0 && (
                                                <div className="pt-2 border-b-2 border-gray-200">
                                                    <h4 className="text-lg font-semibold text-gray-700 mb-3">Neu hinzugefügte Module</h4>
                                                    {getSortedHypotheticalModules().map((module, index) => (
                                                        <div
                                                            key={module.id}
                                                            className={`flex justify-between items-center py-3 ${
                                                                index !== hypotheticalModules.length - 1 ? 'border-b border-gray-200' : ''
                                                            }`}
                                                        >
                                                            <div>
                                                                <h4 className="font-medium text-gray-800">{module.name}</h4>
                                                                <p className="text-sm text-gray-500">{module.semester} • {module.moduleCode}</p>
                                                                <p className="text-xs text-gray-400">Hypothetical</p>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-sm">{module.ects} ECTS</span>
                                                                <span className={`font-bold text-lg ${
                                                                    parseFloat(module.grade) <= 1.5 ? 'text-green-600' :
                                                                        parseFloat(module.grade) <= 2.5 ? 'text-blue-600' :
                                                                            parseFloat(module.grade) <= 3.5 ? 'text-orange-500' : 'text-red-500'
                                                                }`}>
                                                                {parseFloat(module.grade).toFixed(1)}
                                                            </span>
                                                                <button
                                                                    onClick={() => handleDeleteHypotheticalModule(module.id)}
                                                                    className="text-gray-400 hover:text-gray-600 ml-2"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Actual modules section */}
                                            <div className="pb-2">
                                                {getSortedModules().map((module, index, array) => (
                                                    <div
                                                        key={`${module.moduleCode}-${module.moduleName}-${index}`}
                                                        className={`flex justify-between items-center py-3 ${
                                                            index !== array.length - 1 ? 'border-b border-gray-200' : ''
                                                        }`}
                                                    >
                                                        <div>
                                                            <h4 className="font-medium text-gray-800">{module.moduleName}</h4>
                                                            <p className="text-sm text-gray-500">{module.semester} • {module.moduleCode}</p>
                                                            <p className="text-xs text-gray-400">{module.lecturer}</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-sm">{Math.floor(module.ects)} ECTS</span>
                                                            <span className={`font-bold text-lg ${
                                                                parseFloat(module.grade) <= 1.5 ? 'text-green-600' :
                                                                    parseFloat(module.grade) <= 2.5 ? 'text-blue-600' :
                                                                        parseFloat(module.grade) <= 3.5 ? 'text-orange-500' : 'text-red-500'
                                                            }`}>
                                                            {parseFloat(module.grade).toFixed(1)}
                                                        </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </NeuCard>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CalculatorView;