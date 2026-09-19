import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getRoom,
  type StudyRoom,
} from "../services/api";

function formatTime(time: string): string {
  const [hoursString, minutes] = time.split(":");

  let hours = Number(hoursString);

  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${period}`;
}

function StudyRoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState<
    StudyRoom | undefined
  >();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRoom() {
      if (!roomId) {
        return;
      }

      try {
        const data = await getRoom(
          Number(roomId)
        );

        setRoom(data);
      } catch (error) {
        console.error(error);

        setError(
          "Unable to load this study room."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRoom();
  }, [roomId]);

  if (loading) {
    return (
      <main className="study-room-page">
        <div className="empty-state page-empty">
          <h2>Loading study room...</h2>
        </div>
      </main>
    );
  }

  if (error || !room) {
    return (
      <main className="page">
        <nav className="navbar">
          <div className="logo">paird</div>
        </nav>

        <div className="empty-state page-empty">
          <h2>Room not found</h2>

          <p>
            {error ||
              "This study room doesn't exist anymore."}
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

        <span>{room.topic}</span>

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

            <p>
              {room.goal || room.description}
            </p>
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
              {room.participants === 2
                ? "Your study partner has joined."
                : "Waiting for a study partner to join."}
            </p>
          </div>

          <div className="session-settings">
            {room.camera_on && (
              <span>Camera on</span>
            )}

            {room.intro_enabled && (
              <span>5 min introduction</span>
            )}

            {room.test_enabled && (
              <span>End-of-session test</span>
            )}

            <span>{room.study_mode}</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default StudyRoomPage;