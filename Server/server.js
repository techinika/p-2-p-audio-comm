const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const producerRoutes = require("./Routes/ProducerRoutes");
const dotenv = require("dotenv");
const app = express();

dotenv.config();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

io.on("connection", (socket)=>{
    socket.emit("socketConnected", { socketId: socket.id });

    socket.on("JoinRoom", (room)=>{
        socket.join(room);
        console.log(`User ${socket.id} has joined room ${room}`);
    });

    socket.on("disconnect", ()=>{
        console.log(`User ${socket.id} has disconnected`)
    });
})
app.use('/api/produce', producerRoutes);

const port = process.env.PORT || 6969;
server.listen(port, () => {
    console.log(`Server started on port: ${port}`)
});