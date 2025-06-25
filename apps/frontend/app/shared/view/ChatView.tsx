import type Message from "@repo/shared-types/types/Message.js";
import { useState, useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";

interface ChatViewProps {
  socket: Socket | null;
  messages: Message[];
  sendMessage: (message: string) => void;
}

export default function ChatView({
  socket,
  messages,
  sendMessage,
}: ChatViewProps) {
  const [inputMessage, setInputMessage] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputMessage.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setInputMessage("");
  };

  return (
    <div className="bg-base-200 rounded-lg flex flex-col p-4 gap-6 shadow-md w-lg">
      <h1 className="text-2xl font-bold text-primary">Messages:</h1>

      <div
        ref={messagesContainerRef}
        className="h-80 overflow-y-auto flex flex-col gap-3 px-2"
        role="log"
        aria-label="Chat messages"
      >
        {messages.map((message) => (
          <div
            key={message.id} // Use unique ID
            className={`chat ${
              message.senderId === socket?.id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-header flex items-center justify-between">
              <span className="font-semibold">{message.senderName}</span>
              <time className="text-xs opacity-50 ml-2">
                {new Date(message.timestamp).toLocaleTimeString("de", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </div>
            <div className="chat-bubble">{message.content}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          className="input input-bordered flex-grow"
          placeholder="Type here..."
          aria-label="Type a message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </form>
    </div>
  );
}
