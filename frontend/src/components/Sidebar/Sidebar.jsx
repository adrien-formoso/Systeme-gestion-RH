import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Wallet, Calendar, Briefcase, Settings, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { path: '/', icon: <LayoutDashboard size={18} />, label: 'Tableau de bord' },
    { path: '/employees', icon: <Users size={18} />, label: 'Collaborateurs' },
    { path: '/payroll', icon: <Wallet size={18} />, label: 'Paie' },
    { path: '/leaves', icon: <Calendar size={18} />, label: 'Congés' },
    { path: '/recruitment', icon: <Briefcase size={18} />, label: 'Recrutement' },
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