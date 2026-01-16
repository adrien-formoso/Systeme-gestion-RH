# Système de Gestion RH - Dashboard Analytics

Ce projet est une application complète de gestion des ressources humaines. Elle permet d'importer des données complexes depuis un dataset CSV, de les enrichir via des scripts de génération de données aléatoires, et de les exposer via une API REST documentée.

## Fonctionnalités Clés

* **Importation Intelligente** : Migration des données à partir d'un fichier CSV (`HR-Employee-Attrition.csv`) vers une base de données relationnelle normalisée.
* **Enrichissement de Données (Faker)** : Génération automatique de prénoms, noms, dates d'embauche et contrats pour rendre le dataset réaliste.
* **Gestion Hiérarchique** : Système de management où chaque employé est lié à un supérieur.
* **Administration Avancée** : Interface Django Admin personnalisée avec filtres par attrition, genre et hiérarchie temporelle.
* **Architecture Découplée** : Backend Django performant et Frontend moderne (Vite/React).

---

## Installation et Configuration

### 1. Backend (Django)

Assurez-vous d'être dans le dossier `backend/` et d'avoir activé votre environnement virtuel.

1. **Installation des dépendances** :
```bash
pip install django djangorestframework drf-spectacular faker

```


2. **Préparation de la base de données** :
```bash
python manage.py makemigrations
python manage.py migrate

```


3. **Initialisation des données (CSV + Faker)** :
*Cette commande importe le CSV et génère les noms/contrats manquants.*
```bash
python manage.py setup_dev_data

```


4. **Lancement du serveur** :
```bash
python manage.py runserver

```



### 2. Frontend (Vite)

Allez dans le dossier `frontend/`.

1. **Installation** : `npm install`
2. **Lancement** : `npm run dev`

---

## API REST & Swagger

Le backend expose une **API REST** développée avec Django REST Framework, permettant d’accéder aux données de gestion des ressources humaines (employés, contrats, affectations, enquêtes, évaluations, etc.) sous forme de réponses JSON standardisées.

Chaque entité métier est accessible via des endpoints dédiés, facilitant la consultation et la manipulation des données par des clients externes, notamment le frontend de l’application.

L’API est documentée automatiquement à l’aide de **Swagger** (via `drf-spectacular`), offrant une vue claire des routes disponibles, des schémas de données et des formats de réponse, ainsi qu’un outil de test interactif.

### Accès Rapides

| Service | URL |
| --- | --- |
| **Swagger UI** | [http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/) |
| **API RH** | [http://127.0.0.1:8000/api/hr/](http://127.0.0.1:8000/api/hr/) |
| **Admin Django** | [http://127.0.0.1:8000/admin/](https://www.google.com/search?q=http://127.0.0.1:8000/admin/) |

---

## Structure de la Base de Données

L'application repose sur plusieurs modèles interconnectés pour une analyse granulaire :

* **Employee** : Profil de base (Nom, Prénom, Age, Genre, Attrition).
* **JobAssignment** : Poste actuel, département, salaire et ancienneté.
* **Contract** : Historique des contrats (CDI, CDD, Internship).
* **Surveys & Reviews** : Données de satisfaction et évaluations de performance.

> **Note :** Pour accéder à l'administration, vous devez créer un compte avec `python manage.py createsuperuser`.
