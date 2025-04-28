import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/AuthProvider';

const LoginView = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(username, password);
            navigate("/");
        } catch (err: any) {
            // Set error message from the caught error
            setError(err?.message || "Login failed. Please try again.");
        } finally {
            // Always set loading to false, regardless of outcome
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl p-8 shadow-[8px_8px_16px_#d1d1d1,_-8px_-8px_16px_#ffffff]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600">StudiDBV2</h1>
                    <p className="text-gray-500 mt-2">Studierendendatenbank</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg text-center text-red-600 bg-gray-50 shadow-[inset_3px_3px_6px_#d1d1d1,_inset_-3px_-3px_6px_#ffffff] border-l-4 border-red-500 flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                        </svg>
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 bg-gray-50 rounded-lg shadow-[inset_3px_3px_6px_#d1d1d1,_inset_-3px_-3px_6px_#ffffff] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your student ID"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-gray-50 rounded-lg shadow-[inset_3px_3px_6px_#d1d1d1,_inset_-3px_-3px_6px_#ffffff] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading || loading}
                            className={`w-full p-3 bg-blue-600 text-white rounded-lg transition-all duration-300 
                ${(isLoading || loading)
                                ? 'opacity-70 cursor-not-allowed'
                                : 'shadow-[5px_5px_10px_#d1d1d1,_-5px_-5px_10px_#ffffff] hover:bg-blue-700 hover:shadow-[2px_2px_5px_#d1d1d1,_-2px_-2px_5px_#ffffff]'
                            }`}
                        >
                            {isLoading || loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginView;