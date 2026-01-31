import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import EmployeeDirectory from './pages/Employees/EmployeeDirectory';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<EmployeeDirectory />} />
            {/* On ajoute les routes vides pour éviter les erreurs quand on clique dessus */}
            <Route path="/payroll" element={<div><h1>💰 Paie</h1></div>} />
            <Route path="/leaves" element={<div><h1>📅 Congés</h1></div>} />
            <Route path="/recruitment" element={<div><h1>🤝 Recrutement</h1></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;