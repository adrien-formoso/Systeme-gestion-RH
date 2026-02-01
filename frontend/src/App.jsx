import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard'; 
import EmployeeDirectory from './pages/Employees/EmployeeDirectory';
import OrgChart from './pages/OrgChart/OrgChart'; // <-- AJOUTER CET IMPORT
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/statistics" />} />
            <Route path="/employees" element={<EmployeeDirectory />} />
            <Route path="/leaves" element={<div><h1>📅 Congés & Absences</h1><p>Module en cours de développement...</p></div>} />
            <Route path="/recruitment" element={<div><h1>🤝 Recrutement</h1><p>Module en cours de développement...</p></div>} />
            <Route path="/payroll" element={<div><h1>💰 Paie</h1><p>Module en cours de développement...</p></div>} />
            
            <Route path="/statistics" element={<Dashboard />} />
  
            <Route path="/org-chart" element={<OrgChart />} /> 
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;