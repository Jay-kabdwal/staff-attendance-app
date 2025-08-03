Staff Face Recognition Attendance System
A mobile application allowing staff to mark attendance via facial recognition, with an admin panel for user management.

About The Project
This project is a full-stack, proof-of-concept mobile application designed to streamline the attendance process. Staff members can quickly mark their attendance by entering their Staff ID and taking a picture, which is then verified by the backend. An administrative section allows for easy management of staff records and their corresponding training images for the facial recognition model.

Tech Stack and Approach
Frontend: React Native (Expo)

Backend: FastAPI (Python)

Database: PostgreSQL (running in a Docker container)

Facial Recognition: face_recognition

The application uses a client-server model. The Expo frontend captures user input and images, sending them to the FastAPI backend. The backend handles all business logic, including facial recognition, and communicates with the PostgreSQL database for data storage and retrieval.

Getting Started
Follow these steps to set up and run the project locally.

1. Clone the Repository
First, clone the project repository to your local machine or download the ZIP file.

Bash

git clone <your-repository-url>
cd <your-project-directory>
2. Backend Setup
Start the Database (with Docker):

Make sure Docker Desktop is running. We use Docker to run the PostgreSQL database in a self-contained environment, which simplifies setup.

In your terminal, run this command to start the PostgreSQL database container:

Bash

docker run --name staff-postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=password -e POSTGRES_DB=staff_db -p 5432:5432 -d postgres
Set Up the .env File:

Navigate to the backend folder.

Create a file named .env.

Add the following lines, setting your own secure admin password:

DATABASE_URL="postgresql://admin:password@localhost:5432/staff_db"
ADMIN_PASSWORD="your_secure_password_here"
Install Dependencies with Conda:

Open the Anaconda Prompt.

Navigate to the backend folder.

Create and activate the Conda environment:

Bash

conda create --name staff-app python=3.9 -y
conda activate staff-app
Install all required packages:

Bash

conda install -c conda-forge fastapi uvicorn sqlalchemy psycopg2 numpy face-recognition python-dotenv -y
Run the Backend Server:

Bash

uvicorn main:app --reload --host 127.0.0.1
The backend will now be running at http://127.0.0.1:8000.

3. Frontend Setup
Navigate to the Frontend Folder:

Open a new, separate terminal and navigate to the frontend directory.

Install Dependencies:

Bash

npx expo install
Update IP Address:

You must replace the placeholder IP address (e.g., 172.26.128.1) in the frontend files (like frontend/app/(tabs)/index.tsx) with your computer's local IP address. Run ipconfig (Windows) or ifconfig (macOS/Linux) to find it.

Run the Frontend App:

Install the Expo Go app on your phone.

Make sure your phone and computer are on the same Wi-Fi network.

Run the start command:

Bash

npm start
Scan the QR code from the terminal with your Expo Go app.

Future Improvements
How the User Search Was Improved
The initial approach involved comparing a new face against the entire database of saved faces (1-vs-all). This was a major performance bottleneck.

The current, improved approach requires the staff member to enter their unique ID. The backend then fetches only the saved images for that specific ID and performs a much faster 1-vs-1 comparison. This is highly efficient and scales well as the number of users grows.

Other Potential Improvements
Advanced Authentication: Implement a proper database-backed user and admin authentication system using JWT (JSON Web Tokens).

Cloud Storage: Move image storage from the local server disk to a cloud solution like Amazon S3 for better scalability and reliability.

Pagination: Implement pagination on the attendance report endpoints to handle large datasets efficiently.

Containerization: Use Docker to containerize the backend application for easy and consistent deployment to any cloud provider.