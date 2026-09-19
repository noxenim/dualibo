from pydantic import BaseModel


class StudyRoomCreate(BaseModel):
    topic: str
    description: str
    goal: str | None = None

    date: str
    time: str
    duration: str

    host: str

    camera_on: bool = True
    intro_enabled: bool = True
    test_enabled: bool = False

    study_mode: str = "Occasional discussion"

    recurring: bool = False


class StudyRoomResponse(StudyRoomCreate):
    id: int
    participants: int

    class Config:
        from_attributes = True