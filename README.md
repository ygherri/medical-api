# 🏥 API Rendez-vous Médicaux

API REST pour gérer des **patients** et leurs **rendez-vous médicaux**, avec validation complète et prévention des chevauchements.

## Stack

- **Runtime** : Node.js
- **Framework** : Express
- **ORM** : Prisma
- **Base de données** : SQLite (fichier local)
- **Validation** : express-validator

---

## 🚀 Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Générer le client Prisma et créer la base de données
npm run db:generate
npm run db:migrate

# 3. (Optionnel) Insérer des données de test
npm run db:seed

# 4. Lancer le serveur en développement
npm run dev
```

Le serveur démarre sur **http://localhost:3000**.

---

## 📁 Structure du projet

```
medical-api/
├── prisma/
│   ├── schema.prisma       # Modèles de données
│   └── seed.js             # Données de test
├── src/
│   ├── controllers/
│   │   ├── patientController.js
│   │   └── appointmentController.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── routes/
│   │   ├── patients.js
│   │   └── appointments.js
│   ├── validators/
│   │   ├── patientValidators.js
│   │   └── appointmentValidators.js
│   ├── lib/
│   │   └── prisma.js       # Client Prisma singleton
│   ├── app.js
│   └── server.js
├── .env
├── package.json
└── README.md
```

---

## 📋 Endpoints

### 🔹 Santé

| Méthode | Route     | Description      |
|---------|-----------|------------------|
| GET     | `/health` | État de l'API    |

---

### 👤 Patients

| Méthode | Route                         | Description                          |
|---------|-------------------------------|--------------------------------------|
| GET     | `/api/patients`               | Liste tous les patients (pagination) |
| GET     | `/api/patients/:id`           | Détails d'un patient + RDV à venir   |
| POST    | `/api/patients`               | Crée un patient                      |
| PUT     | `/api/patients/:id`           | Modifie un patient                   |
| DELETE  | `/api/patients/:id`           | Supprime un patient (cascade RDV)    |
| GET     | `/api/patients/:id/appointments` | Liste les RDV d'un patient        |

#### Query params — GET /api/patients
- `search` — Recherche par nom, prénom ou email
- `page`, `limit` — Pagination (défaut : page=1, limit=20)

#### Body — POST /api/patients
```json
{
  "firstName": "Alice",
  "lastName": "Martin",
  "email": "alice.martin@example.com",
  "phone": "0612345678",
  "dateOfBirth": "1990-05-15"
}
```

---

### 📅 Rendez-vous

| Méthode | Route                    | Description                    |
|---------|--------------------------|--------------------------------|
| GET     | `/api/appointments`      | Liste tous les RDV (filtres)   |
| GET     | `/api/appointments/:id`  | Détails d'un RDV               |
| POST    | `/api/appointments`      | Crée un RDV                    |
| PUT     | `/api/appointments/:id`  | Modifie un RDV                 |
| DELETE  | `/api/appointments/:id`  | Supprime un RDV                |

#### Query params — GET /api/appointments
- `status` — `SCHEDULED` | `CONFIRMED` | `CANCELLED` | `COMPLETED`
- `doctorName` — Filtre par médecin
- `from`, `to` — Plage de dates (ISO 8601)
- `page`, `limit` — Pagination

#### Body — POST /api/appointments
```json
{
  "patientId": 1,
  "doctorName": "Dr. Bernard",
  "reason": "Consultation générale",
  "startTime": "2025-06-01T09:00:00.000Z",
  "endTime": "2025-06-01T09:30:00.000Z",
  "notes": "Premier rendez-vous"
}
```

---

## ⚡ Prévention des chevauchements

Lors de la **création** ou **modification** d'un rendez-vous, l'API vérifie si le médecin ciblé est déjà occupé sur ce créneau. Les rendez-vous annulés (`CANCELLED`) sont exclus de la vérification.

En cas de conflit, la réponse est :

```json
{
  "success": false,
  "error": "Chevauchement de rendez-vous",
  "message": "Dr. Bernard a déjà un rendez-vous de 01/06/2025 09:00 à 01/06/2025 09:30 avec Alice Martin.",
  "conflictingAppointmentId": 3
}
```

---

## 📊 Statuts des rendez-vous

| Statut      | Description             |
|-------------|-------------------------|
| `SCHEDULED` | Planifié (par défaut)   |
| `CONFIRMED` | Confirmé                |
| `CANCELLED` | Annulé                  |
| `COMPLETED` | Effectué                |

---

## 🛠️ Scripts disponibles

```bash
npm run dev          # Démarrage en développement (nodemon)
npm run start        # Démarrage en production
npm run db:migrate   # Applique les migrations
npm run db:generate  # Génère le client Prisma
npm run db:seed      # Insère les données de test
npm run db:studio    # Ouvre Prisma Studio (interface visuelle)
npm run db:reset     # Réinitialise la base de données
```
