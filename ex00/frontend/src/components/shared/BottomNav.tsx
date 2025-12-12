import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';

// Define las propiedades que recibira el componente
interface BottomNavProps {
  userRole: string;
}

// Interfaz para def inir la estructura de un item de navegacion
interface NavItem {
  id: number;
  label: string;
  icon: string; // En un proyecto real, usarias iconos SVG o de libreria (ej. FontAwesome)
  to: string;
  roles: string[]; // Roles que pueden ver este item
}

// 🌟 Definicion de todos los items de navegacion
const navItems: NavItem[] = [
	//all
	{ id: 1, label: 'Inicio', icon: '🏠', to: '/', roles: ['standard', 'service_desk', 'admin'] },

	//only 'standard'
	{ id: 2, label: 'Reportar', icon: '🚨', to: '/reports/new', roles: ['standard'] }, 
	{ id: 3, label: 'Mis Reportes', icon: '📋', to: '/reports', roles: ['standard'] },

	//only 'service_desk', 'admin'
	{ id: 4, label: 'Tickets Abiertos', icon: '🎫', to: '/tickets/open', roles: ['service_desk', 'admin'] },

	//only 'admin'
	{ id: 5, label: 'Oficinas', icon: '🏢', to: '/admin/offices', roles: ['admin'] },
	{ id: 6, label: 'Usuarios', icon: '👥', to: '/admin/users', roles: ['admin'] },
];

const BottomNav: React.FC<BottomNavProps> = ({ userRole }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); // Despachar la accion de logout
    navigate('/login'); // Redirigir al login
  };

  // Filtrar los items que el rol actual debe ver
  const visibleItems = navItems.filter(item => 
    item.roles.includes(userRole.toLowerCase())
  );

  return (
    <nav className="bg-white border-t border-gray-200 shadow-xl p-2">
      <div className="flex justify-around items-center h-14 max-w-xl mx-auto">
        
        {visibleItems.map(item => (
          <NavLink 
            key={item.id}
            to={item.to}
            className={({ isActive }) => 
              `flex flex-col items-center text-xs transition-colors duration-200 p-1 
              ${isActive ? 'text-indigo-600 font-bold' : 'text-gray-500 hover:text-indigo-500'}`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="mt-1">{item.label}</span>
          </NavLink>
        ))}

        {/* Boton de Logout (Visible para todos los logueados) */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center text-xs text-gray-500 hover:text-red-500 transition-colors duration-200 p-1"
        >
          <span className="text-xl">🚪</span>
          <span className="mt-1">Salir</span>
        </button>

      </div>
    </nav>
  );
};

export default BottomNav;