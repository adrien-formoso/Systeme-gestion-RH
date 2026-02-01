import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  User, Briefcase, Calendar, FileText, History, 
  MessageSquare, ChevronLeft, Edit, PlusCircle, ExternalLink 
} from 'lucide-react';
import './EmployeeDetail.css';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('identity');

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/hr/employees/${id}/`)
      .then(res => setEmployee(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!employee) return <div className="page-container">Chargement...</div>;

  return (
    <div className="page-container">
      {/* Barre d'actions supérieure */}
      <div className="detail-top-bar">
        <button className="btn-back" onClick={() => navigate('/employees')}>
          <ChevronLeft size={18} /> Retour à la liste
        </button>
        <div className="action-btns">
          <button className="btn-secondary" onClick={() => navigate(`/employees/edit/${id}`)}><Edit size={16}/> Modifier fiche</button>
          <button className="btn-secondary"><MessageSquare size={16}/> Ajouter une note</button>
          <button className="btn-primary" onClick={() => navigate('/org-chart')}><ExternalLink size={16}/> Voir l'organigramme</button>
        </div>
      </div>

      {/* Header : Identité & Photo (Miniature stylisée) */}
      <div className="employee-id-card">
        <div className="id-avatar">
          {employee.firstname[0]}{employee.lastname[0]}
        </div>
        <div className="id-info">
          <h1>{employee.firstname} {employee.lastname}</h1>
          <p className="id-role">{employee.job_assignments?.[0]?.job_role_detail?.name} — {employee.job_assignments?.[0]?.department_detail?.name}</p>
          <div className="id-badges">
            <span className={`badge ${employee.status.toLowerCase()}`}>{employee.status}</span>
            <span className="badge-outline">#{employee.employee_number}</span>
          </div>
        </div>
      </div>

      {/* Onglets Navigation */}
      <div className="tabs-nav">
        <button className={activeTab === 'identity' ? 'active' : ''} onClick={() => setActiveTab('identity')}>Identité & Coordonnées</button>
        <button className={activeTab === 'contract' ? 'active' : ''} onClick={() => setActiveTab('contract')}>Contrat & Poste</button>
        <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>Historique & Absences</button>
        <button className={activeTab === 'docs' ? 'active' : ''} onClick={() => setActiveTab('docs')}>Documents</button>
      </div>

      {/* Contenu des Onglets */}
      <div className="tab-panel">
        {activeTab === 'identity' && (
          <div className="info-grid">
            <div className="info-box">
              <h3><User size={16} /> État Civil</h3>
              <p><strong>Civilité :</strong> {employee.gender === 'Male' ? 'Monsieur' : 'Madame'}</p>
              <p><strong>Né(e) le :</strong> {employee.birth_date}</p>
              <p><strong>Nationalité :</strong> {employee.nationality || 'Française'}</p>
              <p><strong>Situation familiale :</strong> {employee.marital_status || 'Célibataire'}</p>
              <p><strong>N° Sécurité Sociale :</strong> {employee.social_security_number}</p>
            </div>
            <div className="info-box">
              <h3><Calendar size={16} /> Coordonnées</h3>
              <p><strong>Téléphone :</strong> {employee.phone || 'Non renseigné'}</p>
              <p><strong>Email Pro :</strong> {employee.email}</p>
              <p><strong>Adresse :</strong> {employee.address || 'Non renseignée'}</p>
            </div>
          </div>
        )}

        {activeTab === 'contract' && (
          <div className="info-grid">
            <div className="info-box">
              <h3><Briefcase size={16} /> Détails Contractuels</h3>
              <p><strong>Date d'embauche :</strong> {employee.hire_date}</p>
              <p><strong>Type de contrat :</strong> {employee.contracts?.[0]?.contract_type || 'CDI'}</p>
              <p><strong>Salaire Brut Mensuel :</strong> {employee.salary_brut} €</p>
              <p><strong>Solde de congés :</strong> {employee.leave_balance} jours</p>
            </div>
            <div className="info-box">
              <h3><User size={16} /> Hiérarchie</h3>
              <p><strong>Manager Direct :</strong> {employee.manager_detail ? `${employee.manager_detail.firstname} ${employee.manager_detail.lastname}` : 'N/A'}</p>
              <p><strong>Département :</strong> {employee.job_assignments?.[0]?.department_detail?.name}</p>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <div className="history-block">
              <h4>Historique des Changements</h4>
              <p className="empty-msg">Aucun changement de poste ou augmentation récente.</p>
            </div>
            <div className="history-block">
              <h4>Congés & Absences</h4>
              <p className="empty-msg">Aucun historique d'absence enregistré.</p>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="docs-list">
            <div className="doc-item"><FileText size={20}/> Contrat_travail.pdf <button className="btn-view">Voir</button></div>
            <div className="doc-item"><FileText size={20}/> Diplome_Master.pdf <button className="btn-view">Voir</button></div>
            <div className="doc-item"><FileText size={20}/> CNI_Recto_Verso.jpg <button className="btn-view">Voir</button></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetail;