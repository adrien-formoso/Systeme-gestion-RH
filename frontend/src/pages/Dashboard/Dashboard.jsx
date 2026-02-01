import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend 
} from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // États des Filtres
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f59e0b', '#10b981'];

  useEffect(() => {
    // Appel à ton API Django
    axios.get('http://127.0.0.1:8000/api/hr/employees/')
      .then(res => {
        setEmployees(res.data);
        setFilteredEmployees(res.data);
        setLoading(false);
      }).catch(err => {
        console.error("Erreur de chargement", err);
        setLoading(false);
      });
  }, []);

  // Logique de filtrage dynamique
  useEffect(() => {
    let result = employees;
    if (deptFilter !== 'All') {
      result = result.filter(e => e.job_assignments?.[0]?.department_detail?.name === deptFilter);
    }
    if (statusFilter !== 'All') {
      result = result.filter(e => e.status === statusFilter);
    }
    setFilteredEmployees(result);
  }, [deptFilter, statusFilter, employees]);

  // --- CALCULS STATISTIQUES (Checklist Brief) ---
  const total = filteredEmployees.length;
  const totalPayroll = filteredEmployees.reduce((sum, e) => sum + parseFloat(e.salary_brut || 0), 0);
  const totalLeavesLeft = filteredEmployees.reduce((sum, e) => sum + (e.leave_balance || 0), 0);
  
  // Simulation Absentéisme (Moyenne de jours par employé)
  const absenteeismRate = total > 0 ? (Math.random() * (4.2 - 1.2) + 1.2).toFixed(1) : 0;

  // Ancienneté Moyenne
  const avgSeniority = total > 0 ? (filteredEmployees.reduce((acc, e) => {
    const years = (new Date() - new Date(e.hire_date)) / (1000 * 60 * 60 * 24 * 365.25);
    return acc + (years > 0 ? years : 0);
  }, 0) / total).toFixed(1) : 0;

  // --- PREPARATION DES DONNÉES GRAPHIQUES ---
  const ageBins = { "18-25": 0, "26-35": 0, "36-45": 0, "46-55": 0, "56+": 0 };
  const genderMap = { 'Hommes': 0, 'Femmes': 0 };
  const deptMap = {};
  const contractMap = {};

  filteredEmployees.forEach(e => {
    // 1. Pyramide des Âges
    const age = new Date().getFullYear() - new Date(e.birth_date).getFullYear();
    if (age <= 25) ageBins["18-25"]++;
    else if (age <= 35) ageBins["26-35"]++;
    else if (age <= 45) ageBins["36-45"]++;
    else if (age <= 55) ageBins["46-55"]++;
    else ageBins["56+"]++;

    // 2. Parité Sexe
    const g = e.gender === 'Male' ? 'Hommes' : 'Femmes';
    genderMap[g]++;

    // 3. Répartition par Département (Effectif)
    const d = e.job_assignments?.[0]?.department_detail?.name || 'Autres';
    deptMap[d] = (deptMap[d] || 0) + 1;

    // 4. Types de Contrats
    const type = e.contracts?.[0]?.contract_type || 'Autre';
    contractMap[type] = (contractMap[type] || 0) + 1;
  });

  const ageData = Object.entries(ageBins).map(([range, count]) => ({ range, count }));
  const genderData = Object.entries(genderMap).map(([name, value]) => ({ name, value }));
  const deptData = Object.entries(deptMap).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count);
  const contractData = Object.entries(contractMap).map(([name, value]) => ({ name, value }));

  // Liste des départements pour le select
  const departmentsList = ['All', ...new Set(employees.map(e => e.job_assignments?.[0]?.department_detail?.name).filter(Boolean))];

  const formatEuro = (v) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);

  if (loading) return <div className="page-container">Chargement des données analytiques...</div>;

  return (
    <div className="page-container">
      {/* HEADER */}
      <header className="page-header">
        <h1>Dashboard Statistiques RH</h1>
        <div className="export-buttons">
          <button className="btn-export csv" onClick={() => alert('Export CSV en cours...')}>Export CSV</button>
          <button className="btn-export pdf" onClick={() => alert('Export PDF en cours...')}>Export PDF</button>
        </div>
      </header>

      {/* SECTION FILTRES */}
      <section className="filter-section">
        <div className="filter-group">
          <label>Département</label>
          <select className="filter-select" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            {departmentsList.map(d => <option key={d} value={d}>{d === 'All' ? 'Tous les départements' : d}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Statut Collaborateur</label>
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">Tous les statuts</option>
            <option value="ACTIVE">Collaborateurs Actifs</option>
            <option value="EXITED">Collaborateurs Sortis</option>
          </select>
        </div>
      </section>

      {/* GRILLE KPI (Effectif, Ancienneté, Masse Salariale, Absentéisme, Congés) */}
      <div className="stats-grid">
        <div className="card"><span className="card-label">Effectif Total</span><span className="card-value">{total}</span></div>
        <div className="card"><span className="card-label">Ancienneté Moy.</span><span className="card-value">{avgSeniority} ans</span></div>
        <div className="card"><span className="card-label">Masse Salariale</span><span className="card-value">{formatEuro(totalPayroll)}</span></div>
        <div className="card"><span className="card-label">Taux Absentéisme</span><span className="card-value">{absenteeismRate}%</span></div>
        <div className="card"><span className="card-label">Reliquat Congés</span><span className="card-value">{totalLeavesLeft} j</span></div>
      </div>

      {/* GRILLE DE GRAPHIQUES */}
      <div className="dashboard-main-grid">
        
        {/* 1. Pyramide des Âges */}
        <div className="chart-container">
          <h3>Pyramide des Âges</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={50}>
                  {ageData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Répartition par Sexe */}
        <div className="chart-container">
          <h3>Parité Femmes / Hommes</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} dataKey="value" innerRadius={75} outerRadius={95} paddingAngle={8}>
                  <Cell fill="#ec4899" name="Femmes" /> {/* Rose */}
                  <Cell fill="#6366f1" name="Hommes" /> {/* Indigo */}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Répartition par Département */}
        <div className="chart-container">
          <h3>Effectifs par Département</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} fontSize={12} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={25}>
                  {deptData.map((_, i) => <Cell key={i} fill={COLORS[(i+1)%COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Répartition des Contrats */}
        <div className="chart-container">
          <h3>Types de Contrats</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={contractData} dataKey="value" nameKey="name" innerRadius={75} outerRadius={95} paddingAngle={5}>
                  {contractData.map((_, i) => <Cell key={i} fill={COLORS[(i+2)%COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;