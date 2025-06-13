import React, { useEffect, useState ,useRef} from 'react';

const App = () => {
  //const [socket, setSocket] = useState<WebSocket | null>(null);
  const [val, setVal] = useState<string>("");
  //const [message, setMessage] = useState("");
  const ipref = useRef<any>(null);
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:9200");
    socketRef.current=ws

    ws.onmessage = (ev) => {
      setVal(ev.data);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    
    return () => {
      ws.close();
    };
  }, []);

  function send() {
    const ws = socketRef.current; // Access the WebSocket instance from the ref
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not open.");
      return;
    }
    ws.send(ipref.current.value); // Send the input value to the server
  }

  return (
    <div>
      <input
        ref={ipref}
        type="text"
        placeholder="Message"
      ></input>
      <button onClick={send}>Send</button>
      <div>Server Response: {val}</div>
    </div>
  );
};

export default App;