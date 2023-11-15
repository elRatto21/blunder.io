import { io } from "socket.io-client";

console.log(process.env.REACT_APP_SOCKET + " " + localStorage.getItem("accessToken"))

let socket
if(localStorage.getItem("accessToken")) {
    const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET + localStorage.getItem("accessToken");
    
    socket = io(SOCKET_SERVER_URL);
}


export default socket;