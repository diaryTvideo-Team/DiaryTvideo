"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { VideoProgressMessage } from "@repo/types";
import { getAccessToken } from "@/lib/api/token";
import { useAuth } from "@/components/auth-provider";

interface SocketContextType {
  isConnected: boolean;
  subscribeToVideoStatus: (
    callback: (data: VideoProgressMessage) => void,
  ) => () => void;
}

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  subscribeToVideoStatus: () => () => {},
});

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const listenersRef = useRef<Set<(data: VideoProgressMessage) => void>>(
    new Set(),
  );

  useEffect(() => {
    if (!user) {
      // 로그아웃 시 연결 해제
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    const token = getAccessToken();
    if (!token) return;

    // 소켓 연결
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("[Socket] Connection error:", error.message);
      setIsConnected(false);

      // 토큰 갱신 후 재연결 시도
      const freshToken = getAccessToken();
      if (freshToken && socket.auth) {
        (socket.auth as Record<string, string>).token = freshToken;
      }
    });

    // video-status 이벤트 수신
    socket.on("video-status", (data: VideoProgressMessage) => {
      listenersRef.current.forEach((callback) => callback(data));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  const subscribeToVideoStatus = (
    callback: (data: VideoProgressMessage) => void,
  ) => {
    listenersRef.current.add(callback);
    return () => {
      listenersRef.current.delete(callback);
    };
  };

  return (
    <SocketContext.Provider value={{ isConnected, subscribeToVideoStatus }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
