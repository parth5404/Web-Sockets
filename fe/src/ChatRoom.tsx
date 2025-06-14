import { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";

interface payload {
    default?: string;
    roomId?: string;
    message?: string;
}

const ChatRoom = () => {
    const ipref = useRef<HTMLInputElement>(null);
    const socketref = useRef<WebSocket | null>(null);
    const [msg, setmsg] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { roomId } = useParams();

    useEffect(function () {
        try {
            const ws = new WebSocket("https://web-sockets-598n.onrender.com");
            socketref.current = ws;

            ws.onopen = () => {
                console.log("WebSocket connection established");
                const join = {
                    type: "join",
                    payload: {
                        roomId: roomId,
                    }
                };
                ws.send(JSON.stringify(join));
            };

            ws.onmessage = (ev) => {
                console.log("Received message from server:", ev.data);
                setmsg((prev) => [...prev, ev.data]);
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
                setError("Failed to connect to the chat server");
            };

            ws.onclose = () => {
                console.log("WebSocket connection closed");
                setError("Connection to chat server was closed");
            };

            return () => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.close();
                }
            };
        } catch (err) {
            setError("Failed to establish WebSocket connection");
            console.error("WebSocket connection error:", err);
        }
    }, []);

    function send() {
        const ws = socketref.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            setError("WebSocket is not connected");
            return;
        }
        if (!ipref.current || !ipref.current.value.trim()) {
            return;
        }

        const message = ipref.current.value.trim();
        const chat = {
            type: "chat",
            payload: {
                message: message,
            }
        };

        try {
            ws.send(JSON.stringify(chat));
            setmsg((prev) => [...prev, `You: ${message}`]);
            ipref.current.value = '';
        } catch (err) {
            setError("Failed to send message");
            console.error("Error sending message:", err);
        }
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
            {/* Star Animation */}
            <div className="absolute inset-0 z-0">
                <div className="w-full h-full bg-black">
                    <div className="absolute inset-0 bg-black overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full animate-stars"></div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto p-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold tracking-wide border-b border-white pb-2">
                        Chat Room
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg">Real-time messaging platform</p>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-600 text-white rounded-lg">
                        {error}
                    </div>
                )}

                {/* Chat Container */}
                <div className="bg-black rounded-2xl shadow-xl overflow-hidden border border-white">
                    {/* Messages Area */}
                    <div className="h-[500px] overflow-y-auto p-6 space-y-4">
                        {msg.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.startsWith("You:") ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                        msg.startsWith("You:")
                                            ? "bg-blue-500 text-white rounded-br-none"
                                            : "bg-gray-800 text-gray-300 rounded-bl-none"
                                    }`}
                                >
                                    <p className="text-sm font-medium">{msg}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-white p-4 bg-black">
                        <div className="flex items-center space-x-4">
                            <input
                                ref={ipref}
                                type="text"
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-black text-gray-300 placeholder-gray-500 transition-all duration-200"
                                onKeyUp={(e) => {
                                    if (e.key === 'Enter') {
                                        send();
                                    }
                                }}
                            />
                            <button
                                onClick={send}
                                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;