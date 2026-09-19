import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getRoomById,
  type StudyRoom,
} from "../data/rooms";

function formatTime(time: string): string {
  const [hoursString, minutes] = time.split(":");

  let hours = Number(hoursString);

  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${period}`;
}

function StudyRoomPage                                                () {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState<
    StudyRoom | undefined
  >();

  useEffect(() => {
    if (!roomId) {
      return;
    }

    const foundRoom = getRoomById(roomId);

    setRoom(foundRoom);
  }, [roomId]);

  if (!room) {
    return (
      <main className="page">
        <nav className="navbar">
          <div className="logo">paird</div>
        </nav>

        <div className="empty-state page-empty">
          <h2>Room not found</h2>

          <p>
            This study room doesn't exist anymore.
          </p>

          <Link
            to="/find"
            className="button primary"
          >
            Find another room
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="study-room-page">
      <nav className="study-room-nav">
        <Link to="/" className="logo">
          paird
        </Link>

        <span>
          {room.topic}
        </span>

        <button
          className="button secondary"
          onClick={() => navigate("/find")}
        >
          Leave Room
        </button>
      </nav>

      <section className="study-room-content">
        <div className="study-room-header">
          <div>
            <p className="eyebrow">
              STUDY SESSION
            </p>

            <h1>{room.topic}</h1>

            <p>{room.goal || room.description}</p>
          </div>

          <div className="session-time">
            {formatTime(room.time)}
          </div>
        </div>

        <div className="video-grid">
          <div className="video-card">
            <div className="video-placeholder">
              <span>You</span>
            </div>

            <div className="video-name">
              You
            </div>
          </div>

          <div className="video-card">
            <div className="video-placeholder partner">
              <span>Study Partner</span>
            </div>

            <div className="video-name">
              Study Partner
            </div>
          </div>
        </div>

        <div className="session-panel">
          <div>
            <span className="session-label">
              SESSION
            </span>

            <h2>Get ready to study</h2>

            <p>
              Your study session is scheduled for{" "}
              <strong>
                {formatTime(room.time)}
              </strong>
              .
            </p>
          </div>

          <div className="session-settings">
            {room.cameraOn && (
              <span>Camera on</span>
            )}

            {room.introEnabled && (
              <span>5 min introduction</span>
            )}

            {room.testEnabled && (
              <span>End-of-session test</span>
            )}

            <span>{room.studyMode}</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default StudyRoomPage;