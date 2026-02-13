import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Edit, Network, User, FileText, History, MessageSquare, Smile, TrendingUp, Save, BookOpen } from 'lucide-react';
import './Employees.css';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [tab, setTab] = useState('identity');
  
  // État pour la note interne
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // VÉRIFICATION DES DROITS (RH ou Admin seulement)
  const isHR = localStorage.getItem('user_role') === 'HR_ADMIN' || localStorage.getItem('is_staff') === 'true';

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = () => {
    axios.get(`http://127.0.0.1:8000/api/hr/employees/${id}/`)
      .then(res => {
        setEmployee(res.data);
        // Si l'API ne renvoie pas le champ (grâce au serializer), on met vide
        setNote(res.data.internal_note || '');
      })
      .catch(err => console.error("Erreur chargement", err));
  };

  const handleSaveNote = async () => {
    setIsSaving(true);
    try {
      await axios.patch(`http://127.0.0.1:8000/api/hr/employees/${id}/`, { 
        internal_note: note 
      });
      alert('Note interne mise à jour avec succès !');
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement de la note.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!employee) return <div className="page-container">Chargement...</div>;

  return (
    <div className="page-container">
      {/* Navigation Top */}
      <div className="page-header">
        <button className="btn-outline" onClick={() => navigate('/employees')}>
          <ChevronLeft size={18}/> Retour liste
        </button>
        <div className="header-actions">
           <button className="btn-outline" onClick={() => navigate('/org-chart')}><Network size={18}/> Voir organigramme</button>
           {/* Seul le RH peut modifier la fiche complète */}
           {isHR && (
             <button className="btn-primary" onClick={() => navigate(`/employees/edit/${id}`)}><Edit size={18}/> Modifier</button>
           )}
        </div>
      </div>
      
      {/* Header Profil */}
      <div className="card profile-header-card">
        <div className="avatar-large">
          {employee.firstname[0]}{employee.lastname[0]}
        </div>
        <div className="profile-titles">
          <h1>{employee.firstname} {employee.lastname}</h1>
          <p>{employee.job_assignments?.[0]?.job_role_detail?.name || 'Poste non défini'} — {employee.job_assignments?.[0]?.department_detail?.name || 'Service non défini'}</p>
          <div style={{marginTop: '12px'}}>
             <span className={`status-pill ${employee.status.toLowerCase()}`}>{employee.status === 'ACTIVE' ? 'En poste' : 'Sorti'}</span>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="tabs-bar">
        <button className={tab === 'identity' ? 'active' : ''} onClick={() => setTab('identity')}>Identité & Coordonnées</button>
        <button className={tab === 'contract' ? 'active' : ''} onClick={() => setTab('contract')}>Contrat & Poste</button>
        <button className={tab === 'history' ? 'active' : ''} onClick={() => setTab('history')}>Historique & Suivi</button>
        <button className={tab === 'docs' ? 'active' : ''} onClick={() => setTab('docs')}>Documents</button>
      </div>

      <div className="tab-content">
        {/* ONGLET IDENTITÉ */}
        {tab === 'identity' && (
          <div className="grid-2">
            <div className="card info-block">
              <h3><User size={16}/> Infos Personnelles</h3>
              <p><span>Naissance</span> {new Date(employee.birth_date).toLocaleDateString()}</p>
              <p><span>Nationalité</span> {employee.nationality || 'Non renseignée'}</p>
              <p><span>Situation</span> {employee.marital_status}</p>
              <p><span>Sécu. Sociale</span> {isHR ? employee.social_security_number : 'Masqué'}</p>
            </div>
            <div className="card info-block">
              <h3><MessageSquare size={16}/> Contact</h3>
              <p><span>Email Pro</span> {employee.email}</p>
              <p><span>Téléphone</span> {employee.phone || 'N/A'}</p>
              <p><span>Adresse</span> {employee.address || 'N/A'}</p>
            </div>
          </div>
        )}

        {/* ONGLET CONTRAT */}
        {tab === 'contract' && (
          <div className="card info-block">
            <h3><FileText size={16}/> Détails Contractuels</h3>
            <p><span>Matricule</span> {employee.employee_number}</p>
            <p><span>Embauche</span> {new Date(employee.hire_date).toLocaleDateString()}</p>
            <p><span>Contrat</span> {employee.contracts?.[0]?.contract_type || 'N/A'}</p>
            {/* On cache le salaire aux non-RH aussi, par sécurité, ou on le laisse si l'employé doit voir le sien */}
            <p><span>Salaire Brut</span> {employee.salary_brut} €</p>
            <p><span>Manager</span> {employee.manager_name}</p>
          </div>
        )}

        {/* ONGLET HISTORIQUE */}
        {tab === 'history' && (
          <div className="card">
            
            {/* 1. Bloc Satisfaction */}
            <h3 className="section-title"><Smile size={18}/> Bien-être & Satisfaction</h3>
            <div className="fields-grid" style={{marginBottom: '32px'}}>
                {employee.satisfaction_surveys?.length > 0 ? (
                    employee.satisfaction_surveys.map(sat => (
                        <div key={sat.id} className="history-item" style={{borderLeftColor: 'var(--color-brand)'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
                                <strong style={{color: 'var(--color-primary)'}}>Enquête du {new Date(sat.survey_date).toLocaleDateString()}</strong>
                            </div>
                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <span style={{color: 'var(--color-text-muted)'}}>Job:</span> 
                                    <strong>{sat.job_satisfaction}/4</strong>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <span style={{color: 'var(--color-text-muted)'}}>Ambiance:</span> 
                                    <strong>{sat.environment_satisfaction}/4</strong>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <span style={{color: 'var(--color-text-muted)'}}>Relations:</span> 
                                    <strong>{sat.relationship_satisfaction}/4</strong>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <span style={{color: 'var(--color-text-muted)'}}>Éq. Vie Pro:</span> 
                                    <strong>{sat.work_life_balance}/4</strong>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="full-width" style={{ textAlign: 'center', padding: '15px', color: 'var(--color-text-muted)', fontStyle: 'italic', gridColumn: 'span 2' }}>
                        Aucune enquête de satisfaction disponible.
                    </div>
                )}
            </div>

            {/* 2. Bloc Évaluations */}
            <h3 className="section-title"><History size={18}/> Performance & Carrière</h3>
            <div style={{ marginBottom: '32px' }}>
              {employee.performance_reviews?.length > 0 ? (
                employee.performance_reviews.map(rev => (
                  <div key={rev.id} className="history-item">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                      <strong style={{color: 'var(--color-primary)'}}>Revue du {new Date(rev.review_date).toLocaleDateString()}</strong>
                      <span className="status-pill active">Note Globale : {rev.performance_rating}/4</span>
                    </div>
                    <div style={{display: 'flex', gap: '20px', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-primary)'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                            <TrendingUp size={16} color="var(--color-success)"/> 
                            Augmentation : <strong>{rev.percent_salary_hike}%</strong>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                            <BookOpen size={16} color="var(--color-brand)"/> 
                            Formations : <strong>{rev.training_times_last_year}</strong>
                        </div>
                    </div>
                    <p style={{color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0, borderTop: '1px solid #e2e8f0', paddingTop: '8px'}}>
                      {rev.comments ? `"${rev.comments}"` : "Aucun commentaire manager enregistré."}
                    </p>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-muted)', fontStyle: 'italic', border: '1px dashed var(--color-border)', borderRadius: '12px' }}>
                  Aucune évaluation enregistrée.
                </div>
              )}
            </div>
            
            {/* 3. Note Interne (VISIBLE SEULEMENT PAR LES RH) */}
            {isHR && (
                <>
                    <h3 className="section-title"><MessageSquare size={18}/> Note Interne RH (Confidentiel)</h3>
                    <div className="input-group" style={{marginBottom: 0}}>
                    <textarea 
                        className="note-area" 
                        placeholder="Rédiger une note confidentielle sur ce collaborateur (visible uniquement par les RH)."
                        style={{ minHeight: '120px', width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                        <button 
                        className="btn-primary" 
                        onClick={handleSaveNote}
                        disabled={isSaving}
                        >
                        <Save size={18}/> {isSaving ? 'Enregistrement...' : 'Enregistrer la note'}
                        </button>
                    </div>
                    </div>
                </>
            )}

          </div>
        )}
        
        {/* ONGLET DOCUMENTS */}
        {tab === 'docs' && (
            <div className="card" style={{textAlign: 'center', padding: '50px'}}>
                <FileText size={40} color="var(--color-border)"/>
                <p style={{color: 'var(--color-text-muted)'}}>Aucun document numérisé disponible.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetail;