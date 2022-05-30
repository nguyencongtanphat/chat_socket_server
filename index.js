const express = require("express");
var http = require("http");
const cors =require("cors");
const app= express();
const port = process.env.PORT || 5500;
var server = http.createServer(app);
var io = require("socket.io")(server);
var clients = {}
const routes = require("./routes");

app.use("/routes", routes);

app.route("/check").get((req, res)=>{
    return res.json("your app working fine");
});

//middleware
app.use(express.json());
app.use(cors());

io.on("connection",(socket)=>{
    console.log("connected");
    console.log(socket.id, "has join");
    socket.on("signin",(id)=>{
        clients[id]=socket;
        console.log("clients:",clients);
    })
    socket.on("message", (msg)=>{
        console.log(msg);
        let targetId = msg.targetId;

        if(clients[targetId])
        clients[targetId].emit("message", msg)
    })
})

server.listen(port,"0.0.0.0", ()=>{
    console.log("server started");
});