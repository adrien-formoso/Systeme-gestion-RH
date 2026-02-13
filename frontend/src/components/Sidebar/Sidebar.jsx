import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, Wallet, Calendar, Briefcase, BarChart3, Network, Settings, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // On vérifie si l'utilisateur est admin (Tu devras stocker cette info au Login)
  // Pour l'instant, on considère qu'un token présent = accès, 
  // mais pour filtrer le menu, on regarde une valeur 'is_staff' dans le localStorage
  const isAdmin = localStorage.getItem('is_staff') === 'true'; 

  // Définition du menu
  const allMenuItems = [
    { 
      path: '/employees', 
      icon: <Users size={18} />, 
      label: 'Collaborateurs', 
      public: true // Visible par tous
    },
    { 
      path: '/org-chart', 
      icon: <Network size={18} />, 
      label: 'Organigramme', 
      public: true 
    },
    { 
      path: '/statistics', 
      icon: <BarChart3 size={18} />, 
      label: 'Statistiques RH', 
      public: true 
    },
    { 
      path: '/leaves', 
      icon: <Calendar size={18} />, 
      label: 'Congés & Absences', 
      public: true 
    },
    { 
      path: '/recruitment', 
      icon: <Briefcase size={18} />, 
      label: 'Recrutement', 
      public: false // Réservé Admin/RH
    },
    { 
      path: '/payroll', 
      icon: <Wallet size={18} />, 
      label: 'Paie', 
      public: false // Réservé Admin/RH
    },
  ];

  // FILTRE : On ne garde que ce que l'utilisateur a le droit de voir
  const visibleMenuItems = allMenuItems.filter(item => {
    if (isAdmin) return true; // L'admin voit tout
    return item.public; // L'employé ne voit que les pages publiques
  });

  // --- FONCTION DE DÉCONNEXION ---
  const handleLogout = () => {
    // 1. On supprime les traces de connexion
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('is_staff'); // On nettoie le rôle aussi
    
    // 2. On redirige vers le login
    navigate('/login');
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">RH SYSTEM</div>
      
      <ul className="sidebar-nav">
        {visibleMenuItems.map((item) => (
          <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
            <Link to={item.path}> 
              {item.icon} 
              <span>{item.label}</span> 
            </Link>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        {isAdmin && (
          <Link to="/settings" className="footer-link">
            <Settings size={18} /> Paramètres
          </Link>
        )}
        
        {/* Le bouton fonctionne maintenant ! */}
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} /> Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;