import axios from "axios";
import { useEffect, useState } from "react";
import type Game from "@repo/shared-types/types/Game.js";
import type Lobby from "@repo/shared-types/types/Lobby.js";

export default function PlaylistSelectorView({
  lobby,
  selectGame,
}: {
  lobby: Lobby | null;
  selectGame: (gameId: string) => void;
}) {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const fetchGames = async () => {
    try {
      const response = await axios.get("http://vpn.melwink.de:3000/lobby/games");
      return response.data;
    } catch (error) {
      console.error("Error fetching games:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchGames().then(setGames);
  }, []);
  
  useEffect(() => {
      setSelectedGameId(lobby?.gameSelected || null);
  }, [lobby]);

  const handleSelect = (gameId: string) => {
    selectGame(gameId);
    setSelectedGameId(gameId);
  };

  const startGame = () => {
    if (!selectedGameId) return;
    alert(`Starting game with id: ${selectedGameId}`);
  };

  return (
    <div className="p-6 bg-base-200 rounded-lg shadow-md w-lg max-w-lg mx-auto flex flex-col">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">
        Game Selector
      </h2>
      <div className="space-y-4 flex-grow">
        {games.map((game) => {
          const isSelected = selectedGameId === game.id;
          return (
            <div
              key={game.id}
              className={`card bg-base-100 shadow-md transition-transform duration-300 cursor-pointer
                ${
                  isSelected
                    ? "scale-105 border-4 border-primary shadow-xl"
                    : "hover:shadow-xl"
                }`}
              onClick={() => handleSelect(game.id)}
            >
              <div className="card-body">
                <h3
                  className={`card-title text-xl ${
                    isSelected
                      ? "text-primary font-extrabold"
                      : "text-secondary"
                  }`}
                >
                  {game.name}
                </h3>
                <p className="text-sm text-gray-600">{game.description}</p>
                <div className="card-actions justify-between mt-2">
                  <span>
                    {game.playerRange[0]} - {game.playerRange[1]} Spieler
                  </span>
                  <button
                    className={`btn btn-sm ${
                      isSelected ? "btn-success" : "btn-primary"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(game.id);
                    }}
                  >
                    {isSelected ? "Selected ✓" : "Select"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Start Button */}
      <button
        className={`btn btn-lg mt-6 ${
          selectedGameId ? "btn-primary" : "btn-disabled cursor-not-allowed"
        }`}
        onClick={startGame}
        disabled={!selectedGameId}
      >
        Start
      </button>
    </div>
  );
}
