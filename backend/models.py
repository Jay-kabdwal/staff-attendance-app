# models.py
import os
import datetime
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Staff(Base):
    __tablename__ = 'staff'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    images = relationship("StaffImage", back_populates="staff")

class StaffImage(Base):
    __tablename__ = 'staff_images'
    id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(Integer, ForeignKey('staff.id'))
    image_path = Column(String)
    encoding = Column(String)
    staff = relationship("Staff", back_populates="images")

class Attendance(Base):
    __tablename__ = 'attendance'
    id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(Integer, ForeignKey('staff.id'))
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

Base.metadata.create_all(bind=engine)