
import React, { useEffect, useState } from "react";
import { NATURAL_LANGUAGE_TO_LEAN } from "../prompts/naturalToLean";
import TextEditor from "./TextEditor";

export function ApiKeyInput({ onKeySet }: { onKeySet: (key: string) => void }) {
  const [key, setKey] = useState("");

  return (
    <div className="flex justify-between items-center space-x-2">
      <input
        type="password"
        value={key}
        placeholder="Input your API Key here"
        onChange={(e) => setKey(e.target.value)}
        className="bg-gray-50 rounded-lg px-2 py-1 w-3/4"
      />
      <button
        className="bg-blue-500 text-white hover:bg-blue-600 px-2 py-1 rounded-lg"
        onClick={() => onKeySet(key)}
      >
        Save
      </button>
    </div>
  );
}

export async function callLLM(apiUrl: string, model: string, apiKey: string, systemPrompt: string, prompt: string, temperature: number = 1.0) {
  // OpenAI API
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      temperature: temperature, 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Fail to call API : ${res.status}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

export interface APICallerProps {
  onResultRun?: (result: string) => void;
};

export const APICaller: React.FC<APICallerProps> = ({onResultRun = () => {}}) => {
  const [apiKey, setApiKey] = useState("");
  const [apiUrl, setApiUrl] = useState("https://api.openai.com/v1/chat/completions");
  const [model, setModel] = useState("gpt-4o-mini");
  const [result, setResult] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [systemPrompt, setSystemPrompt] = useState(NATURAL_LANGUAGE_TO_LEAN);
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [temperature, setTemperature] = useState<number>(0.0);
  const [temperatureStr, setTemperatureStr] = useState<string>("0.0");
  const [isTemperatureValid, setIsTemperatureValid] = useState(true);

  const handleCall = async () => {
    try {
      if (userPrompt == "") return;
      const output = await callLLM(apiUrl, model, apiKey, systemPrompt, userPrompt, temperature);
      alert("Finish!");
      setResult(output || "");
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const validateTemperatureStr = () => {
    try {
      const newTemperature: number = parseFloat(temperatureStr);
      if (Number.isNaN(newTemperature)) {
        throw new Error();
      }
      setTemperature(newTemperature);
      setIsTemperatureValid(true);
    } catch (error) {
      setIsTemperatureValid(false);
    }
  }

  useEffect(() => {
    validateTemperatureStr();
  }, [temperatureStr])

  const systemPromptEditor = <TextEditor text={systemPrompt} setText={setSystemPrompt} onClose={() => {setShowSystemPrompt(false)}}/>
  const resultEditor = <TextEditor text={result} setText={setResult} onClose={() => {setShowResult(false)}}/>

  const APIConfig = <div className="flex justify-between items-center gap-x-2">
    <div className="flex items-center justify-between w-full">
      API url
      <input type="text" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} placeholder="API url" className="bg-gray-50 px-2 py-1 w-2/3"/>
    </div>
    <div className="flex items-center justify-between w-full">
      Name of model
      <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="name of model" className="bg-gray-50 px-2 py-1 w-2/3"/>
    </div>
  </div>

  return (
    <div className="w-full max-h-[25vh] flex p-4 space-x-4">
      <div className="flex flex-col w-1/2 p-2 space-y-4">
        {APIConfig}
        <ApiKeyInput onKeySet={(key) => { setApiKey(key); }} />
      </div>
      <div className="flex flex-col w-1/2 p-2 space-y-4"> 
        <div className="flex justify-between items-center gap-x-3">
          <input type="text" value={userPrompt} onChange={(e) => setUserPrompt(e.target.value)} placeholder="Input description here" className="bg-gray-50 px-2 py-1 w-1/2"/>
          <div className="flex justify-between items-center gap-x-3">
            <button onClick={handleCall} className="bg-blue-500 hover:bg-blue-600 text-white border border-transparent px-2 py-1 rounded-lg w-fit">
              Generate
            </button>
            <button onClick={() => setShowSystemPrompt(true)} className="bg-gray-50 hover:bg-gray-100 border border-blue-500 px-2 py-1 rounded-lg w-fit">
              Edit Prompt
            </button>
            <button onClick={() => setShowResult(true)} className="bg-gray-50 hover:bg-gray-100 border border-blue-500 px-2 py-1 rounded-lg w-fit">
              Edit Result
            </button>
            <button onClick={() => onResultRun(result)} className="bg-blue-500 hover:bg-blue-600 text-white border border-transparent px-2 py-1 rounded-lg w-fit">
              Run
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center gap-x-3"> 
          Temperature: { temperature }
          { !isTemperatureValid && <p className="text-sm text-red-600"> Invalid! </p> }
          <input type="text" value={temperatureStr} onChange={(e) => (setTemperatureStr(e.target.value))} className="bg-gray-50 px-2 py-1"/>
        </div>
      </div>
      {showResult && resultEditor}
      {showSystemPrompt && systemPromptEditor}
    </div>
  );
}
  
export default APICaller;