import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Eye, Edit, Archive, FileText } from 'lucide-react';
import './Employees.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/hr/employees/')
      .then(res => setEmployees(res.data))
      .catch(err => console.error(err));
  }, []);

  // Filtrage
  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.firstname} ${emp.lastname}`.toLowerCase();
    const matchSearch = fullName.includes(searchTerm.toLowerCase()) || emp.employee_number.toString().includes(searchTerm);
    const matchDept = deptFilter === 'All' || emp.job_assignments?.[0]?.department_detail?.name === deptFilter;
    return matchSearch && matchDept;
  });

  const depts = ['All', ...new Set(employees.map(e => e.job_assignments?.[0]?.department_detail?.name).filter(Boolean))];

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Collaborateurs</h1>
        <button className="btn-primary" onClick={() => navigate('/employees/new')}>
          <Plus size={18} /> Ajouter un employé
        </button>
      </header>

      <section className="filter-section">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou matricule..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select className="filter-select" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            {depts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </section>

      <div className="table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Collaborateur</th>
              <th>Poste & Service</th>
              <th>Matricule</th>
              <th>Date d'entrée</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(emp => (
              <tr key={emp.id}>
                <td className="user-cell">
                  <div className="mini-avatar-sq">
                    {emp.firstname[0]}
                  </div>
                  <div className="user-info-text">
                    <span className="name-bold">{emp.firstname} {emp.lastname}</span>
                    <span className="email-sub">{emp.email}</span>
                  </div>
                </td>
                <td>
                  <span className="role-text">{emp.job_assignments?.[0]?.job_role_detail?.name}</span>
                  <span className="dept-sub">{emp.job_assignments?.[0]?.department_detail?.name}</span>
                </td>
                <td><span className="matricule">#{emp.employee_number}</span></td>
                <td>{new Date(emp.hire_date).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${emp.status.toLowerCase()}`}>{emp.status}</span>
                </td>
                <td className="actions-cell">
                  <button onClick={() => navigate(`/employees/${emp.id}`)} title="Voir fiche"><Eye size={16} /></button>
                  <button onClick={() => navigate(`/employees/edit/${emp.id}`)} title="Modifier"><Edit size={16} /></button>
                  <button className="archive-btn" title="Archiver"><Archive size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;