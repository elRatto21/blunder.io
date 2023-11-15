import { io } from "socket.io-client";

let socket
if(localStorage.getItem("accessToken")) {

    

    const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET + localStorage.getItem("accessToken");
    
    console.log("server_url: " + SOCKET_SERVER_URL)
    
    socket = io(SOCKET_SERVER_URL);
}


export default socket;