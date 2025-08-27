import React, { useEffect, useState, useRef } from 'react';
import { connectToWebSocket, DEFAULT_WEBSOCKET_URL } from '../websocket/client';

export const WebSocketClient: React.FC = () => {
  const [inputUrl, setInputUrl] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!currentUrl) {
      return;
    }

    const ws = connectToWebSocket(currentUrl);
    wsRef.current = ws;

    return () => {
      if (wsRef.current) {
        console.log(`Closing connection to ${wsRef.current.url}`);
        wsRef.current.close();
      }
    };
  }, [currentUrl]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value);
  };

  const handleConnect = () => {
    if (inputUrl) {
      setCurrentUrl(inputUrl);
    }
  };

  return (
    <div className='rounded-xl border p-1'>
      <div className='flex gap-x-2 items-center'>
        <input
          type="text"
          value={inputUrl}
          onChange={handleUrlChange}
          placeholder={`e.g., ${DEFAULT_WEBSOCKET_URL}`}
          className='px-4 py-2 rounded-lg'
        />
        <button
          onClick={handleConnect}
          className='px-4 py-2 hover:bg-gray-100 rounded-lg hover:border-blue-600 border border-transparent'
        >
          Connect
        </button>
      </div>
    </div>
  );
};