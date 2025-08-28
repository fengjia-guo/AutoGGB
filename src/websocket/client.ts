import { executeGeoGebra } from "./ggbCommand";

export const DEFAULT_WEBSOCKET_URL = 'ws://localhost:8765';

export const connectToWebSocket = (url: string = DEFAULT_WEBSOCKET_URL): WebSocket | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const ws = new WebSocket(url);

  ws.onopen = () => {
    const info = `Successfully connected to WebSocket server ${url}.`
    console.log(info);
    alert(info);
    ws.send(JSON.stringify({ type: 'status', message: 'Client connected and ready.' }));
  };

  ws.onmessage = async (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);
      console.log('Received message from server:', message);

      if (message.type === 'geogebra_command') {
        const { commands, valuesToGet, requestId } = message;

        const ggbApplet = window.ggbApplet;
        if (!ggbApplet) {
          throw new Error("GeoGebra applet is not loaded.");
        }

        const results = await executeGeoGebra(ggbApplet, commands, valuesToGet);
        
        ws.send(JSON.stringify({
          type: 'geogebra_result',
          requestId: requestId,
          results: results,
        }));
      } else if (message.type === 'reset') {
				const {requestId} = message;
				const ggbApplet = window.ggbApplet;
        if (!ggbApplet) {
          throw new Error("GeoGebra applet is not loaded.");
        }

        ggbApplet.reset();
        
        ws.send(JSON.stringify({
          type: 'reset_result',
          requestId: requestId,
        }));
			}
    } catch (error: any) {
      const info = `Error:${error.message}`
      console.error('An error occurred while processing WebSocket message:', error);
      alert(info);
      ws.send(JSON.stringify({ type: 'error', error: error.message }));
    }
  };

  ws.onclose = () => {
    const info = 'Connection to local WebSocket server closed.'
    console.log(info);
    alert(info);
  };

  ws.onerror = (error: Event) => {
    const info = `WebSocket error: ${error}`;
    console.error('WebSocket error:', error);
    alert(info);
  };

  return ws;
};