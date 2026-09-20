from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from auth import (
    create_access_token,
    get_current_user,
    get_optional_current_user,
    hash_password,
    verify_password,
)
from database import Base, engine, get_db
from models import (
    RoomParticipant,
    StudyRoom,
    User,
)
from schemas import (
    LoginRequest,
    RegisterRequest,
    StudyRoomCreate,
    StudyRoomResponse,
    TokenResponse,
    UserResponse,
)


Base.metadata.create_all(bind=engine)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "paird backend is running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


# -------------------------
# AUTHENTICATION
# -------------------------


@app.post(
    "/auth/register",
    response_model=UserResponse,
)
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db),
):
    existing_user = (
        db.query(User)
        .filter(User.email == request.email.lower())
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists.",
        )

    user = User(
        name=request.name.strip(),
        email=request.email.lower(),
        password_hash=hash_password(
            request.password
        ),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@app.post(
    "/auth/login",
    response_model=TokenResponse,
)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(
            User.email == request.email.lower()
        )
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    if not verify_password(
        request.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    token = create_access_token(user.id)

    return {
        "access_token": token,
        "token_type": "bearer",
    }

@app.post(
    "/auth/token",
    response_model=TokenResponse,
)
def token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(
            User.email == form_data.username.lower()
        )
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    if not verify_password(
        form_data.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    token = create_access_token(user.id)

    return {
        "access_token": token,
        "token_type": "bearer",
    }

@app.get(
    "/auth/me",
    response_model=UserResponse,
)
def me(
    current_user: User = Depends(
        get_current_user
    ),
):
    return current_user


# -------------------------
# STUDY ROOMS
# -------------------------


def room_to_response(
    room: StudyRoom,
    current_user: User | None = None,
) -> dict:

    is_host = (
        current_user is not None
        and room.host_user_id == current_user.id
    )

    has_joined = (
        current_user is not None
        and any(
            participant.user_id == current_user.id
            for participant in room.participants
        )
    )

    is_full = len(room.participants) >= 2

    return {
        "id": room.id,

        "topic": room.topic,
        "description": room.description,
        "goal": room.goal,

        "date": room.date,
        "time": room.time,
        "duration": room.duration,

        "host_id": room.host_user_id,
        "host_name": room.host_user.name,

        "participants": len(room.participants),

        "camera_on": room.camera_on,
        "intro_enabled": room.intro_enabled,
        "test_enabled": room.test_enabled,

        "study_mode": room.study_mode,
        "recurring": room.recurring,

        "is_host": is_host,
        "has_joined": has_joined,
        "is_full": is_full,
    }


@app.post(
    "/rooms",
    response_model=StudyRoomResponse,
)
def create_room(
    room: StudyRoomCreate,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    new_room = StudyRoom(
        topic=room.topic,
        description=room.description,
        goal=room.goal,

        date=room.date,
        time=room.time,
        duration=room.duration,

        host_user_id=current_user.id,

        camera_on=room.camera_on,
        intro_enabled=room.intro_enabled,
        test_enabled=room.test_enabled,

        study_mode=room.study_mode,
        recurring=room.recurring,
    )

    db.add(new_room)
    db.flush()

    host_participant = RoomParticipant(
        room_id=new_room.id,
        user_id=current_user.id,
    )

    db.add(host_participant)

    db.commit()
    db.refresh(new_room)

    return room_to_response(new_room)


@app.get(
    "/rooms",
    response_model=list[StudyRoomResponse],
)
def get_rooms(
    current_user: User | None = Depends(
        get_optional_current_user
    ),
    db: Session = Depends(get_db),
):
    rooms = (
        db.query(StudyRoom)
        .order_by(
            StudyRoom.date,
            StudyRoom.time,
        )
        .all()
    )

    return [
    room_to_response(
        room,
        current_user,
    )
    for room in rooms
]

@app.get(
    "/rooms/{room_id}",
    response_model=StudyRoomResponse,
)
def get_room(
    room_id: int,
    current_user: User | None = Depends(
        get_optional_current_user
    ),
    db: Session = Depends(get_db),
):
    room = (
        db.query(StudyRoom)
        .filter(StudyRoom.id == room_id)
        .first()
    )

    if room is None:
        raise HTTPException(
            status_code=404,
            detail="Study room not found.",
        )

    return room_to_response(
    room,
    current_user,
)


@app.post(
    "/rooms/{room_id}/join",
    response_model=StudyRoomResponse,
)
def join_room(
    room_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    room = (
        db.query(StudyRoom)
        .filter(StudyRoom.id == room_id)
        .first()
    )

    if room is None:
        raise HTTPException(
            status_code=404,
            detail="Study room not found.",
        )

    already_joined = (
        db.query(RoomParticipant)
        .filter(
            RoomParticipant.room_id == room_id,
            RoomParticipant.user_id == current_user.id,
        )
        .first()
    )

    if already_joined:
        return room_to_response(
            room,
            current_user,
        )

    if len(room.participants) >= 2:
        raise HTTPException(
            status_code=409,
            detail="This study room is already full.",
        )

    participant = RoomParticipant(
        room_id=room_id,
        user_id=current_user.id,
    )

    db.add(participant)
    db.commit()
    db.refresh(room)

    return room_to_response(
    room,
    current_user,
)