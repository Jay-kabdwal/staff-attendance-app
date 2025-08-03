import face_recognition
import numpy as np
from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
import os
import io
import uuid
from models import SessionLocal, Staff, StaffImage, Attendance

# Create uploads directory if not exists
if not os.path.exists("uploads"):
    os.makedirs("uploads")

app = FastAPI(title="Staff Face Recognition Attendance System")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class PasswordModel(BaseModel):
    password: str

# DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Admin login
@app.post("/api/admin/login")
def admin_login(request: PasswordModel):
    correct_password = os.getenv('ADMIN_PASSWORD')
    if not correct_password:
        raise HTTPException(status_code=500, detail="Admin password not configured on server.")
    if request.password == correct_password:
        return {"status": "success", "message": "Login successful."}
    else:
        raise HTTPException(status_code=401, detail="Incorrect password.")

# Add staff
@app.post("/api/staff")
def add_staff(name: str = Form(...), db: Session = Depends(get_db)):
    new_staff = Staff(name=name)
    db.add(new_staff)
    db.commit()
    db.refresh(new_staff)
    return new_staff

# Get all registered staff
@app.get("/api/all-staff")
def get_all_staff(db: Session = Depends(get_db)):
    staff = db.query(Staff).all()
    return [{"id": s.id, "name": s.name} for s in staff]

# Upload training image
@app.post("/api/staff/{staff_id}/upload-image")
async def upload_staff_image(staff_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = f"uploads/{unique_filename}"
    image_bytes = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(image_bytes)

    try:
        image = face_recognition.load_image_file(io.BytesIO(image_bytes))
        encodings = face_recognition.face_encodings(image)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {e}")

    if not encodings:
        raise HTTPException(status_code=400, detail="No face found in the uploaded image.")

    encoding_str = ",".join(map(str, encodings[0]))
    new_image = StaffImage(staff_id=staff_id, image_path=file_path, encoding=encoding_str)
    db.add(new_image)
    db.commit()
    return {"filename": unique_filename, "message": "Training image and encoding stored successfully."}

# Mark attendance
@app.post("/api/attendance/{staff_id}/mark")
async def mark_attendance(staff_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    known_encodings_data = db.query(StaffImage).filter(StaffImage.staff_id == staff_id).all()
    if not known_encodings_data:
        raise HTTPException(status_code=404, detail="Staff member not found or has no training images.")

    known_encodings = [np.fromstring(data.encoding, sep=',').astype(np.float32) for data in known_encodings_data]
    unknown_image_bytes = await file.read()

    try:
        unknown_image = face_recognition.load_image_file(io.BytesIO(unknown_image_bytes))
        unknown_encodings = face_recognition.face_encodings(unknown_image)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image for attendance: {e}")

    if not unknown_encodings:
        raise HTTPException(status_code=400, detail="No face found in the provided image.")

    for face_encoding in unknown_encodings:
        matches = face_recognition.compare_faces(known_encodings, face_encoding, tolerance=0.5)
        if True in matches:
            attendance_record = Attendance(staff_id=staff_id)
            db.add(attendance_record)
            db.commit()
            staff_member = db.query(Staff).filter(Staff.id == staff_id).first()
            return {"status": "success", "message": f"Welcome, {staff_member.name}! Attendance marked."}

    raise HTTPException(status_code=401, detail="Face does not match the provided staff ID.")

# Get all attendance records with staff names
@app.get("/api/attendance")
def get_attendance(db: Session = Depends(get_db)):
    records = (
        db.query(Attendance.id, Attendance.timestamp, Staff.id.label("staff_id"), Staff.name)
        .join(Staff, Attendance.staff_id == Staff.id)
        .order_by(Attendance.timestamp.desc())
        .all()
    )

    return [
        {
            "id": r.id,
            "staff_id": r.staff_id,
            "name": r.name,
            "timestamp": r.timestamp.isoformat()
        }
        for r in records
    ]

# Get attendance for a specific staff member
@app.get("/api/attendance/{staff_id}")
def get_attendance_for_staff(staff_id: int, db: Session = Depends(get_db)):
    records = (
        db.query(Attendance.id, Attendance.timestamp, Staff.id.label("staff_id"), Staff.name)
        .join(Staff, Attendance.staff_id == Staff.id)
        .filter(Staff.id == staff_id)
        .order_by(Attendance.timestamp.desc())
        .all()
    )

    return [
        {
            "id": r.id,
            "staff_id": r.staff_id,
            "name": r.name,
            "timestamp": r.timestamp.isoformat()
        }
        for r in records
    ]
