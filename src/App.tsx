import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import FindRoom from "./pages/FindRoom";
import CreateRoom from "./pages/CreateRoom";
import StudyRoomPage from "./pages/StudyRoom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find" element={<FindRoom />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route
          path="/room/:roomId"
          element={<StudyRoomPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;