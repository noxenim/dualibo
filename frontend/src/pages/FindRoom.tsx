import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import {
  getRooms,
  joinRoom,
  type StudyRoom,
} from "../services/api";

function formatTime(time: string): string {
  const [hoursString, minutes] = time.split(":");

  let hours = Number(hoursString);

  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${period}`;
}

function formatDate(date: string): string {
  const today = new Date();

  const todayString =
    `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(
      today.getDate()
    ).padStart(2, "0")}`;

  if (date === todayString) {
    return "Today";
  }

  const roomDate = new Date(`${date}T00:00:00`);

  return roomDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function FindRoom() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<StudyRoom[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRooms() {
      try {
        setLoading(true);
        const data = await getRooms();
        setRooms(data);
      } catch (err) {
        console.error(err);
        setError(
          "Unable to load study rooms. Make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRooms();
  }, []);

  const filteredRooms = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return rooms;
    }

    return rooms.filter(
      (room) =>
        room.topic.toLowerCase().includes(query) ||
        room.description
          .toLowerCase()
          .includes(query) ||
        room.host_name.toLowerCase().includes(query)
    );
  }, [rooms, search]);

  return (
    <main className="page">
      <Navbar />

      <section className="page-header">
        <div>
          <p className="eyebrow">STUDY TOGETHER</p>

          <h1>Find a Study Room</h1>

          <p>
            Choose a room that matches your interests and
            schedule.
          </p>
        </div>

        <Link
          to="/create"
          className="button secondary"
        >
          Create a Room
        </Link>
      </section>

      <div className="search-bar">
        <input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search by topic, subject or keyword..."
        />
      </div>

      <div className="filters">
        <button>Today</button>
        <button>Tomorrow</button>
        <button>Pick a date</button>
        <button>Subject</button>
        <button>Time</button>
        <button>More filters</button>
      </div>

      <section className="rooms">
        {loading && (
          <div className="empty-state">
            <h2>Loading rooms...</h2>
          </div>
        )}

        {!loading && error && (
          <div className="empty-state">
            <h2>Something went wrong</h2>
            <p>{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          filteredRooms.length === 0 && (
            <div className="empty-state">
              <h2>No study rooms found</h2>

              <p>
                Try another search or create a room yourself.
              </p>

              <Link
                to="/create"
                className="button primary"
              >
                Create a Room
              </Link>
            </div>
          )}

        {!loading &&
          !error &&
          filteredRooms.map((room) => (
            <article
              className="room-card"
              key={room.id}
            >
              <div className="room-time">
                <strong>
                  {formatTime(room.time)}
                </strong>

                <span>
                  {formatDate(room.date)}
                </span>

                <span>{room.duration}</span>
              </div>

              <div className="room-info">
                <h2>{room.topic}</h2>

                <p>{room.description}</p>

                <div className="room-meta">
                  <span>
                    {room.participants} / 2
                  </span>

                  {room.camera_on && (
                    <span>Camera on</span>
                  )}

                  {room.intro_enabled && (
                    <span>5 min intro</span>
                  )}

                  <span>
                    {room.test_enabled
                      ? "Test enabled"
                      : "No test"}
                  </span>
                </div>

                <div className="room-tags">
                  <span>{room.study_mode}</span>

                  {room.recurring && (
                    <span>Recurring</span>
                  )}
                </div>
              </div>

              <div className="room-host">
                <span>by {room.host_name}</span>

                <button
                  className="button primary small"
                  disabled={room.participants >= 2}
                  onClick={async () => {
                    try {
                      await joinRoom(room.id);

                      navigate(`/room/${room.id}`);
                    } catch (error) {
                      console.error(error);

                      alert(
                        error instanceof Error
                          ? error.message
                          : "Unable to join room."
                      );
                    }
                  }}
                >
                  {room.participants >= 2
                    ? "Full"
                    : "Join Room"}
                </button>
              </div>
            </article>
          ))}
      </section>
    </main>
  );
}

export default FindRoom;