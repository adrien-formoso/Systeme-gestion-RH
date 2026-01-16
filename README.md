## API REST & Swagger

Le backend expose une API REST développée avec Django REST Framework, permettant d’accéder aux données de gestion des ressources humaines (employés, contrats, affectations, enquêtes, évaluations, etc.) sous forme de réponses JSON standardisées.

Chaque entité métier est accessible via des endpoints dédiés, facilitant la consultation et la manipulation des données par des clients externes, notamment le frontend de l’application.

L’API est documentée automatiquement à l’aide de Swagger (via drf-spectacular), offrant une vue claire des routes disponibles, des schémas de données et des formats de réponse, ainsi qu’un outil de test interactif.

### Accès

Swagger UI : http://127.0.0.1:8000/api/docs/

API RH : http://127.0.0.1:8000/api/hr/