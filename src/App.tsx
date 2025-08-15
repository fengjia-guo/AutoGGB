import { useState } from "react";
import GeoGebraBoard from "./components/GeoGebraBoard";
import CommandUploader from "./components/CommandUploader";
import Toolbar from "./components/Toolbar";

export default function App() {
  const [commands, setCommands] = useState<string[]>([]);

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <div className="flex items-center gap-3"> 
        <CommandUploader onCommandsLoaded={setCommands} />
        <Toolbar commands={commands} />
      </div>
      <GeoGebraBoard />
    </div>
  );
}
