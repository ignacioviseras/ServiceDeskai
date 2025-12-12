import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login, reset } from '../../features/auth/authSlice';

const Spinner = () => <div className="text-center p-4">Cargando...</div>; 
const ErrorMessage = ({ message }: { message: string }) => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
        {message}
    </div>
);

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;
    
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user, isLoading, isError, message } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (isError)
            console.error(message);
        if (user)
            navigate('/');
        
        dispatch(reset()); 
    }, [user, isError, message, navigate, dispatch]);


    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const userData = {
            email,
            password,
        };

        dispatch(login(userData));
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <section className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    iniciar sesion
                </h1>
                <p className="text-gray-600">
                    accede a tu cuenta para gestionar ticketes
                </p>
            </section>

            <section className="w-full max-w-sm">
                {isError && <ErrorMessage message={message || 'Error desconocido'} />}
                
                <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            placeholder="Introduce tu email"
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            placeholder="Introduce tu contraseña"
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:bg-indigo-400"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Accediendo...' : 'Acceder'}
                        </button>
                    </div>
                </form>
                <p className="text-center text-gray-600 text-sm mt-4">
                    ¿No tienes cuenta? 
                    <a href="/register" className="text-indigo-600 hover:text-indigo-800">
                        Registrate
                    </a>
                </p>
            </section>
        </div>
    );
}

export default Login;