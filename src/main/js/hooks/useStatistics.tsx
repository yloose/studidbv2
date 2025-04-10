import { useState, useEffect } from 'react';
import useAuth from './AuthProvider';

type Course = {
    id: number;
    name: string;
    grade: string;
    credits: number;
};

type StudentStatistics = {
    gpa: number;
    completedCredits: number;
    currentSemester: string;
    courses: Course[];
};

export default function useStatistics() {
    const [statistics, setStatistics] = useState<StudentStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchStatistics = async () => {
            if (!user) return;

            setLoading(true);
            try {
                const response = await fetch(`/api/stats/student/${user.id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch statistics');
                }

                const data = await response.json();
                setStatistics(data);
                setError(null);
            } catch (err) {
                setError('Error loading statistics data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, [user]);

    return { statistics, loading, error };
}