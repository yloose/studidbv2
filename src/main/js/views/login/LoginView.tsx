import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/AuthProvider';

const LoginView = () => {
    // Student credentials
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // VPN credentials
    const [vpnName, setVpnName] = useState('');
    const [vpnPassword, setVpnPassword] = useState('');

    // UI state
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1); // 1 = VPN credentials, 2 = Student credentials

    const { login, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // Handle VPN credentials submission
    const handleVpnSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setStep(2);
    };

    // Handle final login submission (student credentials)
    const handleStudentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Call login with both sets of credentials
            await login(username, password, vpnName, vpnPassword);
            navigate("/");
        } catch (err: any) {
            setError(err?.message || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Reset form and go back to VPN step
    const handleBack = () => {
        setStep(1);
        setError('');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl p-8 shadow-[8px_8px_16px_#d1d1d1,_-8px_-8px_16px_#ffffff]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600">StudiDBv2</h1>
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

                {/* Step indicator */}
                <div className="flex mb-6 justify-center">
                    <div className={`h-2 w-12 rounded-full mr-2 ${step === 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    <div className={`h-2 w-12 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                </div>

                {/* Step 1: VPN Credentials */}
                {step === 1 && (
                    <>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">VPN Authentication</h2>
                        <form onSubmit={handleVpnSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="vpnName" className="block text-sm font-medium text-gray-700 mb-1">
                                    VPN Name
                                </label>
                                <input
                                    id="vpnName"
                                    type="text"
                                    value={vpnName}
                                    onChange={(e) => setVpnName(e.target.value)}
                                    className="w-full p-3 bg-gray-50 rounded-lg shadow-[inset_3px_3px_6px_#d1d1d1,_inset_-3px_-3px_6px_#ffffff] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your VPN name"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="vpnPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    VPN Password
                                </label>
                                <input
                                    id="vpnPassword"
                                    type="password"
                                    value={vpnPassword}
                                    onChange={(e) => setVpnPassword(e.target.value)}
                                    className="w-full p-3 bg-gray-50 rounded-lg shadow-[inset_3px_3px_6px_#d1d1d1,_inset_-3px_-3px_6px_#ffffff] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your VPN password"
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
                                    {isLoading ? 'Authenticating...' : 'Connect to VPN'}
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {/* Step 2: Student Credentials */}
                {step === 2 && (
                    <>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Student Login</h2>
                        <form onSubmit={handleStudentSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                    Student ID
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

                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="w-1/3 p-3 bg-gray-200 text-gray-700 rounded-lg transition-all duration-300 shadow-[5px_5px_10px_#d1d1d1,_-5px_-5px_10px_#ffffff] hover:bg-gray-300 hover:shadow-[2px_2px_5px_#d1d1d1,_-2px_-2px_5px_#ffffff] flex justify-center items-center"
                                >
  <span className="flex items-center gap-2">
    <svg
        id="back-icon"
        className="h-[0.8em]"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M26.105,21.891c-0.229,0-0.439-0.131-0.529-0.346l0,0c-0.066-0.156-1.716-3.857-7.885-4.59
        c-1.285-0.156-2.824-0.236-4.693-0.25v4.613c0,0.213-0.115,0.406-0.304,0.508c-0.188,0.098-0.413,0.084-0.588-0.033L0.254,13.815
        C0.094,13.708,0,13.528,0,13.339c0-0.191,0.094-0.365,0.254-0.477l11.857-7.979c0.175-0.121,0.398-0.129,0.588-0.029
        c0.19,0.102,0.303,0.295,0.303,0.502v4.293c2.578,0.336,13.674,2.33,13.674,11.674c0,0.271-0.191,0.508-0.459,0.562
        C26.18,21.891,26.141,21.891,26.105,21.891z"/>
    </svg>
    Back
  </span>
                                </button>


                                <button
                                    type="submit"
                                    disabled={isLoading || loading}
                                    className={`w-2/3 p-3 bg-blue-600 text-white rounded-lg transition-all duration-300 
                                    ${(isLoading || loading)
                                        ? 'opacity-70 cursor-not-allowed'
                                        : 'shadow-[5px_5px_10px_#d1d1d1,_-5px_-5px_10px_#ffffff] hover:bg-blue-700 hover:shadow-[2px_2px_5px_#d1d1d1,_-2px_-2px_5px_#ffffff]'
                                    }`}
                                >
                                    {isLoading || loading ? 'Logging in...' : 'Login'}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default LoginView;