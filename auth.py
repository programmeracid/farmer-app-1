from passlib.context import CryptContext
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hash password
def hash_password(password: str):
    return pwd_context.hash(password)

# Verify password
def verify_password(password: str, hashed: str):
    return pwd_context.verify(password, hashed)

# Generate JWT token
def create_jwt_token(username: str):
    token = jwt.encode({"username": username}, SECRET_KEY, algorithm=ALGORITHM)
    return token

# Verify JWT token
def decode_jwt_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("username")
    except jwt.PyJWTError:
        return None
