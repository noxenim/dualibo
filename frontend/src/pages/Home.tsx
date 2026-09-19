import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home">
      <nav className="navbar">
        <div className="logo">paird</div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/find">Find a Room</Link>
          <Link to="/create">Create a Room</Link>
        </div>

        <div className="profile-placeholder">
          A
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">ONE-ON-ONE STUDY</p>

          <h1>
            Study feels
            <br />
            different with someone.
          </h1>

          <p className="hero-description">
            Find someone who wants to study at the same time.
            Share the time. Make it happen.
          </p>

          <div className="hero-buttons">
            <Link to="/find" className="button primary">
              Find a Study Room →
            </Link>

            <Link to="/create" className="button secondary">
              Create a Room
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <div className="image-placeholder">
            Study together
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <div className="feature-icon">◯</div>
          <h3>One-on-one</h3>
          <p>Only you and one study partner.</p>
        </div>

        <div className="feature">
          <div className="feature-icon">◯</div>
          <h3>Meet people</h3>
          <p>Study with people you would never normally meet.</p>
        </div>

        <div className="feature">
          <div className="feature-icon">◯</div>
          <h3>Build consistency</h3>
          <p>Turn good sessions into regular study habits.</p>
        </div>
      </section>
    </main>
  );
}

export default Home;