import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Euro, Calculator, Download, Save, User, Calendar, 
  FileText, TrendingUp, DollarSign 
} from 'lucide-react';
import './PayrollPage.css';

const PayrollPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- ÉTATS DU FORMULAIRE (SIMULATION) ---
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Mois actuel
  const [year, setYear] = useState(new Date().getFullYear());
  
  // Variables de paie
  const [baseSalary, setBaseSalary] = useState(0);
  const [bonuses, setBonuses] = useState(0);
  const [overtimeHours, setOvertimeHours] = useState(0);
  
  // Constantes de taux (Fixes pour simulation)
  const RATE_EMPLOYEE = 0.23; // ~23% charges salariales
  const RATE_EMPLOYER = 0.42; // ~42% charges patronales
  const RATE_OVERTIME = 1.25; // +25% majoration

  // --- CHARGEMENT INITIAL ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, payRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/hr/employees/'),
          axios.get('http://127.0.0.1:8000/api/hr/payrolls/')
        ]);
        setEmployees(empRes.data);
        setPayrolls(payRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur API", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- QUAND ON SÉLECTIONNE UN EMPLOYÉ ---
  useEffect(() => {
    if (selectedEmpId) {
      const emp = employees.find(e => e.id === parseInt(selectedEmpId));
      if (emp) {
        setBaseSalary(parseFloat(emp.salary_brut) || 0);
        // Reset des variables
        setBonuses(0);
        setOvertimeHours(0);
      }
    }
  }, [selectedEmpId, employees]);

  // --- MOTEUR DE CALCUL (Temps Réel) ---
  const hourlyRate = baseSalary / 151.67; // Base 35h
  const overtimeAmount = overtimeHours * hourlyRate * RATE_OVERTIME;
  const grossTotal = baseSalary + bonuses + overtimeAmount;
  
  const employeeContrib = grossTotal * RATE_EMPLOYEE;
  const netSalary = grossTotal - employeeContrib;
  
  const employerContrib = grossTotal * RATE_EMPLOYER;
  const totalCost = grossTotal + employerContrib;

  // --- SAUVEGARDE & PDF ---
  const handleGenerate = async () => {
    if (!selectedEmpId) return alert("Veuillez sélectionner un employé.");

    // CORRECTION : Mapping des noms de champs pour correspondre à models.py
    const payload = {
      employee: selectedEmpId,
      month: parseInt(month),
      year: parseInt(year),
      
      // Backend (Django) : Frontend (React)
      gross_salary: grossTotal.toFixed(2),        // Backend attend gross_salary
      total_bonuses: bonuses.toFixed(2),          // Backend attend total_bonuses
      total_deductions: employeeContrib.toFixed(2), // Backend attend total_deductions
      net_salary: netSalary.toFixed(2)
    };

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/hr/payrolls/', payload);
      alert("Bulletin généré avec succès !");
      
      // Recharger la liste des bulletins
      const updatedList = await axios.get('http://127.0.0.1:8000/api/hr/payrolls/');
      setPayrolls(updatedList.data);

      // Ouvrir le PDF
      if(window.confirm("Télécharger le PDF maintenant ?")) {
          window.open(`http://127.0.0.1:8000/api/hr/payrolls/${res.data.id}/pdf/`, '_blank');
      }
    } catch (err) {
      console.error(err);
      console.error("Détail erreur serveur:", err.response?.data);
      alert("Erreur lors de la génération. Vérifiez la console (F12).");
    }
  };

  if (loading) return <div className="page-container">Chargement...</div>;

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Module Paie Simplifiée</h1>
          <p style={{color: 'var(--color-text-muted)', marginTop: '4px'}}>Calcul et génération de bulletins mensuels</p>
        </div>
      </header>

      {/* --- ZONE DE TRAVAIL (SPLIT SCREEN) --- */}
      <div className="payroll-layout">
        
        {/* 1. PANNEAU DE CONFIGURATION (GAUCHE) */}
        <div className="card config-panel">
          <h3 className="section-title"><User size={18}/> Sélection & Période</h3>
          
          <div className="form-group" style={{marginBottom: '20px'}}>
            <label>Collaborateur</label>
            <select value={selectedEmpId} onChange={(e) => setSelectedEmpId(e.target.value)} className="big-select">
              <option value="">-- Choisir un employé --</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>
                  {e.lastname} {e.firstname} — {e.job_assignments?.[0]?.job_role_detail?.name || 'N/A'}
                </option>
              ))}
            </select>
          </div>

          <div className="grid-2">
            <div className="form-group">
                <label>Mois</label>
                <select value={month} onChange={(e) => setMonth(e.target.value)}>
                    {Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>{new Date(0, m-1).toLocaleString('fr-FR', {month:'long'})}</option>)}
                </select>
            </div>
            <div className="form-group">
                <label>Année</label>
                <input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
            </div>
          </div>

          <div className="divider"></div>

          <h3 className="section-title"><Calculator size={18}/> Variables du mois</h3>
          <div className="form-group">
            <label>Salaire de base (Brut)</label>
            <div className="input-icon">
                <input type="number" value={baseSalary} onChange={(e) => setBaseSalary(parseFloat(e.target.value) || 0)} />
                <span className="unit">€</span>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
                <label>Heures Supp. (Nb)</label>
                <input type="number" value={overtimeHours} onChange={(e) => setOvertimeHours(parseFloat(e.target.value) || 0)} />
            </div>
            <div className="form-group">
                <label>Primes (€)</label>
                <input type="number" value={bonuses} onChange={(e) => setBonuses(parseFloat(e.target.value) || 0)} />
            </div>
          </div>

          <button className="btn-primary full-width-btn" onClick={handleGenerate}>
            <Save size={18}/> Valider et Générer PDF
          </button>
        </div>

        {/* 2. PANNEAU APERÇU (DROITE) */}
        <div className="card preview-panel">
          <div className="preview-header">
            <div className="preview-title">SIMULATION NET À PAYER</div>
            <div className="preview-amount">{netSalary.toFixed(2)} €</div>
          </div>

          <div className="preview-body">
            <div className="line-item">
                <span>Salaire Base</span>
                <span>{baseSalary.toFixed(2)} €</span>
            </div>
            <div className="line-item">
                <span>Heures Supp. (+25%)</span>
                <span>{overtimeAmount.toFixed(2)} €</span>
            </div>
            <div className="line-item">
                <span>Primes</span>
                <span>{bonuses.toFixed(2)} €</span>
            </div>
            
            <div className="line-item subtotal">
                <span>TOTAL BRUT</span>
                <span>{grossTotal.toFixed(2)} €</span>
            </div>

            <div className="line-item">
                <span>Cotisations Salariales (23%)</span>
                <span className="negative">- {employeeContrib.toFixed(2)} €</span>
            </div>
            
            <div className="line-item highlight">
                <span>NET AVANT IMPÔT</span>
                <span>{netSalary.toFixed(2)} €</span>
            </div>

            <div className="employer-cost-block">
                <span><TrendingUp size={14}/> Coût total employeur estimé</span>
                <strong>{totalCost.toFixed(2)} €</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. HISTORIQUE DES BULLETINS */}
      <h3 className="section-title" style={{marginTop: '40px'}}><FileText size={18}/> Historique des bulletins générés</h3>
      <div className="card table-card">
        <table className="employee-table">
            <thead>
                <tr>
                    <th>Période</th>
                    <th>Employé</th>
                    <th>Salaire Brut</th>
                    <th>Net Payé</th>
                    <th>Coût Patronal</th>
                    <th style={{textAlign: 'right'}}>Document</th>
                </tr>
            </thead>
            <tbody>
                {payrolls.map(p => (
                    <tr key={p.id}>
                        <td><span className="period-badge">{p.month}/{p.year}</span></td>
                        {/* Utilisation des nouveaux champs du Serializer */}
                        <td><strong>{p.employee_lastname} {p.employee_firstname}</strong></td>
                        <td>{p.gross_salary} €</td>
                        <td><span className="status-pill active">{p.net_salary} €</span></td>
                        <td style={{color: 'var(--color-text-muted)'}}>{p.total_deductions} €</td>
                        <td style={{textAlign: 'right'}}>
                            <button 
                                className="btn-outline" 
                                style={{padding: '6px 12px'}}
                                onClick={() => window.open(`http://127.0.0.1:8000/api/hr/payrolls/${p.id}/pdf/`, '_blank')}
                            >
                                <Download size={14}/> PDF
                            </button>
                        </td>
                    </tr>
                ))}
                {payrolls.length === 0 && <tr><td colSpan="6" style={{textAlign:'center', padding:'30px'}}>Aucun historique.</td></tr>}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollPage;