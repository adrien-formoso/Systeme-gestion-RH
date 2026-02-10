import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Save, X, Info, Briefcase, MapPin } from 'lucide-react';
import './Employees.css';

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    gender: 'Male', firstname: '', lastname: '', birth_date: '', 
    nationality: '', marital_status: 'Single', social_security_number: '',
    phone: '', email: '', address: '',
    employee_number: '', hire_date: '', contract_type: 'CDI', salary_brut: '', status: 'ACTIVE'
  });

  useEffect(() => {
    if (id) axios.get(`http://127.0.0.1:8000/api/hr/employees/${id}/`).then(res => setFormData(res.data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) await axios.put(`http://127.0.0.1:8000/api/hr/employees/${id}/`, formData);
      else await axios.post('http://127.0.0.1:8000/api/hr/employees/', formData);
      navigate('/employees');
    } catch (err) { alert("Erreur lors de l'enregistrement. Vérifiez les données."); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>{id ? 'Modifier la fiche' : 'Nouveau collaborateur'}</h1>
      </header>
      
      <form onSubmit={handleSubmit} className="form-layout">
        
        {/* --- CARTE 1 : IDENTITÉ --- */}
        <div className="card">
          <h3 className="section-title"><Info size={18}/> Informations Personnelles</h3>
          
          <div className="fields-grid">
            <div className="form-group">
              <label>Civilité</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="Male">Monsieur</option>
                <option value="Female">Madame</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Prénom</label>
              <input name="firstname" required value={formData.firstname} onChange={handleChange} placeholder="Ex: Jean" />
            </div>

            <div className="form-group">
              <label>Nom</label>
              <input name="lastname" required value={formData.lastname} onChange={handleChange} placeholder="Ex: Dupont" />
            </div>

            <div className="form-group">
              <label>Date de naissance</label>
              <input type="date" name="birth_date" required value={formData.birth_date} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Nationalité</label>
              <input name="nationality" value={formData.nationality} onChange={handleChange} placeholder="Ex: Française" />
            </div>

            <div className="form-group">
              <label>Situation familiale</label>
              <select name="marital_status" value={formData.marital_status} onChange={handleChange}>
                <option value="Single">Célibataire</option>
                <option value="Married">Marié(e)</option>
                <option value="Divorced">Divorcé(e)</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Numéro de Sécurité Sociale</label>
              <input name="social_security_number" value={formData.social_security_number} onChange={handleChange} placeholder="1 00 00 00 000 000" />
            </div>
          </div>
        </div>

        {/* --- CARTE 2 : COORDONNÉES --- */}
        <div className="card">
          <h3 className="section-title"><MapPin size={18}/> Coordonnées</h3>
          
          <div className="fields-grid">
            <div className="form-group">
              <label>Email Professionnel</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="jean.dupont@entreprise.com" />
            </div>

            <div className="form-group">
              <label>Téléphone Mobile</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="06 00 00 00 00" />
            </div>

            <div className="form-group full-width">
              <label>Adresse Postale</label>
              <textarea 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                rows="2" 
                placeholder="N° rue, Code Postal, Ville" 
              />
            </div>
          </div>
        </div>

        {/* --- CARTE 3 : CONTRAT --- */}
        <div className="card">
          <h3 className="section-title"><Briefcase size={18}/> Contrat & Poste</h3>
          
          <div className="fields-grid">
            <div className="form-group">
              <label>Matricule (Unique)</label>
              <input name="employee_number" required value={formData.employee_number} onChange={handleChange} placeholder="MAT-000" />
            </div>

            <div className="form-group">
              <label>Date d'embauche</label>
              <input type="date" name="hire_date" required value={formData.hire_date} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Type de contrat</label>
               <select name="contract_type" value={formData.contract_type} onChange={handleChange}>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="INTERNSHIP">Stage</option>
                <option value="APPRENTICESHIP">Alternance</option>
              </select>
            </div>

            <div className="form-group">
              <label>Salaire Brut Mensuel (€)</label>
              <input type="number" name="salary_brut" value={formData.salary_brut} onChange={handleChange} placeholder="0.00" />
            </div>
            
            <div className="form-group">
               <label>Statut</label>
               <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="ACTIVE">Actif</option>
                  <option value="EXITED">Sorti</option>
               </select>
            </div>
          </div>
        </div>

        {/* --- FOOTER BOUTONS --- */}
        <div className="form-footer">
          <button type="button" className="btn-outline" onClick={() => navigate('/employees')}>
            <X size={18}/> Annuler
          </button>
          <button type="submit" className="btn-primary">
            <Save size={18}/> Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;