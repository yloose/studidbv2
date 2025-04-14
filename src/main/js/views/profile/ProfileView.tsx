import React, { useState } from 'react';
import useAuth from '../../hooks/AuthProvider';
import { User } from 'lucide-react';
import { Layout, NeuCard } from '../components/Layout';

const ProfileView = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        email: `${user?.studentId.toLowerCase()}@university.edu`,
        phone: "123-456-7890",
        address: "123 University Ave, College Town, ST 12345"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In real app, this would update the profile via API call
        // fetch('/api/profile', {
        //   method: 'PUT',
        //   body: JSON.stringify(formData)
        // })

        // Simulate API call
        setTimeout(() => {
            setIsEditing(false);
        }, 500);
    };

    return (
        <Layout>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <NeuCard className="md:col-span-1">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-32 h-32 mb-4 rounded-full bg-gray-200 flex items-center justify-center shadow-[5px_5px_10px_#d1d1d1,_-5px_-5px_10px_#ffffff]">
                            <User size={64} className="text-gray-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-700">{user?.name}</h3>
                        <p className="text-gray-500">{user?.studentId}</p>
                        <div className="mt-4 w-full p-3 bg-blue-50 rounded-lg shadow-[inset_3px_3px_6px_#d1d1d1,_inset_-3px_-3px_6px_#ffffff]">
                            <p className="text-gray-500">Fach</p>
                            <p className="font-medium text-gray-800">{user?.program}</p>
                        </div>
                    </div>
                </NeuCard>

                <NeuCard className="md:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-700">Informationen</h3>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 text-blue-600 rounded-lg bg-white shadow-[3px_3px_6px_#d1d1d1,_-3px_-3px_6px_#ffffff] hover:shadow-[1px_1px_3px_#d1d1d1,_-1px_-1px_3px_#ffffff] transition-all duration-300"
                            >
                                Profil bearbeiten
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-lg shadow-[inset_2px_2px_5px_#d1d1d1,_inset_-2px_-2px_5px_#ffffff]">
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="font-medium text-gray-800">{user?.name}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg shadow-[inset_2px_2px_5px_#d1d1d1,_inset_-2px_-2px_5px_#ffffff]">
                                        <p className="text-sm text-gray-500">Matrikelnummer</p>
                                        <p className="font-medium text-gray-800">{user?.studentId}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg shadow-[inset_2px_2px_5px_#d1d1d1,_inset_-2px_-2px_5px_#ffffff]">
                                        <p className="text-sm text-gray-500">Fach</p>
                                        <p className="font-medium text-gray-800">{user?.program}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg shadow-[inset_2px_2px_5px_#d1d1d1,_inset_-2px_-2px_5px_#ffffff]">
                                        <p className="text-sm text-gray-500">Semester</p>
                                        <p className="font-medium text-gray-800">{user?.year}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={user.mail}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-gray-50 rounded-lg shadow-[inset_3px_3px_6px_#d1d1d1,_inset_-3px_-3px_6px_#ffffff] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={user.phone}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-gray-50 rounded-lg shadow-[inset_3px_3px_6px_#d1d1d1,_inset_-3px_-3px_6px_#ffffff] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={user.address}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-gray-50 rounded-lg shadow-[inset_3px_3px_6px_#d1d1d1,_inset_-3px_-3px_6px_#ffffff] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 text-gray-600 rounded-lg bg-white shadow-[3px_3px_6px_#d1d1d1,_-3px_-3px_6px_#ffffff] hover:shadow-[1px_1px_3px_#d1d1d1,_-1px_-1px_3px_#ffffff] transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-[3px_3px_6px_#d1d1d1,_-3px_-3px_6px_#ffffff] hover:bg-blue-700 hover:shadow-[1px_1px_3px_#d1d1d1,_-1px_-1px_3px_#ffffff] transition-all duration-300"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg shadow-[inset_2px_2px_5px_#d1d1d1,_inset_-2px_-2px_5px_#ffffff]">
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-medium text-gray-800">{user?.name}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg shadow-[inset_2px_2px_5px_#d1d1d1,_inset_-2px_-2px_5px_#ffffff]">
                                    <p className="text-sm text-gray-500">Matrikelnummer</p>
                                    <p className="font-medium text-gray-800">{user?.studentId}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg shadow-[inset_2px_2px_5px_#d1d1d1,_inset_-2px_-2px_5px_#ffffff]">
                                    <p className="text-sm text-gray-500">Fach</p>
                                    <p className="font-medium text-gray-800">{user?.program}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg shadow-[inset_2px_2px_5px_#d1d1d1,_inset_-2px_-2px_5px_#ffffff]">
                                    <p className="text-sm text-gray-500">Semester</p>
                                    <p className="font-medium text-gray-800">{user?.year}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg shadow-[inset_2px_2px_5px_#d1d1d1,_inset_-2px_-2px_5px_#ffffff]">
                                    <p className="text-sm text-gray-500">Aktueller Schnitt</p>
                                    <p className="font-medium text-gray-800">{user?.gpa}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg shadow-[inset_2px_2px_5px_#d1d1d1,_inset_-2px_-2px_5px_#ffffff]">
                                    <p className="text-sm text-gray-500">E-Mail</p>
                                    <p className="font-medium text-gray-800">{user.mail}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg shadow-[inset_2px_2px_5px_#d1d1d1,_inset_-2px_-2px_5px_#ffffff]">
                                    <p className="text-sm text-gray-500">Telefonnummer</p>
                                    <p className="font-medium text-gray-800">{user.phone}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg shadow-[inset_2px_2px_5px_#d1d1d1,_inset_-2px_-2px_5px_#ffffff]">
                                    <p className="text-sm text-gray-500">Adresse</p>
                                    <p className="font-medium text-gray-800">{user.address}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </NeuCard>
            </div>
        </Layout>
    );
};

export default ProfileView;