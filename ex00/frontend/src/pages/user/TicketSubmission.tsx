import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { createTicket, reset } from '../../features/tickets/ticketSlice';
import { getOffices } from '../../features/offices/officeSlice';
import { TicketData } from '../../features/tickets/ticketService';
import iaService from '../../features/ia/iaGenerator';

interface TicketFormState extends TicketData {
    photo: string | null;
}

const TicketSubmission: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isSuccess, isLoading, isError, message } = useAppSelector(state => state.tickets);
    const { offices } = useAppSelector(state => state.offices);
    const [formData, setFormData] = useState<TicketFormState>({
        title: '',
        description: '',
        office: '',
        photo: null,
    });
    const { title, description, office, photo } = formData;
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    useEffect(() => {
        dispatch(getOffices());
    }, [dispatch]);
    useEffect(() => {
        if (isSuccess) {
            dispatch(reset());
            navigate('/reports');
        }
        if (isError) {
            console.error("Error creating ticket:", message);
        }
    }, [isSuccess, isError, message, dispatch, navigate]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;

        if (!file) {
            setFormData(prev => ({ ...prev, photo: null }));
            return;
        }
        const base64String = await new Promise<string | null>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
            reader.onerror = () => {
                resolve(null);
            };
            reader.readAsDataURL(file); 
        });
        if (!base64String) {
            alert("Error al leer el archivo. Intenta con otra imagen.");
            setFormData(prev => ({ ...prev, photo: null }));
            return;
        }
        setFormData(prev => ({ 
            ...prev, 
            photo: base64String,
            description: 'Analizando imagen...'
        }));
        setIsAnalyzing(true);
        try {
            const aiDescription = await iaService.analyzeImage(file);
            setFormData(prev => ({
                ...prev,
                description: aiDescription
            }));
        } catch (error) {
            console.error(error);
            alert("No se pudo analizar la imagen. Por favor escribe la descripción manualmente.");
            setFormData(prev => ({ ...prev, description: '' }));
        } finally {
            setIsAnalyzing(false);
        }
    };
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !office || !photo) {
            alert('Por favor completa todos los campos.');
            return;
        }
        dispatch(createTicket(formData));
    };
    if (isLoading)
        return <div className="text-center mt-10">Enviando ticket...</div>;
    return (
        <div className="p-4 max-w-xl mx-auto pb-24">
            <h1 className="text-3xl font-bold mb-6 text-indigo-700">
                Nuevo Reporte
            </h1>
            <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <div>
                    <label className="block text-gray-700 font-bold mb-2">
                        Oficina
                    </label>
                    <select
                        name="office"
                        value={office}
                        onChange={onChange}
                        className="w-full p-3 border border-gray-300 rounded bg-white"
                        required
                    >
                        <option value="">Selecciona una oficina</option>
                        {offices.map(off => (
                            <option key={off._id} value={off._id}>
                                {off.city} - {off.direction}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 font-bold mb-2">
                        Foto (IA Analizará)
                    </label>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={onFileChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {isAnalyzing &&
                        <p className="text-blue-500 text-sm mt-1 animate-pulse">
                            La IA está analizando la imagen...
                        </p>
                    }
                </div>
                <div>
                    <label className="block text-gray-700 font-bold mb-2">Título</label>
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={onChange}
                        className="w-full p-3 border border-gray-300 rounded"
                        placeholder="Ej: Puerta rota"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-bold mb-2">
                        Descripción
                    </label>
                    <textarea
                        name="description"
                        value={description}
                        onChange={onChange}
                        rows={5}
                        className="w-full p-3 border border-gray-300 rounded"
                        placeholder={isAnalyzing ? "Esperando análisis..." : "Describe el problema..."}
                        disabled={isAnalyzing}
                        required
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded hover:bg-indigo-700 disabled:bg-gray-400"
                    disabled={isAnalyzing || isLoading}
                >
                    Enviar Reporte
                </button>
            </form>
        </div>
    );
};

export default TicketSubmission;