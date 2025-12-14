import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';

interface BottomNavProps {
  userRole: string;
}

interface NavItem {
  id: number;
  label: string;
  icon: string;
  to: string;
  roles: string[];
}
const navItems: NavItem[] = [
	{ id: 1, label: 'Inicio', icon: '🏠', to: '/', roles: ['standard', 'service_desk', 'admin'] },
	{ id: 2, label: 'Reportar', icon: '🚨', to: '/reports/new', roles: ['standard', 'admin'] }, 
	{ id: 3, label: 'Mis Reportes', icon: '📋', to: '/reports', roles: ['standard', 'admin'] },
	{ id: 4, label: 'Tickets Abiertos', icon: '🎫', to: '/tickets/open', roles: ['service_desk', 'admin'] },
	{ id: 5, label: 'Oficinas', icon: '🏢', to: '/admin/offices', roles: ['admin'] },
	{ id: 6, label: 'Usuarios', icon: '👥', to: '/admin/users', roles: ['admin'] },
];

const BottomNav: React.FC<BottomNavProps> = ({ userRole }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

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