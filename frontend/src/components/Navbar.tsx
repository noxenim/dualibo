import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

  const {
    user,
    loading,
    logout,
  } = useAuth();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">paird</Link>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/find">Find a Room</Link>
        <Link to="/create">Create a Room</Link>
      </div>

      {!loading && (
        <div className="nav-user">
          {user ? (
            <>
              <span className="nav-user-name">
                {user.name}
              </span>

              <button
                className="nav-logout"
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="button secondary small"
            >
              Log in
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;