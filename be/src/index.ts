import { WebSocketServer ,WebSocket} from "ws";

const wss = new WebSocketServer({ port: 9200 });
interface User{
    socket:WebSocket;
    room:string;
}
interface msgJson{
    type:string;
    payload:payload;
}
type payload = 
  | { roomId: string; message: never } 
  | { message: string; roomId: never }; 

let allSoc:User[]=[];
wss.on("connection", function (socket) {
    console.log("Client connected");
    socket.on("message", (message:string) => {
        const msgJson:msgJson=JSON.parse(message);
        if(msgJson.type==="join"){
            console.log("Join request",msgJson.payload.roomId)
            allSoc.push({
                socket,
                room:msgJson.payload.roomId
            })
        }
        if(msgJson.type==="chat"){
            const room=allSoc.filter((x)=>x.socket===socket)[0].room;
            const users=allSoc.filter((x)=>x.room===room&&x.socket!==socket);
            console.log("Chat request",room)
            for(let i=0;i<users.length;i++){
                users[i].socket.send(msgJson.payload.message)
            }
        }
    });
    socket.on("disconnect",function(){
      allSoc = allSoc.filter((user) => user.socket !== socket);
    })
});