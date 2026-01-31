import React, { useEffect, useState } from 'react';
import api from './api/axiosConfig';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        api.get('hr/employees/')
            .then(response => setEmployees(response.data))
            .catch(error => console.error("Erreur API:", error));
    }, []);

    return (
        <div>
            <h1>Liste des collaborateurs</h1>
            <ul>
                {employees.map(emp => (
                    <li key={emp.id}>
                        {emp.firstname} {emp.lastname} - 
                        <strong> {emp.job_assignments[0]?.department_detail.name} </strong>
                        (Salaire : {emp.salary_brut}€)
                    </li>
                ))}
            </ul>
        </div>
    );
};