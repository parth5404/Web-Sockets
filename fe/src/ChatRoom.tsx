import { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";

interface Payload {
    default?: string;
    roomId?: string;
    message?: string;
}

interface MsgJson {
    type: string;
    payload: Payload;
}

const ChatRoom = () => {
    const { roomId } = useParams();
    const ipref = useRef<HTMLInputElement>(null);
    const socketref = useRef<WebSocket | null>(null);
    const [msg, setmsg] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(function () {
        try {
            const ws = new WebSocket("ws://localhost:9200");
            socketref.current = ws;

            ws.onopen = () => {
                console.log("WebSocket connection established");
                const join: MsgJson = {
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
    }, [roomId]);

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
        const chat: MsgJson = {
            type: "chat",
            payload: {
                message: message,
            }
        };

        try {
            console.log("Sending message:", chat);
            ws.send(JSON.stringify(chat));
            console.log("Adding to UI with You: prefix");
            setmsg((prev) => [...prev, `You: ${message}`]);
            ipref.current.value = '';
        } catch (err) {
            setError("Failed to send message");
            console.error("Error sending message:", err);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                        Chat Room: {roomId}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Real-time messaging platform</p>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Chat Container */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
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
                                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                                    }`}
                                >
                                    <p className="text-sm font-medium">{msg}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
                        <div className="flex items-center space-x-4">
                            <input
                                ref={ipref}
                                type="text"
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                                onKeyUp={(e) => {
                                    if (e.key === 'Enter') {
                                        send();
                                    }
                                }}
                            />
                            <button
                                onClick={send}
                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
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