from fastapi import FastAPI, HTTPException, File, UploadFile, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from datetime import datetime
from auth import hash_password, verify_password, create_jwt_token, decode_jwt_token
import db
from inference import predict_breed

app = FastAPI()

# Allow requests from any origin (for testing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "./uploads"

# Create folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# -------------------
# Models
# -------------------
class User(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    token: str

# -------------------
# Signup
# -------------------
@app.post("/signup")
def signup(user: User):
    if db.get_user(user.username):
        raise HTTPException(status_code=400, detail="Username already exists")
    
    hashed = hash_password(user.password)
    db.create_user(user.username, hashed)
    return {"message": "User created successfully"}

# -------------------
# Login
# -------------------
@app.post("/login", response_model=TokenResponse)
def login(user: User):
    db_user = db.get_user(user.username)
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_jwt_token(user.username)
    db.save_token(user.username, token)
    return {"token": token}

@app.post("/upload")
async def upload_image(file: UploadFile = File(...), authorization: str = Header(...)):

    token = authorization.replace("Bearer ", "")
    if not db.verify_token(token):
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    # Save the file
    with open(file_path, "wb") as f:
        contents = await file.read()
        f.write(contents)
    
    pred_class, confidence = predict_breed(file_path)


    return {
        "pred_class" : pred_class,
        "confidence" : confidence
    }

@app.post("/logout")
def logout(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    db.delete_token(token)
    return {"message": "Logged out successfully"}