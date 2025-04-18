import React, { useState, useEffect } from 'react';
import { Layout, NeuCard } from '../components/Layout';
import useAuth from "../../hooks/AuthProvider";

const EnrolledView = () => {
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
                <h2 className="text-2xl font-bold text-gray-700 mb-6">Belegte Module</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="border-b border-gray-200">
                            <th className="pb-3 font-semibold text-gray-600">Modul</th>
                            <th className="pb-3 font-semibold text-gray-600">Modulcode</th>
                            <th className="pb-3 font-semibold text-gray-600">ECTS</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data?.userSemester?.enrolledModules?.map((course, index) => (
                            <tr key={index} className={index !== data.length - 1 ? "border-b border-gray-100" : ""}>
                                <td className="py-4">{course.name}</td>
                                <td className="py-4">{course.id}</td>
                                <td className="py-4">{course.ects}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </NeuCard>
        </Layout>
    );
};

export default EnrolledView;