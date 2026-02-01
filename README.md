# Système de Gestion RH - Dashboard Analytics

Ce projet est une application complète de gestion des ressources humaines.  
Elle permet d'importer des données complexes depuis un dataset CSV, de les enrichir via des scripts de génération de données aléatoires, et de les exposer via une API REST documentée.

---

## Fonctionnalités Clés

- **Importation Intelligente** : Migration des données à partir d'un fichier CSV (`HR-Employee-Attrition.csv`) vers une base de données relationnelle normalisée.
- **Enrichissement de Données (Faker)** : Génération automatique de prénoms, noms, dates d'embauche et contrats pour rendre le dataset réaliste.
- **Gestion Hiérarchique** : Système de management où chaque employé est lié à un supérieur.
- **Administration Avancée** : Interface Django Admin personnalisée avec filtres par attrition, genre et hiérarchie temporelle.
- **Architecture Découplée** : Backend Django performant et Frontend moderne (Vite / React).

---

## Installation et Configuration

### 1. Backend (Django)

Assurez-vous d'être dans le dossier `backend/` et d'avoir activé votre environnement virtuel.

#### Installation des dépendances

```bash
pip install django djangorestframework drf-spectacular faker
```

#### Préparation de la base de données

```bash
python manage.py makemigrations
python manage.py migrate
```

#### Initialisation des données (CSV + Faker)

```bash
python manage.py setup_dev_data
```

#### Lancement du serveur

```bash
python manage.py runserver
```

---

### 2. Frontend (Vite)

Placez-vous dans le dossier `frontend/`.

#### Installation

```bash
npm install
```

#### Lancement

```bash
npm run dev
```

---

## API REST & Documentation

Le backend expose une API REST développée avec Django REST Framework.  
L'architecture s'appuie sur des sérialiseurs imbriqués, permettant de récupérer des entités complexes (comme un employé avec ses contrats et son historique) en une seule requête JSON standardisée.

L’API est documentée automatiquement à l’aide de Swagger (via `drf-spectacular`), offrant une vue claire des routes disponibles, des schémas de données et un outil de test interactif.

---

## Documentation et Schémas

| Service        | URL            | Description                                          |
|----------------|----------------|------------------------------------------------------|
| Swagger UI     | /api/docs/     | Interface interactive pour tester les endpoints      |
| OpenAPI Schema | /api/schema/   | Spécification brute au format YAML / JSON            |
| Admin Django   | /admin/        | Interface d'administration et de gestion des données |

---

## Endpoints Principaux

**Base :** `/api/hr/`

| Ressource     | Endpoint           | Informations retournées                          |
|---------------|--------------------|--------------------------------------------------|
| Employés      | /employees/        | Profils complets, contrats, affectations et paie |
| Départements  | /departments/      | Liste des pôles et descriptions associées        |
| Métiers       | /job-roles/        | Référentiel des postes et grilles salariales     |
| Contrats      | /contracts/        | Détails contractuels et volumes horaires         |
| Paie          | /payrolls/         | Historique des salaires, bonus et déductions     |
| Absences      | /leave-requests/   | Suivi des demandes de congés et statuts          |
| Recrutement   | /job-offers/       | Gestion des offres et des candidatures           |

---

## Structure de la Base de Données

L'application repose sur plusieurs modèles interconnectés pour une analyse granulaire :

- **Employee** : Profil de base (Nom, Prénom, Âge, Genre, Attrition)
- **JobAssignment** : Poste actuel, département, salaire et ancienneté
- **Contract** : Historique des contrats (CDI, CDD, Internship)
- **Surveys & Reviews** : Données de satisfaction et évaluations de performance

---

## Administration

Pour accéder à l'administration, vous devez créer un compte :

```bash
python manage.py createsuperuser
```
