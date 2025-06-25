import { useEffect, useState, useCallback, useRef } from "react";
import { Socket } from "socket.io-client";
import { useErrorHandler } from "../context/ErrorContext";
import type Message from "@repo/shared-types/types/Message.js";
import type Lobby from "@repo/shared-types/types/Lobby.js";
import { getSocket } from "../utils/socket";

export default function useLobby() {
  const { pushError } = useErrorHandler();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    var newSocket = getSocket("http://vpn.melwink.de:3000");
    setSocket(newSocket);

    const handleConnect = () => console.log("Connected:", newSocket.id);
    const handleError = (err: string) => pushError(err);
    const handlePlayerJoined = (lobby: Lobby) => setLobby(lobby);
    const handlePlayerLeft = (lobby: Lobby) => setLobby(lobby);
    const handleLobbyState = (lobby: Lobby) => setLobby(lobby);
    const handleChatMessage = (message: Message) =>
      setMessages((prev) => [...prev, message]);
    const handleLobbyJoined = (status: string, lobby: Lobby) => {
      if (status === "success") {
        setLobby(lobby);
      }
    };

    newSocket.on("connect", handleConnect);
    newSocket.on("lobbyState", handleLobbyState);
    newSocket.on("playerJoined", handlePlayerJoined);
    newSocket.on("playerLeft", handlePlayerLeft);
    newSocket.on("chatMessage", handleChatMessage);
    newSocket.on("lobbyJoined", handleLobbyJoined);
    newSocket.on("err", handleError);

    return () => {
      newSocket.off("connect", handleConnect);
      newSocket.off("lobbyState", handleLobbyState);
      newSocket.off("playerJoined", handlePlayerJoined);
      newSocket.off("playerLeft", handlePlayerLeft);
      newSocket.off("chatMessage", handleChatMessage);
      newSocket.off("lobbyJoined", handleLobbyJoined);
      newSocket.off("err", handleError);
      newSocket.disconnect();
    };
  }, []);

  const joinLobby = useCallback(
    (lobbyId: string, playerName: string) => {
      if (!socket) return;
      socket.emit("joinLobby", { lobbyId, playerName });
    },
    [socket]
  );

  const selectGame = useCallback(
    (gameId: string) => {
      if (!socket) return;
      socket.emit("selectGame", gameId);
    },
    [socket]
  );

  const sendMessage = useCallback(
    (message: string) => {
      if (!socket) return;
      socket.emit("sendChatMessage", message);
    },
    [socket]
  );

  return { socket, lobby, joinLobby, sendMessage, selectGame, messages };
}
