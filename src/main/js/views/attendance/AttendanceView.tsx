import React, { useState, useEffect } from 'react';
import { Layout, NeuCard } from '../components/Layout';

const AttendanceView = () => {
    const [loading, setLoading] = useState(false);
    const [attendance, setAttendance] = useState([
        {
            course: "Advanced Algorithms",
            totalClasses: 28,
            present: 26,
            absent: 2,
            percentage: 92.8
        },
        {
            course: "Database Systems",
            totalClasses: 32,
            present: 30,
            absent: 2,
            percentage: 93.7
        },
        {
            course: "Software Engineering",
            totalClasses: 24,
            present: 20,
            absent: 4,
            percentage: 83.3
        },
        {
            course: "Machine Learning",
            totalClasses: 30,
            present: 28,
            absent: 2,
            percentage: 93.3
        },
        {
            course: "Computer Networks",
            totalClasses: 18,
            present: 16,
            absent: 2,
            percentage: 88.9
        }
    ]);

    // This would normally fetch attendance data from your Spring backend
    useEffect(() => {
        setLoading(true);
        // Simulating API call
        setTimeout(() => {
            // In real app: fetch('/api/attendance').then(...)
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
            <NeuCard>
                <h2 className="text-2xl font-bold text-gray-700 mb-6">Attendance Record</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="border-b border-gray-200">
                            <th className="pb-3 font-semibold text-gray-600">Course</th>
                            <th className="pb-3 font-semibold text-gray-600">Total Classes</th>
                            <th className="pb-3 font-semibold text-gray-600">Present</th>
                            <th className="pb-3 font-semibold text-gray-600">Absent</th>
                            <th className="pb-3 font-semibold text-gray-600">Percentage</th>
                        </tr>
                        </thead>
                        <tbody>
                        {attendance.map((course, index) => (
                            <tr key={index} className={index !== attendance.length - 1 ? "border-b border-gray-100" : ""}>
                                <td className="py-4">{course.course}</td>
                                <td className="py-4">{course.totalClasses}</td>
                                <td className="py-4">{course.present}</td>
                                <td className="py-4">{course.absent}</td>
                                <td className="py-4 font-medium" className={
                                    course.percentage >= 90
                                        ? "py-4 font-medium text-green-600"
                                        : course.percentage >= 85
                                            ? "py-4 font-medium text-yellow-600"
                                            : "py-4 font-medium text-red-600"
                                }>
                                    {course.percentage}%
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

export default AttendanceView;