import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createOffice, updateOffice } from '../../../features/offices/officeSlice';
import { Office } from '../../../features/offices/officeService';
import { X } from 'lucide-react';

interface OfficeFormData {
    city: string;
    direction: string;
    description: string;
    number: string;
    country: string;
}

interface OfficeFormModalProps {
    officeToEdit: Office | null;
    onClose: () => void;
}

const OfficeFormModal: React.FC<OfficeFormModalProps> = ({ officeToEdit, onClose }) => {
    const dispatch = useAppDispatch();
    const { isLoading: isOfficeLoading, isSuccess: isOfficeSuccess } = useAppSelector(state => state.offices);

    const isEditMode = !!officeToEdit;

    const [formData, setFormData] = useState<OfficeFormData>({
        city: officeToEdit?.city || '',
        direction: officeToEdit?.direction || '',
        description: officeToEdit?.description || '',
        number: officeToEdit?.number || '',
        country: officeToEdit?.country || '',
    });

    useEffect(() => {
        if (isEditMode && officeToEdit) {
            setFormData({
                city: officeToEdit.city,
                direction: officeToEdit.direction,
                description: officeToEdit.description || '',
                number: officeToEdit.number || '',
                country: officeToEdit.country || '',
            });
        }
    }, [isEditMode, officeToEdit]);

    useEffect(() => {
        if (isOfficeSuccess) {
            onClose();
        }
    }, [isOfficeSuccess, onClose]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditMode) {
            const updatedData = {
                id: officeToEdit!._id,
                ...formData
            };
            dispatch(updateOffice(updatedData));
        } else {
            dispatch(createOffice(formData));
        }
    };

    const isSubmitting = isOfficeLoading;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-indigo-700">
                        {isEditMode ? 'Editar Oficina' : 'Crear Nueva Oficina'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-4">

                    {/* ⭐️ CAMPO NUMBER */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Número de Oficina</label>
                        <input
                            type="text"
                            name="number"
                            value={formData.number}
                            onChange={onChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">País</label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={onChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Ciudad</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={onChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Dirección Completa</label>
                        <input
                            type="text"
                            name="direction"
                            value={formData.direction}
                            onChange={onChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={onChange}
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        ></textarea>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 disabled:bg-gray-400"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear Oficina'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OfficeFormModal;