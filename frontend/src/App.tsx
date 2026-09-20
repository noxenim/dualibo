import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";

import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import FindRoom from "./pages/FindRoom";
import CreateRoom from "./pages/CreateRoom";
import StudyRoomPage from "./pages/StudyRoom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/find"
            element={<FindRoom />}
          />

          <Route
            path="/create"
            element={<CreateRoom />}
          />

          <Route
            path="/room/:roomId"
            element={<StudyRoomPage />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;