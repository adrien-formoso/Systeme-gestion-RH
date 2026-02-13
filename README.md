
# HR Smart System

HR Smart System est une solution SIRH (Système d'Information Ressources Humaines) moderne, conçue pour centraliser la gestion administrative, visualiser la hiérarchie et simplifier la paie.

L'interface se distingue par son design "Smart & Mauve", offrant une expérience utilisateur fluide, épurée et réactive.

---

## Stack Technique & Architecture

Le projet repose sur une architecture Client-Serveur (REST) séparant clairement le Backend du Frontend pour plus de performance et de scalabilité.

### Frontend (Client)

L'interface utilisateur est construite avec l'écosystème React moderne.

- React.js (v18) : Bibliothèque pour construire une interface interactive basée sur des composants réutilisables.
- Vite : Outil de build nouvelle génération. Il remplace Webpack pour offrir un démarrage instantané du serveur de développement et une compilation ultra-rapide.
- React Router Dom : Gère la navigation "Single Page Application" (SPA) sans rechargement de page.
- Axios : Client HTTP pour communiquer avec l'API REST du backend.
- Lucide React : Librairie d'icônes vectorielles légères et modernes.
- CSS Custom Properties : Design system maison basé sur des variables CSS natives pour une charte graphique cohérente (Thème Mauve/Anthracite).

### Backend (Serveur)

Le serveur assure la persistance des données et la logique métier via une API robuste.

- Django 5 (Python) : Framework web de haut niveau, sécurisé et rapide.
- Django REST Framework (DRF) : Surcouche puissante pour transformer les modèles Django en API RESTful (JSON) standardisée.
- ReportLab : Librairie Python utilisée pour générer dynamiquement les bulletins de paie au format PDF.
- SQLite : Base de données relationnelle légère (facilement migrable vers PostgreSQL).

---

## Fonctionnalités Principales

### 1. Gestion des Collaborateurs (CRUD)

- Annuaire Intelligent : Tableau de bord avec recherche instantanée et filtres dynamiques (Département, Statut).
- Fiche Employé 360° : Centralisation des infos personnelles, contractuelles, historique de carrière et documents.
- Édition & Archivage : Formulaires structurés avec validation des données.

### 2. Organigramme Dynamique

- Visualisation graphique des liens hiérarchiques.
- Navigation interactive Manager / Subordonnés.

### 3. Module Paie Simplifiée

- Calculatrice Live : Simulation du passage Brut → Net en temps réel avec calcul des charges et heures supplémentaires.
- Génération PDF : Création automatique et téléchargement de bulletins de paie propres et standardisés.
- Historique : Suivi des bulletins générés par mois.

---

## Guide d'Installation

### Pré-requis

- Python 3.10+
- Node.js 16+

### 1. Installation du Backend (API)

```bash
cd backend

# Création de l'environnement virtuel
python -m venv venv

# Activation (Windows)
venv\Scripts\activate
# Activation (Mac/Linux)
# source venv/bin/activate

# Installation des dépendances
pip install django djangorestframework django-cors-headers reportlab

# Migration de la base de données
python manage.py migrate

# Lancement du serveur
python manage.py runserver
```

L'API sera accessible sur :  
http://127.0.0.1:8000/api/hr/

---

### 2. Installation du Frontend (Interface)

```bash
cd frontend

# Installation des paquets Node
npm install

# Lancement en mode développement (via Vite)
npm run dev
```

L'application sera accessible sur :  
http://localhost:5173 (ou port indiqué par Vite).

---

## Documentation API

Le backend expose une API REST documentée nativement.

### Ressources

#### Employés

- `GET /api/hr/employees/`  
  Liste complète (avec filtres)

- `POST /api/hr/employees/`  
  Création d'un collaborateur

- `PUT /api/hr/employees/{id}/`  
  Mise à jour d'un profil

#### Paie

- `POST /api/hr/payslips/`  
  Simuler et enregistrer un bulletin

- `GET /api/hr/payslips/{id}/pdf/`  
  Télécharger le PDF généré

---

Explorer l'API :  
Rendez-vous sur http://127.0.0.1:8000/api/hr/ pour utiliser l'interface de test (Browsable API).

Admin Panel :  
http://127.0.0.1:8000/admin/  
(Login: admin / Password: admin - à créer via `createsuperuser`).

---

## Auteurs

Projet développé par FORMOSO Adrien et COCO Emma
