# 🐄 Cattle Breed Detection App

This repository contains a **full-stack application** that helps farmers identify the breed of their cattle by capturing or uploading images.  
The app connects with a **Machine Learning model** via a FastAPI backend, predicts the breed, and provides additional breed details or wiki information.

---

## 🚀 Project Structure

The project is organized into two main branches:

- **`Frontend`** → React Native (Expo) mobile app  
  - Capture cattle images using the camera  
  - Preview and retake before uploading  
  - Upload securely with JWT authentication  
  - Display predicted breed with extra breed details / wiki info  

- **`Backend`** → Python FastAPI server  
  - User authentication (Signup / Login with JWT)  
  - Handles image uploads from farmers  
  - Connects to a **Machine Learning model** to predict cattle breed  
  - Stores user & image metadata in MongoDB  

---

## 🌱 Branches

- `Frontend` → Expo React Native mobile app  
- `Backend` → FastAPI backend server with ML integration  

---


