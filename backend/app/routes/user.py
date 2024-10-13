from fastapi import APIRouter, HTTPException, status
from ..models import User
from ..schemas.user import (
    CreateUserRequest, CreateUserResponse,
    UpdateUserRequest, UpdateUserResponse,
    GetUserResponse, DeleteUserResponse,
    LoginUserRequest, LoginUserResponse,
)

from ..database import engine
from ..utils.authorization import get_password_hash, encrypt_api_key, verify_password, create_access_token

router = APIRouter()


# User CRUD operations
@router.post("/users", response_model=CreateUserResponse)
async def create_user(user: CreateUserRequest):
    new_user = User(
        username=user.username,
        email=user.email,
        password=user.password,  # Ensure this is hashed
        api_key=user.api_key,  # Ensure this is hashed
        chats=[]
    )
    await engine.save(new_user)
    return CreateUserResponse(
        user_id=str(new_user.id),
        username=new_user.username,
        email=new_user.email
    )

@router.get("/users/{user_id}", response_model=GetUserResponse)
async def get_user(user_id: str):
    user = await engine.find_one(User, User.id == user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    await engine.populate(user, "chats")
    return GetUserResponse(
        user_id=str(user.id),
        username=user.username,
        email=user.email,
        chats=user.chats,
        created_at=user.created_at,
        updated_at=user.updated_at
    )

@router.put("/users/{user_id}", response_model=UpdateUserResponse)
async def update_user(user_id: str, user_update: UpdateUserRequest):
    user = await engine.find_one(User, User.id == user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user_update.username:
        user.username = user_update.username
    if user_update.email:
        user.email = user_update.email
    if user_update.password:
        user.password = user_update.password  # Ensure this is hashed
    if user_update.api_key:
        user.api_key = user_update.api_key  # Ensure this is hashed
    await engine.save(user)
    return UpdateUserResponse(
        user_id=str(user.id),
        username=user.username,
        email=user.email
    )

@router.delete("/users/{user_id}", response_model=DeleteUserResponse)
async def delete_user(user_id: str):
    user = await engine.find_one(User, User.id == user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    await engine.delete(user)
    return DeleteUserResponse(
        user_id=str(user.id),
        username=user.username,
        email=user.email,
        created_at=user.created_at,
        updated_at=user.updated_at
    )

# User Signup
@router.post("/users/signup", response_model=CreateUserResponse)
async def signup_user(user: CreateUserRequest):
    existing_user = await engine.find_one(User, User.email == user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists"
        )
    
    hashed_password = get_password_hash(user.password)
    encrypted_api_key = encrypt_api_key(user.api_key)
    new_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password,
        api_key=encrypted_api_key,
        chats=[],
        is_deactivated=False
    )
    await engine.save(new_user)

    return CreateUserResponse(
        user_id=str(new_user.id),
        username=new_user.username,
        email=new_user.email
    )

# User Login
@router.post("/users/login", response_model=LoginUserResponse)
async def login_user(user: LoginUserRequest):
    db_user = await engine.find_one(User, User.email == user.email)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    pwd_correct = verify_password(user.password, db_user.password)
    if not pwd_correct:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid password"
        )
    
    token = create_access_token(data={
        "user_id": str(db_user.id),
        "username": db_user.username,
        "api_key": db_user.api_key
    })

    return LoginUserResponse(
        user_id=str(db_user.id),
        username=db_user.username,
        email=db_user.email,
        token=token
    )