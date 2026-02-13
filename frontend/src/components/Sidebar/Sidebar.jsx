import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, Wallet, Calendar, Briefcase, BarChart3, Network, Settings, LogOut, UserCircle } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = localStorage.getItem('user_role'); // 'HR_ADMIN' ou 'EMPLOYEE'
  const isAdmin = localStorage.getItem('is_staff') === 'true';

  const allMenuItems = [
    // --- MENU ADMIN / RH ---
    { 
      path: '/statistics', 
      icon: <BarChart3 size={18} />, 
      label: 'Dashboard', 
      roles: ['HR_ADMIN'] 
    },
    { 
      path: '/employees', 
      icon: <Users size={18} />, 
      label: 'Collaborateurs', 
      roles: ['HR_ADMIN'] 
    },
    // --- MENU EMPLOYÉ (Pointe vers la même page mais label différent) ---
    { 
      path: '/employees', 
      icon: <UserCircle size={18} />, 
      label: 'Mon Profil', 
      roles: ['EMPLOYEE'] 
    },
    // --- MENU COMMUN ---
    { 
      path: '/org-chart', 
      icon: <Network size={18} />, 
      label: 'Organigramme', 
      roles: ['HR_ADMIN', 'EMPLOYEE'] 
    },
    { 
      path: '/payroll', 
      icon: <Wallet size={18} />, 
      label: isAdmin ? 'Gestion Paie' : 'Mes Bulletins', 
      roles: ['HR_ADMIN', 'EMPLOYEE'] 
    },
    // --- AUTRES (ADMIN SEULEMENT POUR L'INSTANT) ---
    { 
      path: '/leaves', 
      icon: <Calendar size={18} />, 
      label: 'Congés', 
      roles: ['HR_ADMIN'] 
    },
    { 
      path: '/recruitment', 
      icon: <Briefcase size={18} />, 
      label: 'Recrutement', 
      roles: ['HR_ADMIN'] 
    },
  ];

  const visibleMenuItems = allMenuItems.filter(item => {
    // Si c'est le superadmin Django, il voit les items RH_ADMIN
    if (isAdmin && item.roles.includes('HR_ADMIN')) return true;
    // Sinon on filtre par rôle exact
    return item.roles.includes(userRole);
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        RH SYSTEM
        <div style={{ fontSize: '0.65rem', color: '#8b5cf6', marginTop: '4px' }}>
          {userRole === 'HR_ADMIN' ? 'ADMINISTRATEUR' : 'ESPACE EMPLOYÉ'}
        </div>
      </div>
      
      <ul className="sidebar-nav">
        {visibleMenuItems.map((item, index) => (
          <li key={index} className={location.pathname === item.path && item.label !== 'Collaborateurs' ? 'active' : ''}>
            <Link to={item.path}> 
              {item.icon} 
              <span>{item.label}</span> 
            </Link>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        {userRole === 'HR_ADMIN' && (
          <Link to="/settings" className="footer-link">
            <Settings size={18} /> Paramètres
          </Link>
        )}
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} /> Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;