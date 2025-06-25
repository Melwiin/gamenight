import type Player from "@repo/shared-types/types/Player.js";
import type Lobby from "@repo/shared-types/types/Lobby.js";

export default function PlayerView({ lobby }: { lobby: Lobby | null}) {
  return (
    <div className="bg-base-200 rounded-lg p-4 w-lg shadow-md flex flex-col gap-3">
      <h1 className="text-2xl font-bold text-primary mb-2">Players:</h1>
      <div className="space-y-1">
        {lobby?.players.map((player: Player) => (
          <div
            key={player.id}
            className="text-xl px-3 py-2 bg-base-100 rounded-lg shadow-sm hover:bg-primary/10 transition-colors cursor-default"
          >
            {player.name}
          </div>
        ))}
      </div>
    </div>
  );
}
