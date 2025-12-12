import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useAppSelector } from '../../app/hooks';

const Layout: React.FC = () => {
    const { user, isLoading } = useAppSelector((state) => state.auth);

    if (isLoading)
		return null;
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow pb-20"> {/* nav fija */}
                <Outlet /> {/* renderiza ruta anidada */}
            </main>
            
            {/* La barra se ve si el uset esta autenticado */}
            {user && (
                <div className="fixed bottom-0 left-0 right-0 z-10">
                    {/* filtra el contenido por rol */}
                    <BottomNav userRole={user.role} />
                </div>
            )}
        </div>
    );
}

export default Layout;