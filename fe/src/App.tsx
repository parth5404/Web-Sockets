import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EnterRoom from "./EnterRoom";
import ChatRoom from "./ChatRoom";
import { useEffect, useState, useRef } from 'react';

interface msgJson {
    type: string;
    payload: payload;
}

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