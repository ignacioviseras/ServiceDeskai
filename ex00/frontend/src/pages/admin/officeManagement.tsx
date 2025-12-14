import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createOffice, deleteOffice } from '../../features/offices/officeSlice';
import { OfficeData } from '../../features/offices/officeService'; 

const OfficeManagement: React.FC = () => {
    const dispatch = useAppDispatch();
    const { offices, isLoading, isError, message } = useAppSelector((state) => state.offices);
    
    const [formData, setFormData] = useState<OfficeData>({ 
        number: '', 
        city: '',
        country: '',
        direction: '', 
        description: '',
    }); 
    const { number, city, country, direction } = formData; 

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(createOffice(formData)); 
        setFormData({ number: '', city: '', country: '', direction: '', description: '' }); 
    };

    const handleDelete = (id: string) => {
        if (window.confirm('¿Estas seguro de que quieres eliminar esta oficina?')) {
            dispatch(deleteOffice(id));
        }
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-indigo-700">
                gestion de oficinas
            </h1>
            
            {isError &&
                <p className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
                    Error: {message}
                </p>}

            <section className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    Crear Nueva Oficina
                </h2>
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="number"
                        placeholder="Numero o Codigo de Oficina (Ej: BCN-01)"
                        value={number}
                        onChange={onChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="Ciudad"
                        value={city}
                        onChange={onChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                    <input
                        type="text"
                        name="country"
                        placeholder="Pais"
                        value={country}
                        onChange={onChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                    <input
                        type="text"
                        name="direction"
                        placeholder="Direccion Completa (Calle, Codigo Postal, etc.)"
                        value={direction}
                        onChange={onChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                    
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? 'creando...' : 'crear oficina'}
                    </button>
                </form>
            </section>
            
            <section>
                <h2 className="text-xl font-semibold mb-4">
                    lista de oficinas ({offices.length})
                </h2>
                {isLoading && <p>Cargando oficinas...</p>}
                {!isLoading && offices.length > 0 ? (
                    <ul className="space-y-3">
                        {offices.map(office => (
                            <li 
                                key={office._id} 
                                className="bg-gray-50 p-3 rounded border border-gray-200 flex justify-between items-center" // <<-- Modificado para incluir boton
                            >
                                <div>
                                    <span className="font-medium">
                                        Oficina #{office.number} | {office.city}, {office.country}
                                    </span>
                                    <span className="text-sm text-gray-500 block">
                                        Direccion: {office.direction}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDelete(office._id)}
                                    className="bg-red-500 text-white text-sm py-1 px-3 rounded hover:bg-red-600 disabled:opacity-50 ml-4"
                                    disabled={isLoading}
                                >
                                    Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : !isLoading && !isError &&
                    <p className="text-gray-500">
                        no hay oficinas registradas
                    </p>}
            </section>
        </div>
    );
}

export default OfficeManagement;