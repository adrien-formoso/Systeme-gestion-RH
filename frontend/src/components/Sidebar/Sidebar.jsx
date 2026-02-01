import { Link, useLocation } from 'react-router-dom';
// Remplacement de Sitemap par Network qui ressemble à un organigramme
import { Users, Wallet, Calendar, Briefcase, BarChart3, Network, Settings, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { path: '/employees', icon: <Users size={18} />, label: 'Collaborateurs' },
    { path: '/leaves', icon: <Calendar size={18} />, label: 'Congés & Absences' },
    { path: '/recruitment', icon: <Briefcase size={18} />, label: 'Recrutement' },
    { path: '/payroll', icon: <Wallet size={18} />, label: 'Paie' },
    { path: '/statistics', icon: <BarChart3 size={18} />, label: 'Statistiques RH' },
    { path: '/org-chart', icon: <Network size={18} />, label: 'Organigramme' },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">RH SYSTEM</div>
      <ul className="sidebar-nav">
        {menuItems.map((item) => (
          <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
            <Link to={item.path}> {item.icon} <span>{item.label}</span> </Link>
          </li>
        ))}
      </ul>
      <div className="sidebar-footer">
        <Link to="/settings" className="footer-link"><Settings size={18} /> Paramètres</Link>
        <button className="logout-btn"><LogOut size={18} /> Déconnexion</button>
      </div>
    </nav>
  );
};
export default Sidebar;