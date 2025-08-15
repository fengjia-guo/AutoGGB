interface Props {
  onCommandsLoaded: (commands: string[]) => void;
}

export default function CommandUploader({ onCommandsLoaded }: Props) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const commands = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
      onCommandsLoaded(commands);
    };
    reader.readAsText(file);
  };

  return (
    <input type="file" accept=".txt" onChange={handleFileUpload} />
  );
}
  