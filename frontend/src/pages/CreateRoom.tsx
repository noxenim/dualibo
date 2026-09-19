import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createRoom } from "../services/api";

function CreateRoom() {
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [goal, setGoal] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("1 hour");

  const [cameraOn, setCameraOn] = useState(true);
  const [introEnabled, setIntroEnabled] = useState(true);
  const [testEnabled, setTestEnabled] = useState(false);

  const [studyMode, setStudyMode] =
    useState("Occasional discussion");

  const [recurring, setRecurring] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreateRoom(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }

    if (!date) {
      setError("Please select a date.");
      return;
    }

    if (!time) {
      setError("Please select a start time.");
      return;
    }

    try {
      setLoading(true);

      await createRoom({
        topic: topic.trim(),
        description: goal.trim() || "Study session",
        goal: goal.trim() || null,
        date,
        time,
        duration,
        host: "You",
        camera_on: cameraOn,
        intro_enabled: introEnabled,
        test_enabled: testEnabled,
        study_mode: studyMode,
        recurring,
      });

      navigate("/find");
    } catch (err) {
      console.error(err);
      setError(
        "Unable to create the room. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <nav className="navbar">
        <div className="logo">paird</div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/find">Find a Room</Link>
          <Link to="/create">Create a Room</Link>
        </div>

        <div className="profile-placeholder">A</div>
      </nav>

      <section className="create-page">
        <div className="page-header">
          <div>
            <p className="eyebrow">CREATE</p>

            <h1>Create a Study Room</h1>

            <p>
              Set your preferences and find the right study
              partner.
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateRoom}>
          <section className="form-section">
            <h2>Basic Details</h2>

            <div className="form-grid">
              <label>
                Topic / Subject

                <input
                  value={topic}
                  onChange={(event) =>
                    setTopic(event.target.value)
                  }
                  placeholder="e.g. Machine Learning"
                />
              </label>

              <label>
                Study Goal

                <input
                  value={goal}
                  onChange={(event) =>
                    setGoal(event.target.value)
                  }
                  placeholder="e.g. Finish Chapter 3"
                />
              </label>

              <label>
                Date

                <input
                  type="date"
                  value={date}
                  onChange={(event) =>
                    setDate(event.target.value)
                  }
                />
              </label>

              <label>
                Start Time

                <input
                  type="time"
                  value={time}
                  onChange={(event) =>
                    setTime(event.target.value)
                  }
                />
              </label>

              <label>
                Duration

                <select
                  value={duration}
                  onChange={(event) =>
                    setDuration(event.target.value)
                  }
                >
                  <option>30 minutes</option>
                  <option>45 minutes</option>
                  <option>1 hour</option>
                  <option>1.5 hours</option>
                  <option>2 hours</option>
                </select>
              </label>
            </div>
          </section>

          <section className="form-section">
            <h2>Room Settings</h2>

            <div className="setting">
              <div>
                <strong>Camera</strong>
                <p>
                  Both participants must have their camera on.
                </p>
              </div>

              <input
                type="checkbox"
                checked={cameraOn}
                onChange={(event) =>
                  setCameraOn(event.target.checked)
                }
              />
            </div>

            <div className="setting">
              <div>
                <strong>5-minute introduction</strong>
                <p>
                  Start with a short conversation before
                  studying.
                </p>
              </div>

              <input
                type="checkbox"
                checked={introEnabled}
                onChange={(event) =>
                  setIntroEnabled(event.target.checked)
                }
              />
            </div>

            <div className="setting">
              <div>
                <strong>End-of-session test</strong>
                <p>
                  Both participants can create a short test
                  for each other.
                </p>
              </div>

              <input
                type="checkbox"
                checked={testEnabled}
                onChange={(event) =>
                  setTestEnabled(event.target.checked)
                }
              />
            </div>

            <div className="setting">
              <div>
                <strong>Study mode</strong>
                <p>
                  How much do you want to talk during the
                  session?
                </p>
              </div>

              <select
                value={studyMode}
                onChange={(event) =>
                  setStudyMode(event.target.value)
                }
              >
                <option>Silent</option>
                <option>Occasional discussion</option>
                <option>Discussion welcome</option>
              </select>
            </div>
          </section>

          <section className="form-section">
            <h2>Recurrence</h2>

            <div className="setting">
              <div>
                <strong>
                  Make this a recurring room
                </strong>

                <p>
                  Repeat this room on a regular schedule.
                </p>
              </div>

              <input
                type="checkbox"
                checked={recurring}
                onChange={(event) =>
                  setRecurring(event.target.checked)
                }
              />
            </div>
          </section>

          {error && (
            <p
              style={{
                color: "#b42318",
                fontFamily: "Arial, sans-serif",
                fontSize: "13px",
                marginTop: "20px",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="button primary create-button"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Room"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default CreateRoom;