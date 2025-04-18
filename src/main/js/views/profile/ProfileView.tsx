import React from 'react';
import useAuth from '../../hooks/AuthProvider';
import { User } from 'lucide-react';
import { Layout, NeuCard } from '../components/Layout';

const ProfileView = () => {
    const { data } = useAuth();

    return (
        <Layout>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <NeuCard className="md:col-span-1">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-32 h-32 mb-4 rounded-full bg-gray-200 flex items-center justify-center shadow-[5px_5px_10px_#d1d1d1,_-5px_-5px_10px_#ffffff]">
                            <User size={64} className="text-gray-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-700">{data.userInfo.name}</h3>
                        <p className="text-gray-500">n/a</p>
                        <div className="mt-4 w-full p-3 bg-blue-50 rounded-lg shadow-[inset_3px_3px_6px_#d1d1d1,_inset_-3px_-3px_6px_#ffffff]">
                            <p className="text-gray-500">Fach</p>
                            <p className="font-medium text-gray-800">{data.userSemester.major}</p>
                        </div>
                    </div>
                </NeuCard>

                <NeuCard className="md:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-700">Informationen</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg shadow-[inset_2px_2px_5px_#d1d1d1,_inset_-2px_-2px_5px_#ffffff]">
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium text-gray-800">{data.userInfo.name}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg shadow-[inset_2px_2px_5px_#d1d1d1,_inset_-2px_-2px_5px_#ffffff]">
                                <p className="text-sm text-gray-500">Matrikelnummer</p>
                                <p className="font-medium text-gray-800">n/a</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg shadow-[inset_2px_2px_5px_#d1d1d1,_inset_-2px_-2px_5px_#ffffff]">
                                <p className="text-sm text-gray-500">Fach</p>
                                <p className="font-medium text-gray-800">{data.userSemester.major}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg shadow-[inset_2px_2px_5px_#d1d1d1,_inset_-2px_-2px_5px_#ffffff]">
                                <p className="text-sm text-gray-500">Semester</p>
                                <p className="font-medium text-gray-800">{data.userSemester.semester}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg shadow-[inset_2px_2px_5px_#d1d1d1,_inset_-2px_-2px_5px_#ffffff]">
                                <p className="text-sm text-gray-500">Aktueller Schnitt</p>
                                <p className="font-medium text-gray-800">n/a</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg shadow-[inset_2px_2px_5px_#d1d1d1,_inset_-2px_-2px_5px_#ffffff]">
                                <p className="text-sm text-gray-500">E-Mail</p>
                                <p className="font-medium text-gray-800">{data.userInfo.email}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg shadow-[inset_2px_2px_5px_#d1d1d1,_inset_-2px_-2px_5px_#ffffff]">
                                <p className="text-sm text-gray-500">Telefonnummer</p>
                                <p className="font-medium text-gray-800">{data.userInfo.phone}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg shadow-[inset_2px_2px_5px_#d1d1d1,_inset_-2px_-2px_5px_#ffffff]">
                                <p className="text-sm text-gray-500">Adresse</p>
                                <p className="font-medium text-gray-800">{data.userInfo.address}</p>
                            </div>
                        </div>
                    </div>
                </NeuCard>
            </div>
        </Layout>
    );
};

export default ProfileView;
