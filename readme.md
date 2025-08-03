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
DATABASE_URL="postgresql://admin:password@localhost:5432/staff_db"
ADMIN_PASSWORD="your_secure_password_here"
```

### c. Setup Conda Environment
```bash
conda create --name staff-app python=3.9 -y
conda activate staff-app
```
### d. Install Dependencies
```bash
conda install -c conda-forge fastapi uvicorn sqlalchemy psycopg2 numpy face-recognition python-dotenv -y
```

### e.Run the Backend Server
```bash
cd backend
uvicorn main:app --reload --host 127.0.0.1
```

*** Your backend should now be running at http://127.0.0.1:8000 ***

### 📲 3. Frontend Setup (React Native + Expo)

### a. Navigate to frontend folder
```bash
cd ../frontend
```
### b. Install Dependencies
```bash
npx expo install
```

### c. Update Backend IP in Code
Replace any placeholder IPs like:

```ts
const backendUrl = 'http://172.26.128.1:8000/api/...';
```

with your actual local IP (e.g., http://192.168.x.x:8000).
You can get it via:

Windows: ipconfig

macOS/Linux: ifconfig

### d. Start the Frontend App
```bash
npm start
```
Scan the QR code using Expo Go.

Ensure your phone and PC are connected to the same Wi-Fi network.

### 📦 Folder Structure
```bash
staff-attendance-app/
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── uploads/
│   └── .env
├── frontend/
│   ├── app/
│   │   ├── (tabs)/index.tsx         # Staff mark attendance
│   │   ├── (tabs)/report.tsx        # Staff view report
│   │   ├── (admin)/dashboard.tsx    # Admin panel
│   │   ├── (admin)/add-staff.tsx    # Admin adds staff
│   │   └── (admin)/staff-list.tsx   # Admin views staff
├── README.md
└── .gitignore
```

***How the User Search Was Improved***
The initial approach involved comparing a new face against the entire database of saved faces (1-vs-all). This was a major performance bottleneck.

The current, improved approach requires the staff member to enter their unique ID. The backend then fetches only the saved images for that specific ID and performs a much faster 1-vs-1 comparison. This is highly efficient and scales well as the number of users grows.

## Other Potential Improvements
Advanced Authentication: Implement a proper database-backed user and admin authentication system using JWT (JSON Web Tokens).

Cloud Storage: Move image storage from the local server disk to a cloud solution like Amazon S3 for better scalability and reliability.

Pagination: Implement pagination on the attendance report endpoints to handle large datasets efficiently.

Containerization: Use Docker to containerize the backend application for easy and consistent deployment to any cloud provider.
