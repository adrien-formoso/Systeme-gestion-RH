import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './OrgChart.css';

const OrgChart = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredDept, setFilteredDept] = useState('All');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/hr/employees/')
            .then(res => {
                setEmployees(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur API:", err);
                setLoading(false);
            });
    }, []);

    const departments = [
        'All', 
        ...new Set(employees.map(e => e.job_assignments?.[0]?.department_detail?.name).filter(Boolean))
    ];

    const hasDeptSubordinates = (mId) => {
        return employees.some(e => {
            const managerId = e.manager;
            return managerId === mId && (
                e.job_assignments?.[0]?.department_detail?.name === filteredDept || 
                hasDeptSubordinates(e.id)
            );
        });
    };

    const buildTree = (managerId = null) => {
        return employees
            .filter(emp => {
                const matchesManager = emp.manager === managerId;
                if (filteredDept === 'All') return matchesManager;
                const isInDept = emp.job_assignments?.[0]?.department_detail?.name === filteredDept;
                return matchesManager && (isInDept || hasDeptSubordinates(emp.id));
            })
            .map(emp => ({
                ...emp,
                children: buildTree(emp.id)
            }));
    };

    const renderNode = (node) => {
        const hasChildren = node.children && node.children.length > 0;
        
        return (
            <li key={node.id}>
                {/* Au clic, on redirige vers la page de profil détaillée de l'employé */}
                <div className="member-card" onClick={() => navigate(`/employees/${node.id}`)}>
                    <span className="member-name">{node.firstname} {node.lastname}</span>
                    <span className="member-role">
                        {node.job_assignments?.[0]?.job_role_detail?.name || 'Poste'}
                    </span>
                    <span className="member-dept">
                        {node.job_assignments?.[0]?.department_detail?.name}
                    </span>
                </div>
                {hasChildren && (
                    <ul>
                        {node.children.map(child => renderNode(child))}
                    </ul>
                )}
            </li>
        );
    };

    const treeData = buildTree(null);

    if (loading) return <div className="page-container">Chargement...</div>;

    return (
        <div className="page-container">
            <header className="page-header">
                <h1>Organigramme</h1>
                
                <div className="filter-group">
                    <label>Département</label>
                    <select 
                        className="filter-select" 
                        value={filteredDept} 
                        onChange={(e) => setFilteredDept(e.target.value)}
                    >
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            </header>

            <div className="org-viewport">
                <div className="org-canvas">
                    <div className="org-tree">
                        {treeData.length > 0 ? (
                            <ul>{treeData.map(root => renderNode(root))}</ul>
                        ) : (
                            <div className="no-data">Aucune donnée hiérarchique détectée.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrgChart;