import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Edit, Archive, Download } from 'lucide-react';
import './Employees.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/hr/employees/')
      .then(res => setEmployees(res.data))
      .catch(err => console.error(err));
  }, []);

  const exportCSV = () => {
    const headers = ["Matricule,Nom Complet,Poste,Departement,Statut"];
    const rows = filtered.map(e => `${e.employee_number},${e.firstname} ${e.lastname},${e.job_assignments?.[0]?.job_role_detail?.name},${e.job_assignments?.[0]?.department_detail?.name},${e.status}`);
    const blob = new Blob([[headers, ...rows].join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export_collaborateurs.csv';
    a.click();
  };

  const filtered = employees.filter(e => 
    (`${e.firstname} ${e.lastname} ${e.employee_number}`).toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterDept === 'All' || e.job_assignments?.[0]?.department_detail?.name === filterDept) &&
    (filterStatus === 'All' || e.status === filterStatus)
  );

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Collaborateurs</h1>
          <p style={{color: 'var(--color-text-muted)', marginTop: '4px'}}>Gérez vos équipes RH</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline" onClick={exportCSV}><Download size={18}/> Export CSV</button>
          <button className="btn-primary" onClick={() => navigate('/employees/new')}><Plus size={18}/> Ajouter</button>
        </div>
      </header>

      <section className="search-bar-container">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Rechercher par nom, matricule..." 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        
        {/* CORRECTION : Ajout de la classe "filter-select" pour aligner le texte correctement */}
        <select 
          className="filter-select" 
          style={{width: '200px'}} 
          onChange={(e) => setFilterDept(e.target.value)}
        >
          <option value="All">Tous les départements</option>
          {[...new Set(employees.map(e => e.job_assignments?.[0]?.department_detail?.name))].map(d => d && <option key={d} value={d}>{d}</option>)}
        </select>
        
        <select 
          className="filter-select" 
          style={{width: '150px'}} 
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">Tous statuts</option>
          <option value="ACTIVE">Actif</option>
          <option value="EXITED">Sorti</option>
        </select>
      </section>

      {/* CORRECTION : Remplacement par une div responsive qui permet le scroll */}
      <div className="card" style={{padding: 0}}>
        <div className="table-responsive">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Collaborateur</th>
                <th>Poste & Service</th>
                <th>Matricule</th>
                <th>Embauche</th>
                <th>Statut</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id}>
                  <td className="user-cell">
                    <div className="avatar-mini">{emp.firstname[0]}{emp.lastname[0]}</div>
                    <div>
                      <span className="user-name">{emp.firstname} {emp.lastname}</span>
                      <span className="user-email">{emp.email}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{fontWeight: 600}}>{emp.job_assignments?.[0]?.job_role_detail?.name}</div>
                    <div style={{color: 'var(--color-text-muted)', fontSize: '0.85rem'}}>{emp.job_assignments?.[0]?.department_detail?.name}</div>
                  </td>
                  <td style={{fontFamily: 'monospace', fontWeight: 600}}>#{emp.employee_number}</td>
                  <td>{new Date(emp.hire_date).toLocaleDateString()}</td>
                  <td><span className={`status-pill ${emp.status.toLowerCase()}`}>{emp.status === 'ACTIVE' ? 'Actif' : 'Sorti'}</span></td>
                  
                  <td className="actions-cell">
                    <button 
                      className="action-btn" 
                      onClick={() => navigate(`/employees/${emp.id}`)} 
                      title="Voir la fiche"
                    >
                      <Eye size={18}/>
                    </button>
                    
                    <button 
                      className="action-btn" 
                      onClick={() => navigate(`/employees/edit/${emp.id}`)} 
                      title="Modifier"
                    >
                      <Edit size={18}/>
                    </button>
                    
                    <button 
                      className="action-btn danger" 
                      onClick={() => alert('Archivage...')} 
                      title="Archiver"
                    >
                      <Archive size={18}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;