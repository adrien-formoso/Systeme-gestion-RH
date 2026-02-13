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
        // MODIFICATION ICI : On appelle la route publique sécurisée
        // Cela permet à l'employé de recevoir toute la liste (noms/postes) sans les salaires
        axios.get('http://127.0.0.1:8000/api/hr/org-chart-data/')
            .then(res => {
                setEmployees(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur API:", err);
                setLoading(false);
            });
    }, []);

    // MODIFICATION ICI : On lit 'e.department' directement (grâce au nouveau serializer)
    const departments = [
        'All', 
        ...new Set(employees.map(e => e.department).filter(Boolean))
    ];

    const hasDeptSubordinates = (mId) => {
        return employees.some(e => {
            const managerId = e.manager;
            // Adaptation ici aussi pour lire e.department
            return managerId === mId && (
                e.department === filteredDept || 
                hasDeptSubordinates(e.id)
            );
        });
    };

    const buildTree = (managerId = null) => {
        return employees
            .filter(emp => {
                const matchesManager = emp.manager === managerId;
                if (filteredDept === 'All') return matchesManager;
                
                // Adaptation ici : lecture directe
                const isInDept = emp.department === filteredDept;
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
                {/* On garde ton design exact */}
                <div className="member-card" onClick={() => navigate(`/employees/${node.id}`)}>
                    <span className="member-name">{node.name}</span> {/* node.name vient du serializer */}
                    <span className="member-role">
                        {node.job_title || 'Poste'} {/* node.job_title vient du serializer */}
                    </span>
                    <span className="member-dept">
                        {node.department} {/* node.department vient du serializer */}
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

    // On cherche la racine (celui qui n'a pas de manager)
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
                            <div className="no-data">
                                Aucune donnée racine détectée.<br/>
                                <small>(Vérifiez qu'il existe un employé sans manager, ex: PDG)</small>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrgChart;