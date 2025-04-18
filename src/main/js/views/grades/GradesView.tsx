// File: src/main/js/views/grades/GradesView.tsx
import React, { useState } from 'react';
import { Layout, NeuCard } from '../components/Layout';
import useAuth from "../../hooks/AuthProvider";

const GradesView = () => {
    const {data} = useAuth();
    const [sortConfig, setSortConfig] = useState<{key: string, direction: "asc" | "desc"}>({key: "semester", direction: "desc"})

    const sortedResults = data.examResults;
    const sortDirection = sortConfig.direction == "asc" ? 1 : -1;
    switch (sortConfig.key) {
        case "status":
            sortedResults.sort((a, b) => sortDirection * (+(a.grade === "5.0") - +(b.grade === "5.0")));
            break;

        case "semester":
            const parseSemester = (s: string) => (s.startsWith("WS") ? 0.5 : 0) + parseInt(s.match(/\d{2}/)[0] || "0");
            sortedResults.sort((a, b) => sortDirection * (parseSemester(a.semester) - parseSemester(b.semester)));
            break;

        case "ects":
        case "grade":
            sortedResults.sort((a, b) => sortDirection * (parseFloat(a[sortConfig.key]) - parseFloat(b[sortConfig.key])));
            break;

        case "moduleName":
        case "moduleCode":
            sortedResults.sort((a, b) => sortDirection * a[sortConfig.key].localeCompare(b[sortConfig.key]));
            break;
    }

    const changeSort = (key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig?.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const getArrow = (key: string) => {
        if (sortConfig?.key !== key) return '⇅';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    return (
        <Layout>
            <NeuCard>
                <h2 className="text-2xl font-bold text-gray-700 mb-6">Notenübersicht</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="border-b border-gray-200">
                            <th onClick={() => changeSort("moduleName")} className="pb-3 font-semibold text-gray-600 cursor-pointer">
                                Modul {getArrow("moduleName")}
                            </th>
                            <th onClick={() => changeSort("semester")} className="pb-3 font-semibold text-gray-600 cursor-pointer">
                                Semester {getArrow("semester")}
                            </th>
                            <th onClick={() => changeSort("moduleCode")} className="pb-3 font-semibold text-gray-600 cursor-pointer">
                                Modulcode {getArrow("moduleCode")}
                            </th>
                            <th onClick={() => changeSort("ects")} className="pb-3 font-semibold text-gray-600 cursor-pointer">
                                ECTS {getArrow("ects")}
                            </th>
                            <th onClick={() => changeSort("grade")} className="pb-3 font-semibold text-gray-600 cursor-pointer">
                                Note {getArrow("grade")}
                            </th>
                            <th onClick={() => changeSort("status")} className="pb-3 font-semibold text-gray-600 cursor-pointer">
                                Status {getArrow("status")}
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedResults.map((course, index) => (
                            <tr key={index} className={index !== data.length - 1 ? "border-b border-gray-100" : ""}>
                                <td className="py-4">{course.moduleName}</td>
                                <td className="py-4">{course.semester}</td>
                                <td className="py-4">{course.moduleCode}</td>
                                <td className="py-4">{course.ects}</td>
                                <td className="py-4 font-medium text-blue-600">
                                    {course.grade}
                                </td>
                                <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                        course.grade == "5.0"
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                    }`}>
                     {course.grade == "5.0" ? "Nicht bestanden" : "Bestanden"}
                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </NeuCard>
        </Layout>
    );
};

export default GradesView;