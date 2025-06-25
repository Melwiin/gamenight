import { useState } from "react";
import OTPInput from "~/shared/components/CodeInput";

export default function Home() {
  const [lobbyId, setLobbyId] = useState("");
  const [username, setUsername] = useState("");

  const handleOtpChange = (value: string) => setLobbyId(value);
  const handleOtpComplete = (value: string) => {};

  return (
    <div className="flex w-screen h-screen justify-center items-center p-20">
      <div className="card w-92 aspect-video shadow-sm">
        <div className="card-body items-center gap-4">
          <div className="card-title w-full">Enter Lobby Code:</div>
          <input
            type="text"
            placeholder="Choose a username..."
            className="input focus:outline-0 focus:border-primary"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <OTPInput onChange={handleOtpChange} onComplete={handleOtpComplete} />
          <button
            className="btn btn-primary text-success-primary self-end"
            onClick={() => {
              window.location.href = `/lobby?id=${lobbyId}&username=${username}`;
            }}
          >
            Join Lobby
          </button>
        </div>
      </div>
    </div>
  );
}
