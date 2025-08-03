# Staff Face Recognition Attendance System

A mobile application allowing staff to mark attendance via facial recognition, with an admin panel for user management.

---

## 📱 About the Project

This is a full-stack, proof-of-concept mobile app to streamline staff attendance using facial recognition. Staff can mark attendance by entering their Staff ID and taking a photo. The admin panel allows adding staff and viewing attendance.

---

## 🔧 Tech Stack

- **Frontend:** React Native (Expo)
- **Backend:** FastAPI (Python)
- **Database:** PostgreSQL (via Docker)
- **Facial Recognition:** `face_recognition` (dlib-based)

The app uses a client-server model. The frontend (Expo) captures images and sends them to the backend (FastAPI), which verifies the face and stores attendance data in PostgreSQL.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Jay-kabdwal/staff-attendance-app.git
cd staff-attendance-app
```

### 🐍 2. Backend Setup (FastAPI + PostgreSQL)
a. Start PostgreSQL using Docker
Make sure Docker is running. Then execute:

```bash
docker run --name staff-postgres \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=staff_db \
  -p 5432:5432 -d postgres
```

### b. Create .env file inside /backend

```env
Copy
Edit
DATABASE_URL="postgresql://admin:password@localhost:5432/staff_db"
ADMIN_PASSWORD="your_secure_password_here"
```

### c. Setup Conda Environment
```bash
Copy
Edit
conda create --name staff-app python=3.9 -y
conda activate staff-app
```