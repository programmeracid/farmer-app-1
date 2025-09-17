from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# -------------------
# Database Connection
# -------------------
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["mydb"]
users_collection = db["users"]
images_collection = db["images"]
tokens_collection = db["tokens"]  # NEW: store JWT tokens

# -------------------
# User Functions
# -------------------
def create_user(username: str, hashed_password: str):
    """Create a new user"""
    users_collection.insert_one({"username": username, "password": hashed_password})

def get_user(username: str):
    """Get user by username"""
    return users_collection.find_one({"username": username})

# -------------------
# Token Functions
# -------------------
def save_token(username: str, token: str):
    """Store JWT token for a user"""
    tokens_collection.insert_one({"username": username, "token": token})

def verify_token(token: str):
    """Check if token exists in DB"""
    return tokens_collection.find_one({"token": token})

def delete_token(token: str):
    """Remove a token (logout/invalidate)"""
    tokens_collection.delete_one({"token": token})

def delete_user_tokens(username: str):
    """Remove all tokens for a user"""
    tokens_collection.delete_many({"username": username})

# -------------------
# Image Functions
# -------------------
def save_image_metadata(username: str, filename: str, size: int):
    """Store uploaded image metadata"""
    images_collection.insert_one({
        "username": username,
        "filename": filename,
        "size": size
    })

def get_user_images(username: str):
    """Get all images for a user"""
    return list(images_collection.find({"username": username}))
