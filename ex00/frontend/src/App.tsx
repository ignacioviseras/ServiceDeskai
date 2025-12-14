import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Layout from './components/shared/Layout';
import RoleGuard from './components/shared/RoleGuard'; 
import AdminDashboard from './pages/admin/AdminDashboard'; 
import ServiceDeskDashboard from './pages/servicedesk/ServiceDeskDashboard';
import StandardDashboard from './pages/user/StandardDashboard'; 
import { useAppSelector } from './app/hooks';
import TicketSubmission from './pages/user/TicketSubmission';
import TicketOpenList from './pages/servicedesk/TicketOpenList';
import TicketHistory from './pages/user/TicketHistory';
import OfficeManagement from './pages/admin/officeManagement';
import './index.css';

const DashboardRouter = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  if (!user)
    return null;

  switch (user.role.toLowerCase()) {
    case 'admin':
      return <AdminDashboard />;
    case 'service_desk':
      return <ServiceDeskDashboard />;
    case 'standard':
    default:
      return <StandardDashboard />;
  }
};


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={<Layout />}>
        <Route 
          index
          element={
            <RoleGuard allowedRoles={['standard', 'service_desk', 'admin']}>
              <DashboardRouter /> 
            </RoleGuard>
          } 
        />
        
        <Route 
          path="reports"
          element={
            <RoleGuard allowedRoles={['standard', 'admin']}>
              <TicketHistory /> 
            </RoleGuard>
          } 
        />
        <Route 
          path="admin/offices" 
          element={
            <RoleGuard allowedRoles={['admin']}>
              <OfficeManagement />
            </RoleGuard>
          } 
        />
        <Route 
          path="reports/new"
          element={
            <RoleGuard allowedRoles={['standard', 'admin']}>
              <TicketSubmission />
            </RoleGuard>
          } 
        />
        <Route 
          path="tickets/open"
          element={
            <RoleGuard allowedRoles={['service_desk', 'admin']}>
              <TicketOpenList />
            </RoleGuard>
          } 
        />
        <Route 
          path="tickets/:id"
          element={
            <RoleGuard allowedRoles={['service_desk', 'admin']}>
              <h2 className="mt-5 text-lg">Detalle del Tickete</h2>
            </RoleGuard>
          }
        />

        <Route 
          path="admin/offices" 
          element={
            <RoleGuard allowedRoles={['admin']}>
              <h2 className="mt-5 text-lg">pagina de Gestion de Oficinas</h2> 
            </RoleGuard>
          } 
        />
        <Route 
          path="admin/users" 
          element={
            <RoleGuard allowedRoles={['admin']}>
              <h2 className="mt-5 text-lg">pagina de Gestion de Usuarios</h2> 
            </RoleGuard>
          } 
        />

      </Route>

      <Route path="*" element={<h1 className="text-center mt-10 text-3xl font-bold">404 | Pagina no encontrada</h1>} />
    </Routes>
  );
}

export default App;