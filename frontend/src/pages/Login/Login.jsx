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
      // 1. On demande le token au backend
      const res = await axios.post('http://127.0.0.1:8000/api/hr/auth/login/', {
        username,
        password
      });

      // 2. On stocke les tokens dans le navigateur
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);

      // 3. Gestion des droits (Simulation pour le menu Sidebar)
      // Si l'user est "admin", on lui donne les droits Staff pour voir le menu Paie
      if (username === 'admin') {
        localStorage.setItem('is_staff', 'true');
      } else {
        localStorage.setItem('is_staff', 'false');
      }

      // 4. On configure Axios pour les prochaines requêtes
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
      
      // 5. On redirige vers le dashboard
      navigate('/statistics');
      
    } catch (err) {
      console.error(err);
      setError('Identifiants incorrects ou problème serveur.');
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
            <label>Nom d'utilisateur</label>
            <div className="input-with-icon">
              <User size={18} />
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Ex: admin"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <div className="input-with-icon">
              <Lock size={18} />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary full-width">
            Se connecter <ArrowRight size={18} />
          </button>
        </form>
        
        <div className="login-footer">
            <p>Pas encore de compte ? Contactez votre RH.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;