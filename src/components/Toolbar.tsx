interface Props {
  commands: string[];
}
  
export default function Toolbar({ commands }: Props) {
  const runCommands = () => {
    commands.forEach(cmd => {
      window.ggbApplet.evalCommand(cmd);
    });
  };

  return (
    <div className="flex gap-4">
      <button onClick={runCommands} className="px-4 py-2 rounded-lg hover:bg-gray-100 text-black border-1 border-transparent hover:border-blue-600">Run Command</button>
      <button onClick={() => {window.ggbApplet.reset()}} className="px-4 py-2 rounded-lg hover:bg-gray-100 text-black border-1 border-transparent hover:border-blue-600">Reset</button>
    </div>
  );
}
  