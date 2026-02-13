import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Authentification
      const res = await axios.post('http://127.0.0.1:8000/api/hr/auth/login/', { username, password });
      
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;

      // 2. Identification du Rôle via l'API Employees
      // Comme on a modifié le backend, si je suis un simple employé, l'API ne me renvoie que MA ligne.
      const profileRes = await axios.get('http://127.0.0.1:8000/api/hr/employees/');
      
      let role = 'EMPLOYEE'; // Par défaut
      let isStaff = 'false';

      if (username === 'admin' || profileRes.data.length > 1) {
         // Si c'est "admin" ou si je vois plusieurs personnes, je suis RH/Admin
         role = 'HR_ADMIN';
         isStaff = 'true';
      } else if (profileRes.data.length === 1) {
         // Je vois 1 seule personne (moi-même), je prends le rôle écrit dans ma fiche
         role = profileRes.data[0].role;
      }

      localStorage.setItem('user_role', role);
      localStorage.setItem('is_staff', isStaff);

      // 3. Redirection
      if (role === 'HR_ADMIN') {
        navigate('/statistics');
      } else {
        // L'employé va directement sur la liste (qui ne contient que lui)
        navigate('/employees');
      }
      
    } catch (err) {
      console.error(err);
      setError('Identifiants incorrects.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>HR Smart System</h1>
          <p>Connectez-vous à votre espace</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Utilisateur</label>
            <div className="input-with-icon">
              <User size={18} />
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <div className="input-with-icon">
              <Lock size={18} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-primary full-width">Se connecter <ArrowRight size={18} /></button>
        </form>
      </div>
    </div>
  );
};

export default Login;