import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Tableau de bord</h1>
        <p>Aperçu analytique des ressources humaines</p>
      </header>

      <div className="stats-grid">
        <div className="card">
          <span className="card-label">Collaborateurs</span>
          <span className="card-value">1 470</span>
        </div>
        <div className="card">
          <span className="card-label">Masse Salariale</span>
          <span className="card-value">542 000 €</span>
        </div>
        <div className="card">
          <span className="card-label">Contrats Actifs</span>
          <span className="card-value">1 240</span>
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-placeholder">Graphiques de performance à venir</div>
      </div>
    </div>
  );
};
export default Dashboard;