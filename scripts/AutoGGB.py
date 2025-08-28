import json
import websockets
import uuid

GEOGEBRA_COMMAND_TYPE = "geogebra_command"
RESET_TYPE = "reset"

DEFAULT_WEBSOCKET_SERVER = "ws://localhost:8765"

def get_new_request(data: dict[str, any]):
    """
    Insert a unique requestId from uuid.uuid4() to the data
    Args:
        data: a dict to send.
    Returns:
        a dict with a unique requestId. 
    """
    data["requestId"] = str(uuid.uuid4())
    return data

async def send_request(websocket: websockets.ClientConnection, data: dict[str, any], print_info=False):
    """
    Send a request to websocket server and wait for response. 
    Args:
        data: a dict to send.
    Returns:
        response from server as a json-formatted dict. 
    """
    await websocket.send(json.dumps(data))
    if print_info:
        print(f"Sent command request with ID: {data['requestId']}")

    response = await websocket.recv()
    if print_info:
        print("Received response from web client:", response)
    return json.loads(response)

class AutoGGBClient: 
    def __init__(self, server_url=DEFAULT_WEBSOCKET_SERVER):
        """
        Initialize AutoGGBClient without establishing a connection to the websocket server. 
        Args:
            server_url: url of websocket server, default: ws://localhost:8765
        """
        self.server_url = server_url
        self.websocket = None

    async def connect(self):
        """
        Connect to the server at self.server_url. 
        """
        self.websocket = await websockets.connect(self.server_url)

    async def reset(self):
        """
        Reset GeoGebra (clear all objects). 
        Returns:
            response: response from server as dict. 
        """
        data = get_new_request(dict(type=RESET_TYPE))
        return await send_request(self.websocket, data)
    
    async def command(self, commands: list[str] = [], valuesToGet: list[str] = []):
        """
        Evaluate GeoGebra commands and getValue commands. 
        Args:
            commands: 
        Returns:
            response: response from server. 
            ```
            {
                "type": "geogebra_result",
                "requestId": requestId,
                "results": a dict containing the values,
            }
            ```
        """
        data = get_new_request(dict(type=GEOGEBRA_COMMAND_TYPE, commands=commands, valuesToGet=valuesToGet))
        return await send_request(self.websocket, data)