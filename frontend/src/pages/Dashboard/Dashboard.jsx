import { useState, useEffect } from 'react';
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
  
  // États des filtres opérationnels
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [contractFilter, setContractFilter] = useState('All');

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/hr/employees/')
      .then(res => {
        setEmployees(res.data);
        setFilteredEmployees(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération des données:", err);
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
    if (contractFilter !== 'All') {
      result = result.filter(e => e.contracts?.[0]?.contract_type === contractFilter);
    }

    setFilteredEmployees(result);
  }, [deptFilter, statusFilter, contractFilter, employees]);

  // --- CALCULS DES INDICATEURS ---
  const total = filteredEmployees.length;
  const totalPayroll = filteredEmployees.reduce((sum, e) => sum + parseFloat(e.salary_brut || 0), 0);
  const exitedCount = filteredEmployees.filter(e => e.status === 'EXITED').length;
  const turnoverRate = total > 0 ? ((exitedCount / total) * 100).toFixed(1) : 0;

  // Data Graph 1: Salaires par Dept
  const deptMap = {};
  filteredEmployees.forEach(emp => {
    const dept = emp.job_assignments?.[0]?.department_detail?.name || 'Autres';
    const salary = parseFloat(emp.salary_brut || 0);
    if (!deptMap[dept]) deptMap[dept] = { name: dept, totalSalary: 0 };
    deptMap[dept].totalSalary += salary;
  });
  const deptChartData = Object.values(deptMap).sort((a, b) => b.totalSalary - a.totalSalary);

  // Data Graph 2: Top 5 Métiers
  const roleMap = {};
  filteredEmployees.forEach(emp => {
    const role = emp.job_assignments?.[0]?.job_role_detail?.name || 'Non assigné';
    roleMap[role] = (roleMap[role] || 0) + 1;
  });
  const roleChartData = Object.keys(roleMap)
    .map(key => ({ name: key, value: roleMap[key] }))
    .sort((a, b) => b.value - a.value).slice(0, 5);

  // Data Graph 3: Types de Contrats
  const contractMap = {};
  filteredEmployees.forEach(emp => {
    const type = emp.contracts?.[0]?.contract_type || 'NC';
    contractMap[type] = (contractMap[type] || 0) + 1;
  });
  const contractChartData = Object.keys(contractMap).map(k => ({ name: k, value: contractMap[k] }));

  // Data Graph 4: Répartition Masculin/Féminin (On garde le graph mais on vire le filtre)
  const genderMap = {};
  filteredEmployees.forEach(emp => {
    const g = emp.gender === 'Male' ? 'Hommes' : emp.gender === 'Female' ? 'Femmes' : 'Autres';
    genderMap[g] = (genderMap[g] || 0) + 1;
  });
  const genderChartData = Object.keys(genderMap).map(k => ({ name: k, value: genderMap[k] }));

  // Listes dynamiques pour les sélecteurs
  const departments = ['All', ...new Set(employees.map(e => e.job_assignments?.[0]?.department_detail?.name).filter(Boolean))];
  const contractTypes = ['All', ...new Set(employees.map(e => e.contracts?.[0]?.contract_type).filter(Boolean))];

  const formatEuro = (num) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(num);

  if (loading) return <div className="page-container">Chargement des données...</div>;

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Dashboard Analytics RH</h1>
        <div className="filter-bar">
          <div className="filter-group">
            <label>Département</label>
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Contrat</label>
            <select value={contractFilter} onChange={(e) => setContractFilter(e.target.value)}>
              {contractTypes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Statut</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">Tous les statuts</option>
              <option value="ACTIVE">Actifs</option>
              <option value="EXITED">Anciens collaborateurs</option>
            </select>
          </div>
        </div>
      </header>

      <div className="stats-grid">
        <div className="card">
          <span className="card-label">Collaborateurs</span>
          <span className="card-value">{total}</span>
        </div>
        <div className="card">
          <span className="card-label">Masse Salariale</span>
          <span className="card-value">{formatEuro(totalPayroll)}</span>
        </div>
        <div className="card">
          <span className="card-label">Taux d'Attrition</span>
          <span className="card-value">{turnoverRate}%</span>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="chart-container">
          <h3>Salaires par Département</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11}} axisLine={false} />
                <Tooltip formatter={(val) => formatEuro(val)} />
                <Bar dataKey="totalSalary" radius={[0, 4, 4, 0]} barSize={20}>
                  {deptChartData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <h3>Top 5 des Métiers</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={roleChartData} innerRadius={60} outerRadius={85} dataKey="value" paddingAngle={5}>
                  {roleChartData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <h3>Structure des Contrats</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={contractChartData} dataKey="value" outerRadius={90} label>
                  {contractChartData.map((e, i) => <Cell key={i} fill={COLORS[(i+2) % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <h3>Parité (Démographie)</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderChartData} innerRadius={60} outerRadius={85} dataKey="value">
                  <Cell fill="#3b82f6" />
                  <Cell fill="#ec4899" />
                  <Cell fill="#94a3b8" />
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;