import { useState } from "react";
import GeoGebraBoard from "./components/GeoGebraBoard";
import CommandUploader from "./components/CommandUploader";
import Toolbar from "./components/Toolbar";
import APICaller from "./components/APICaller";
import { WebSocketClient } from "./components/WebSocketClient";

export default function App() {
  const [commands, setCommands] = useState<string[]>([]);

  const runResult = (result: string) => {
    const resultAsCommands = result.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    resultAsCommands.forEach(cmd => {
      window.ggbApplet.evalCommand(cmd);
    });
    setCommands(resultAsCommands);
  }

  return (
    <div className="flex flex-col items-center p-4 space-y-4 w-[100vw] h-[100vh]">
      <APICaller onResultRun={runResult}/>
      <div className="flex items-center gap-3"> 
        <CommandUploader onCommandsLoaded={setCommands} />
        <Toolbar commands={commands} />
        <WebSocketClient />
      </div>
      <GeoGebraBoard />
    </div>
  );
}
