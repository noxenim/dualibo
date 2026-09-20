from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(
        String,
        unique=True,
        nullable=False,
        index=True,
    )

    password_hash = Column(
        String,
        nullable=False,
    )

    rooms = relationship(
        "StudyRoom",
        back_populates="host_user",
    )

    room_participations = relationship(
        "RoomParticipant",
        back_populates="user",
    )


class StudyRoom(Base):
    __tablename__ = "study_rooms"

    id = Column(Integer, primary_key=True, index=True)

    topic = Column(String, nullable=False)
    description = Column(String, nullable=False)
    goal = Column(String, nullable=True)

    date = Column(String, nullable=False)
    time = Column(String, nullable=False)
    duration = Column(String, nullable=False)

    host_user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
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

    host_user = relationship(
        "User",
        back_populates="rooms",
    )

    participants = relationship(
        "RoomParticipant",
        back_populates="room",
        cascade="all, delete-orphan",
    )


class RoomParticipant(Base):
    __tablename__ = "room_participants"

    id = Column(Integer, primary_key=True, index=True)

    room_id = Column(
        Integer,
        ForeignKey("study_rooms.id"),
        nullable=False,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    room = relationship(
        "StudyRoom",
        back_populates="participants",
    )

    user = relationship(
        "User",
        back_populates="room_participations",
    )

    __table_args__ = (
        UniqueConstraint(
            "room_id",
            "user_id",
            name="unique_room_user",
        ),
    )