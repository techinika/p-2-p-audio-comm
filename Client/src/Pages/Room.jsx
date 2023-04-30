import io from "socket.io-client";
import { useParams } from 'react-router-dom';

export default function Room(){
    const socket = io.connect("http://localhost:5000");
    const params = useParams();
    const roomId = params.roomID;

    socket.on("socketConnected", (data)=>{
        console.log(`Connected to server with ID: ${data.socketId}`);
        socket.emit("JoinRoom", roomId);
    })
    return(
        <>
        <h1>Room page</h1>
        </>
    );
}