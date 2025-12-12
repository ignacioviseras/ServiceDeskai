import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { Navigate } from 'react-router-dom';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: Array<'standard' | 'service_desk' | 'admin'>;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
    const { user, isLoading } = useAppSelector((state) => state.auth);

    if (isLoading)
        return <h1 className="text-center mt-10 text-xl">cargando autenticacion...</h1>; 
    if (!user)
        return <Navigate to="/login" replace />;
    if (!allowedRoles.includes(user.role.toLowerCase() as any)) {
        return (
            <div className="p-8 text-center bg-red-100 mt-10 mx-auto max-w-lg rounded-lg">
                <h1 className="text-2xl font-bold text-red-700">
					acceso denegado
				</h1>
                <p className="mt-2 text-red-600">
					no tienes permisos suficientes para ver esta pagina
				</p>
                <Navigate to="/" replace />
            </div>
        );
    }
    return <>{children}</>;
};

export default RoleGuard;