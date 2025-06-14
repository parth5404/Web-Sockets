import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const EnterRoom = () => {
  const ipref = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  function join() {
    if (ipref.current && ipref.current.value.trim() !== "") {
      navigate(`/room/${ipref.current.value}`);
    } else {
      alert("Please enter a valid Room ID");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <div className="text-3xl font-bold mb-6">Join a Room</div>
      <div className="w-full max-w-md">
        <label
          htmlFor="room-input"
          className="block text-lg font-medium mb-2 text-gray-300"
        >
          Enter Room ID:
        </label>
        <input
          id="room-input"
          ref={ipref}
          type="text"
          placeholder="Enter room name"
          title="Room Name"
          className="w-full p-3 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <button
          onClick={join}
          className="w-full mt-4 px-4 py-2 bg-white text-black font-semibold rounded-md hover:bg-gray-300 transition duration-300"
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default EnterRoom;