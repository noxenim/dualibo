from sqlalchemy import Boolean, Column, Integer, String

from database import Base


class StudyRoom(Base):
    __tablename__ = "study_rooms"

    id = Column(Integer, primary_key=True, index=True)

    topic = Column(String, nullable=False)
    description = Column(String, nullable=False)
    goal = Column(String, nullable=True)

    date = Column(String, nullable=False)
    time = Column(String, nullable=False)
    duration = Column(String, nullable=False)

    host = Column(String, nullable=False)

    participants = Column(
        Integer,
        nullable=False,
        default=1,
    )

    camera_on = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    intro_enabled = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    test_enabled = Column(
        Boolean,
        nullable=False,
        default=False,
    )

    study_mode = Column(
        String,
        nullable=False,
        default="Occasional discussion",
    )

    recurring = Column(
        Boolean,
        nullable=False,
        default=False,
    )