import React, { useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard'; 
import OrgChart from './pages/OrgChart/OrgChart'; 
import EmployeeList from './pages/Employees/EmployeeList';
import EmployeeDetail from './pages/Employees/EmployeeDetail';
import EmployeeForm from './pages/Employees/EmployeeForm';
import PayrollPage from './pages/Payroll/PayrollPage';
import Login from './pages/Login/Login';

import './App.css';

// 1. Protection des routes : Si pas de token, retour au Login
const PrivateRoute = ({ children }) => {
  const isAuth = !!localStorage.getItem('access_token');
  return isAuth ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  // 2. CRITIQUE : Restauration de la session au chargement (F5)
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  return (
    <div className="app-layout">
      {/* On cache la Sidebar uniquement sur la page de Login */}
      {!isLoginPage && <Sidebar />}
      
      <main className={!isLoginPage ? "main-content" : "login-content"}>
        <Routes>
          {/* Route Publique : Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Redirection Racine */}
          <Route path="/" element={<Navigate to="/statistics" />} />
          
          {/* --- ROUTES PROTÉGÉES (Nécessitent Connexion) --- */}
          
          {/* C'est ici qu'on corrige l'erreur : on map /my-info vers la liste (filtrée) */}
          <Route path="/my-info" element={<PrivateRoute><EmployeeList /></PrivateRoute>} />

          <Route path="/employees" element={<PrivateRoute><EmployeeList /></PrivateRoute>} />
          <Route path="/employees/new" element={<PrivateRoute><EmployeeForm /></PrivateRoute>} />
          <Route path="/employees/:id" element={<PrivateRoute><EmployeeDetail /></PrivateRoute>} />
          <Route path="/employees/edit/:id" element={<PrivateRoute><EmployeeForm /></PrivateRoute>} />

          <Route path="/statistics" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/org-chart" element={<PrivateRoute><OrgChart /></PrivateRoute>} /> 
          <Route path="/payroll" element={<PrivateRoute><PayrollPage /></PrivateRoute>} />

          {/* Pages en construction */}
          <Route path="/leaves" element={<PrivateRoute><div><h1>📅 Congés</h1><p>En construction...</p></div></PrivateRoute>} />
          <Route path="/recruitment" element={<PrivateRoute><div><h1>🤝 Recrutement</h1><p>En construction...</p></div></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;