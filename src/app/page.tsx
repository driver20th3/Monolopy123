import { GameProvider } from "@/context/GameContext";
import { Board } from "@/components/Board";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <GameProvider>
        <Board />
      </GameProvider>
    </div>
  );
}
