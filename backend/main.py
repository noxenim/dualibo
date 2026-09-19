from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import StudyRoom
from schemas import StudyRoomCreate, StudyRoomResponse


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


@app.post(
    "/rooms",
    response_model=StudyRoomResponse,
)
def create_room(
    room: StudyRoomCreate,
    db: Session = Depends(get_db),
):
    new_room = StudyRoom(
        topic=room.topic,
        description=room.description,
        goal=room.goal,
        date=room.date,
        time=room.time,
        duration=room.duration,
        host=room.host,
        participants=1,
        camera_on=room.camera_on,
        intro_enabled=room.intro_enabled,
        test_enabled=room.test_enabled,
        study_mode=room.study_mode,
        recurring=room.recurring,
    )

    db.add(new_room)
    db.commit()
    db.refresh(new_room)

    return new_room


@app.get(
    "/rooms",
    response_model=list[StudyRoomResponse],
)
def get_rooms(
    db: Session = Depends(get_db),
):
    return db.query(StudyRoom).all()


@app.get(
    "/rooms/{room_id}",
    response_model=StudyRoomResponse,
)
def get_room(
    room_id: int,
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

    return room


@app.post(
    "/rooms/{room_id}/join",
    response_model=StudyRoomResponse,
)
def join_room(
    room_id: int,
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

    if room.participants >= 2:
        raise HTTPException(
            status_code=409,
            detail="This study room is already full.",
        )

    room.participants += 1

    db.commit()
    db.refresh(room)

    return room