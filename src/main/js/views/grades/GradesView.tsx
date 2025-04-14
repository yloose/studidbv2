// File: src/main/js/views/grades/GradesView.tsx
import React, { useState, useEffect } from 'react';
import { Layout, NeuCard } from '../components/Layout';
import useAuth from "../../hooks/AuthProvider";

const GradesView = () => {
    const {data, loading} = useAuth();

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
            <NeuCard>
                <h2 className="text-2xl font-bold text-gray-700 mb-6">Notenübersicht</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="border-b border-gray-200">
                            <th className="pb-3 font-semibold text-gray-600">Modul</th>
                            <th className="pb-3 font-semibold text-gray-600">Modulcode</th>
                            <th className="pb-3 font-semibold text-gray-600">ECTS</th>
                            <th className="pb-3 font-semibold text-gray-600">Note</th>
                            <th className="pb-3 font-semibold text-gray-600">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data?.examResults?.map((course, index) => (
                            <tr key={index} className={index !== data.length - 1 ? "border-b border-gray-100" : ""}>
                                <td className="py-4">{course.moduleName}</td>
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