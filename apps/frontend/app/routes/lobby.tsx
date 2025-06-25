// pages/Lobby.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import UseLobby from "~/shared/hooks/useLobby";
import ChatView from "~/shared/view/ChatView";
import GameView from "~/shared/view/GameView";
import PlayerView from "~/shared/view/PlayerView";
import PlaylistSelectorView from "~/shared/view/PlaylistSelectorView";

function Lobby() {
  const [searchParams] = useSearchParams();

  const [lobbyId, setLobbyId] = useState(searchParams.get("id"));
  const [username, setUsername] = useState(searchParams.get("username"));

  const { joinLobby, lobby, sendMessage, messages, socket, selectGame } = UseLobby();

  useEffect(() => {
    if (lobbyId && username) {
      joinLobby(lobbyId, username);
    }
  }, [socket]);

  return (
    <div className="flex p-8 w-screen h-screen gap-8">
      <div className="flex flex-col gap-8 justify-between">
        <PlayerView lobby={lobby} />
        <PlaylistSelectorView lobby={lobby} selectGame={selectGame} />        
        <ChatView
          socket={socket}
          messages={messages}
          sendMessage={sendMessage}
        />
      </div>
      <GameView />
    </div>
  );
}

export default Lobby;
