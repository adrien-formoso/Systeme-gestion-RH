import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard'; 
import OrgChart from './pages/OrgChart/OrgChart'; 
// On utilise les nouveaux noms de fichiers pour la clarté
import EmployeeList from './pages/Employees/EmployeeList';
import EmployeeDetail from './pages/Employees/EmployeeDetail';
import EmployeeForm from './pages/Employees/EmployeeForm';

import './App.css';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            {/* Redirection automatique vers les stats au lancement */}
            <Route path="/" element={<Navigate to="/statistics" />} />
            
            {/* MODULE COLLABORATEURS (Gestion complète) */}
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/employees/new" element={<EmployeeForm />} />
            <Route path="/employees/:id" element={<EmployeeDetail />} />
            <Route path="/employees/edit/:id" element={<EmployeeForm />} />

            {/* MODULES ANALYTIQUES ET HIÉRARCHIE */}
            <Route path="/statistics" element={<Dashboard />} />
            <Route path="/org-chart" element={<OrgChart />} /> 

            {/* MODULES EN DÉVELOPPEMENT */}
            <Route path="/leaves" element={<div><h1>📅 Congés & Absences</h1><p>Module en cours de développement...</p></div>} />
            <Route path="/recruitment" element={<div><h1>🤝 Recrutement</h1><p>Module en cours de développement...</p></div>} />
            <Route path="/payroll" element={<div><h1>💰 Paie</h1><p>Module en cours de développement...</p></div>} />
            
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;