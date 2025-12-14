import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getOffices, deleteOffice, reset } from '../../features/offices/officeSlice';
import { Office } from '../../features/offices/officeService';
import OfficeFormModal from '../../components/shared/admin/OfficeFormModal';
import { Plus, Edit, Trash2 } from 'lucide-react'; 

const OfficeManagement: React.FC = () => {
    const dispatch = useAppDispatch();
    const { offices, isLoading, isError, message, isSuccess } = useAppSelector(state => state.offices);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [officeToEdit, setOfficeToEdit] = useState<Office | null>(null);

    useEffect(() => {
        dispatch(getOffices());
        return () => {
            dispatch(reset());
        };
    }, [dispatch]);
    useEffect(() => {
        if (isSuccess) {
            dispatch(getOffices());
            dispatch(reset()); 
        }
    }, [isSuccess, dispatch]);
    const handleOpenCreateModal = () => {
        setOfficeToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (office: Office) => {
        setOfficeToEdit(office);
		setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setOfficeToEdit(null);
    };
    const handleDelete = (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta oficina? Esta acción no se puede deshacer.')) {
            dispatch(deleteOffice(id));
        }
    };
    if (isLoading && offices.length === 0) {
        return <h1 className="text-xl text-center mt-8">Cargando gestión de oficinas...</h1>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-indigo-700">Gestión de Oficinas</h1>
                <button
                    onClick={handleOpenCreateModal}
                    className="flex items-center bg-indigo-600 text-white p-2 rounded-lg shadow-md hover:bg-indigo-700 transition"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Crear Nueva Oficina
                </button>
            </div>

            {isError && (
                <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
                    Error al cargar/modificar: {message}
                </div>
            )}

            {/* Tabla de Oficinas */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">País/Ciudad</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {offices.length === 0 && !isLoading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                    No hay oficinas registradas.
                                </td>
                            </tr>
                        ) : (
                            offices.map((office) => (
                                <tr key={office._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{office._id.slice(-6)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{office.number}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{office.country} / {office.city}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{office.direction}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{office.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleOpenEditModal(office)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                            title="Editar"
                                        >
                                            <Edit className="w-5 h-5 inline" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(office._id)}
                                            className="text-red-600 hover:text-red-900"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-5 h-5 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <OfficeFormModal 
                    officeToEdit={officeToEdit} 
                    onClose={handleCloseModal} 
                />
            )}
        </div>
    );
};

export default OfficeManagement;