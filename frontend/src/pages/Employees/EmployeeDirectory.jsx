import { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeDirectory.css';

const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/hr/employees/')
      .then(res => {
        setEmployees(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération :", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Annuaire des collaborateurs</h1>
        <p>{loading ? 'Chargement...' : `${employees.length} collaborateurs enregistrés`}</p>
      </header>
      
      <div className="table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Département</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {!loading && employees.map(emp => (
              <tr key={emp.id}>
                <td className="emp-name">{emp.firstname} {emp.lastname}</td>
                <td>{emp.email}</td>
                <td>{emp.job_assignments?.[0]?.department_detail?.name || '-'}</td>
                <td>
                  <span className={`badge badge-${emp.status?.toLowerCase() || 'default'}`}>
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && employees.length === 0 && (
          <div className="empty-state">Aucun collaborateur trouvé.</div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDirectory;