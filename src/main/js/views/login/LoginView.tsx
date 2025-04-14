// File: src/main/js/views/login/LoginView.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/AuthProvider';

const LoginView = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated
    React.useEffect(() => {
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
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl p-8 shadow-[8px_8px_16px_#d1d1d1,_-8px_-8px_16px_#ffffff]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600">UniStats</h1>
                    <p className="text-gray-500 mt-2">Student Portal Login</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-center">
                        {error}
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
                            disabled={isLoading}
                            className={`w-full p-3 bg-blue-600 text-white rounded-lg transition-all duration-300 
                ${isLoading
                                ? 'opacity-70 cursor-not-allowed'
                                : 'shadow-[5px_5px_10px_#d1d1d1,_-5px_-5px_10px_#ffffff] hover:bg-blue-700 hover:shadow-[2px_2px_5px_#d1d1d1,_-2px_-2px_5px_#ffffff]'
                            }`}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        For demonstration, use any credentials
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginView;