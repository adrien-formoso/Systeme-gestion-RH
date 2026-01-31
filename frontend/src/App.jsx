import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'

function App() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  // C'est ici qu'on appelle ton Django
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/hr/employees/')
      .then(response => {
        setEmployees(response.data)
        setLoading(false)
      })
      .catch(error => {
        console.error("Erreur lors de la récupération :", error)
        setLoading(false)
      })
  }, [])

  return (
    <div className="App">
      <h1>Tableau de Bord RH</h1>
      
      {loading ? (
        <p>Chargement des données...</p>
      ) : (
        <div className="card">
          <h2>Liste des Collaborateurs ({employees.length})</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#646cff', color: 'white' }}>
                <th>Nom</th>
                <th>Département</th>
                <th>Email</th>
                <th>Salaire Brut</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td>{emp.firstname} {emp.lastname}</td>
                  <td>{emp.job_assignments[0]?.department_detail.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.salary_brut} €</td>
                  <td style={{ color: emp.status === 'ACTIVE' ? 'green' : 'red' }}>
                    {emp.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default App