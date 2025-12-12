import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { register, reset } from '../../features/auth/authSlice';

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    password2: string; 
}

const Register: React.FC = () => {
    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
        email: '',
        password: '',
        password2: '',
    });

    const { name, email, password, password2 } = formData;

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { user, isLoading, isError, isSuccess, message } = useAppSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            console.error('Error de registro:', message);
        }
        if (isSuccess || user) {
            navigate('/');
        }
        dispatch(reset()); 
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== password2) {
            alert('Las contraseñas no coinciden.');
        } else {
            const userData = {
                name,
                email,
                password,
            };
            dispatch(register(userData));
        }
    };

    if (isLoading) {
        return <h1 className="text-xl text-center mt-8">Cargando...</h1>;
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
                    Registrate
                </h1>
                <p className="text-center text-gray-600 mb-6">
					Crea una cuenta para empezar a usar la aplicacion
				</p>

                {isError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        Error: {message}
                    </div>
                )}
                <form onSubmit={onSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        value={name}
                        placeholder="Nombre Completo"
                        onChange={onChange}
                        className="w-full p-3 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={email}
                        placeholder="Correo Electronico"
                        onChange={onChange}
                        className="w-full p-3 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={password}
                        placeholder="Contraseña"
                        onChange={onChange}
                        className="w-full p-3 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                    <input
                        type="password"
                        name="password2"
                        value={password2}
                        placeholder="Confirmar Contraseña"
                        onChange={onChange}
                        className="w-full p-3 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded hover:bg-indigo-700 transition duration-200"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registrando...' : 'Registrarme'}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    ¿Ya tienes cuenta? 
					<a href="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
						Inicia sesion
					</a>
                </p>
            </div>
        </div>
    );
}

export default Register;