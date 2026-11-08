import { useEffect, useRef, useState } from "react";
import { SocketContext } from "./socketContextStore";
import { io } from "socket.io-client";
import { useAuth } from "./useAuth";
import toast from "react-hot-toast";


export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    socketRef.current = io(import.meta.env.VITE_API_URL, {
      auth: { token: localStorage.getItem("token") },
      transports: ["websocket"],
    });

    setSocket(socketRef.current);

    socketRef.current.on("connect", () => setConnected(true));
    socketRef.current.on("disconnect", () => setConnected(false));
    socketRef.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      toast.error("Failed to connect to real-time updates");
    });
    socketRef.current.on("error", (error) => {
      console.error("Socket error:", error);
    });

    return () => {
      socketRef.current?.disconnect();
      setConnected(false);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
