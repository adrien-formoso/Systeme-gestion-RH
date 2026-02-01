import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard'; // C'est ton composant de stats actuel
import EmployeeDirectory from './pages/Employees/EmployeeDirectory';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            {/* Redirection de la racine vers les Statistiques pour éviter la page blanche au démarrage */}
            <Route path="/" element={<Navigate to="/statistics" />} />
            
            {/* Module de gestion des employés */}
            <Route path="/employees" element={<EmployeeDirectory />} />
            
            {/* Module de gestion des congés et absences */}
            <Route path="/leaves" element={<div><h1>📅 Congés & Absences</h1><p>Module en cours de développement...</p></div>} />
            
            {/* Module de gestion du recrutement */}
            <Route path="/recruitment" element={<div><h1>🤝 Recrutement</h1><p>Module en cours de développement...</p></div>} />
            
            {/* Module paie simplifiée */}
            <Route path="/payroll" element={<div><h1>💰 Paie</h1><p>Module en cours de développement...</p></div>} />
            
            {/* Module organigramme et reporting : Interface Statistiques */}
            <Route path="/statistics" element={<Dashboard />} />
            
            {/* Module organigramme et reporting : Interface Organigramme */}
            <Route path="/org-chart" element={<div><h1>🌳 Organigramme</h1><p>Module en cours de développement...</p></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;