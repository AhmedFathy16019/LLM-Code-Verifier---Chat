from datetime import datetime, timedelta, timezone
from typing import Annotated
from ..models import TokenData, User
from ..database import engine
from odmantic import ObjectId

import jwt
from fastapi import Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from cryptography.fernet import Fernet

from dotenv import load_dotenv
import os


# Load environment variables
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_HOURS = os.getenv("ACCESS_TOKEN_EXPIRE_HOURS")
FERNET_KEY = os.getenv("FERNET_KEY")


# Configure CryptContext for passwords and API keys
pwd_context = CryptContext(
    schemes=["bcrypt"],
    bcrypt__default_rounds=12,
    deprecated="auto",
)
cipher = Fernet(FERNET_KEY)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Utility Function for hashing passwords
def get_password_hash(password: str):
    return pwd_context.hash(password)

# Utility Function for verifying passwords
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# Utility Function for encrypting API keys
def encrypt_api_key(api_key: str):
    return cipher.encrypt(api_key.encode())

# Utility Function for decrypting API keys
def decrypt_api_key(encrypted_api_key: str):
    return cipher.decrypt(encrypted_api_key.encode()).decode()

# Utility Function for creating access tokens
def create_access_token(data: TokenData, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(hours=int(ACCESS_TOKEN_EXPIRE_HOURS))

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str):  
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        token_data = TokenData(**payload)
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token_data

async def authorize_token(token: str):
    token_data = decode_token(token)
    user_id = token_data.user_id
    user = await engine.find_one(User, User.id == ObjectId(user_id))
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    if user.is_deactivated:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User is deactivated",
        )
    
    token_data.api_key = decrypt_api_key(token_data.api_key)
    return token_data