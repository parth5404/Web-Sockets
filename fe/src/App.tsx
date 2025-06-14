//import { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EnterRoom from "./EnterRoom";
import ChatRoom from "./ChatRoom";





function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<EnterRoom />} />
                <Route path="/chat/:roomId" element={<ChatRoom />} />
            </Routes>
        </Router>
    );
}

export default App;