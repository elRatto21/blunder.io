import { io } from "socket.io-client";

let socket
if(localStorage.getItem("accessToken")) {
    const SOCKET_SERVER_URL = "http://localhost:9092?accessToken=" + localStorage.getItem("accessToken");
    socket = io(SOCKET_SERVER_URL);
}


export default socket;