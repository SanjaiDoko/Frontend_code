import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SOCKETPORT } from "../config";
import { useSelector } from "react-redux";

export const useSocket = () => {
    const tokenId = localStorage.getItem("allMasterToken")
    const [socket, setSocket] = useState(null);
  
    useEffect(() => {
      const socketInstance = io(SOCKETPORT,{
        query: {
          token:tokenId, 
        },
      });
  
      setSocket(socketInstance);
    }, []);
  
    return socket;
  };

  export const useSocketEvents = (socket, id, createdBy) => {
    const role = useSelector((state) => state.profile.role);

    const [liveUser, setLiveUser] = useState([]);
    const [chatMessage, setChatMessage] = useState([]);
  
    useEffect(() => {
      socket?.emit("users", id, createdBy, role);
      socket?.on("getUsers", (users) => {
        setLiveUser(users);
      });
  
      socket?.on("getMessage", (data) => {
        const newChat = {
          message: { message: data.text, createdAt: data.createdAt },
          senderId: data.senderId,
          senderName: data.senderName,
        };
        setChatMessage((prev) => [...prev, newChat]);
      });
      
    }, [socket, id, createdBy]);
  
    return { liveUser, chatMessage };
  };
  
  

  