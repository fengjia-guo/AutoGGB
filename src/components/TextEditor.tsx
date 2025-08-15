import { useState } from "react";

export default function TextEditor({
  text,
  setText,
  onClose,
}: {
  text: string;
  setText: (text: string) => void;
  onClose?: () => void;
}) {
  const [localText, setLocalText] = useState(text);

  const handleSave = () => {
    setText(localText);
    if (onClose) onClose();
  };

  return (
    <div
      className="flex flex-col bg-white rounded-xl shadow-xl p-4 absolute left-[50vw] top-[50vh] transform -translate-x-1/2 -translate-y-1/2 h-[80vh] w-[80vw] z-10"
      style={{ width: "min(800px, 80vw)" }}
    >
      <textarea
        className="bg-gray-100 rounded-xl font-mono p-2 overflow-auto flex-1 resize-none outline-none"
        value={localText}
        onChange={(e) => setLocalText(e.target.value)}
        style={{ height: "60vh" }}
      />
      <div className="flex justify-end gap-2 mt-4">
        {onClose && (
          <button
            className="bg-gray-50 px-2 py-1 rounded-lg hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
        )}
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}
