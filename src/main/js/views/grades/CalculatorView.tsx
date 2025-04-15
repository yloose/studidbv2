import React, { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Layout, NeuCard } from '../components/Layout';
import useAuth from "../../hooks/AuthProvider";

const CalculatorView = () => {
    const { data, loading } = useAuth();

    const [newModule, setNewModule] = useState({
        name: '',
        grade: '',
        credits: '',
        semester: ''
    });

    const [currentSemester, setCurrentSemester] = useState('SS 23');
    const [showHypothetical, setShowHypothetical] = useState(false);
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [sortBy, setSortBy] = useState('best');

    // Get filtered modules (excluding those with grade 5.0)
    const getFilteredModules = () => {
        if (!data || !data.examResults) return [];
        return data.examResults.filter(module => parseFloat(module.grade) !== 5.0);
    };

    // Calculate simple average
    const calculateSimpleAverage = () => {
        const filteredModules = getFilteredModules();
        if (filteredModules.length === 0) return 0;
        const sum = filteredModules.reduce((total, module) => total + parseFloat(module.grade), 0);
        return (sum / filteredModules.length).toFixed(2);
    };

    // Calculate weighted average
    const calculateWeightedAverage = () => {
        const filteredModules = getFilteredModules();
        if (filteredModules.length === 0) return 0;
        const totalWeightedGrade = filteredModules.reduce((total, module) =>
            total + (parseFloat(module.grade) * parseFloat(module.ects)), 0);
        const totalCredits = filteredModules.reduce((total, module) =>
            total + parseFloat(module.ects), 0);
        return (totalWeightedGrade / totalCredits).toFixed(2);
    };

    // Calculate total ECTS
    const calculateTotalECTS = () => {
        const filteredModules = getFilteredModules();
        if (filteredModules.length === 0) return 0;
        return filteredModules.reduce((total, module) => total + parseFloat(module.ects), 0);
    };

    // Calculate hypothetical average with new module
    const calculateHypotheticalAverage = () => {
        if (!newModule.grade || !newModule.credits || !data || !data.examResults) return calculateWeightedAverage();

        // Skip modules with grade 5.0
        const filteredModules = getFilteredModules();

        const hypotheticalModules = [
            ...filteredModules.map(module => ({
                grade: parseFloat(module.grade),
                ects: parseFloat(module.ects)
            })),
            {
                grade: parseFloat(newModule.grade),
                ects: parseFloat(newModule.credits)
            }
        ];

        const totalWeightedGrade = hypotheticalModules.reduce((total, module) =>
            total + (module.grade * module.ects), 0);
        const totalCredits = hypotheticalModules.reduce((total, module) =>
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

    // Note: Since we're not using the modules state anymore, these functions are just placeholders
    // In a real application, you would need to modify the data object through an API or other method
    const handleAddModule = () => {
        if (!newModule.name || !newModule.grade || !newModule.credits) {
            alert('Please fill in all fields');
            return;
        }

        alert('This is a demo. In a real application, this would add a new module to your records.');
        setNewModule({ name: '', grade: '', credits: '', semester: '' });
    };

    const handleDeleteModule = (moduleCode) => {
        alert('This is a demo. In a real application, this would delete the module from your records.');
    };

    const handleSemesterChange = (e) => {
        setCurrentSemester(e.target.value);
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
        const filteredModules = getFilteredModules();

        switch (sortBy) {
            case 'best':
                return filteredModules.sort((a, b) => parseFloat(a.grade) - parseFloat(b.grade));
            case 'worst':
                return filteredModules.sort((a, b) => parseFloat(b.grade) - parseFloat(a.grade));
            case 'latest':
                return filteredModules.sort((a, b) => a.semester < b.semester ? 1 : -1);
            case 'oldest':
                return filteredModules.sort((a, b) => a.semester > b.semester ? 1 : -1);
            case 'highest-ects':
                return filteredModules.sort((a, b) => parseFloat(b.ects) - parseFloat(a.ects));
            default:
                return filteredModules;
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

                                {/* Current Semester Select */}
                                <div className="mb-4">
                                    <label className="text-sm font-medium text-gray-600 mb-2 block">Current Semester</label>
                                    <select
                                        value={currentSemester}
                                        onChange={handleSemesterChange}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="WS 21/22">WS 21/22</option>
                                        <option value="SS 22">SS 22</option>
                                        <option value="WS 22/23">WS 22/23</option>
                                        <option value="SS 23">SS 23</option>
                                        <option value="WS 23/24">WS 23/24</option>
                                    </select>
                                </div>

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
                                            name="credits"
                                            value={newModule.credits}
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
                                            <option value="">Current ({currentSemester})</option>
                                            <option value="WS 21/22">WS 21/22</option>
                                            <option value="SS 22">SS 22</option>
                                            <option value="WS 22/23">WS 22/23</option>
                                            <option value="SS 23">SS 23</option>
                                            <option value="WS 23/24">WS 23/24</option>
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
                                {showHypothetical && newModule.grade && newModule.credits && (
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
                                    <h3 className="text-xl font-semibold text-gray-700">All Modules</h3>

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
                                    {!data || !data.examResults || getFilteredModules().length === 0 ? (
                                        <p className="text-center py-8 text-gray-500">No passing modules found. Modules with grade 5.0 are excluded.</p>
                                    ) : (
                                        getSortedModules().map((module, index, array) => (
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
                                                    <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-sm">{module.ects} ECTS</span>
                                                    <span className={`font-bold text-lg ${
                                                        parseFloat(module.grade) <= 1.5 ? 'text-green-600' :
                                                            parseFloat(module.grade) <= 2.5 ? 'text-blue-600' :
                                                                parseFloat(module.grade) <= 3.5 ? 'text-orange-500' : 'text-red-500'
                                                    }`}>
                                                    {parseFloat(module.grade).toFixed(1)}
                                                </span>
                                                    <button
                                                        onClick={() => handleDeleteModule(module.moduleCode)}
                                                        className="text-gray-400 hover:text-gray-600 ml-2"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))
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