import React, { useEffect, useState ,useRef} from 'react';

const App = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [val, setVal] = useState<string>("");
  //const [message, setMessage] = useState("");
  const ipref = useRef<any>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:9200");
    setSocket(ws);

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
    if (!socket ) {
      console.error("WebSocket is not open.");
      return;
    }
    socket.send(ipref.current.value); 
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