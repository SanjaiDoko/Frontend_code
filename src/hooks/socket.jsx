import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SOCKETPORT } from "../config";

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

  

  