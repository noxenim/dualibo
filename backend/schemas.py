from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True


class StudyRoomCreate(BaseModel):
    topic: str
    description: str
    goal: str | None = None

    date: str
    time: str
    duration: str

    camera_on: bool = True
    intro_enabled: bool = True
    test_enabled: bool = False

    study_mode: str = "Occasional discussion"

    recurring: bool = False


class StudyRoomResponse(BaseModel):
    id: int

    topic: str
    description: str
    goal: str | None

    date: str
    time: str
    duration: str

    host_id: int
    host_name: str

    participants: int

    camera_on: bool
    intro_enabled: bool
    test_enabled: bool

    study_mode: str
    recurring: bool