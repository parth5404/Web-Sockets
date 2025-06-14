import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EnterRoom from "./EnterRoom";
import ChatRoom from "./ChatRoom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EnterRoom />} />
        <Route path="/room/:roomId" element={<ChatRoom />} />
      </Routes>
    </Router>
  );
}

export default App;