import asyncio
import json
import websockets
import argparse

connected_clients = set()

async def handler(websocket):
    # add new connections
    connected_clients.add(websocket)
    print(f"New client connected. Total clients: {len(connected_clients)}")

    try:
        async for message in websocket:
            print(f"Received message from a client: {message}")
            parsed_message = json.loads(message)
            
            # broadcast to other clients
            for client in connected_clients:
                if client != websocket:
                    await client.send(json.dumps(parsed_message))

    except websockets.exceptions.ConnectionClosed as e:
        print(f"Connection closed by a client: {e}")
    finally:
        connected_clients.remove(websocket)
        print(f"Client disconnected. Total clients: {len(connected_clients)}")

async def main(port: int = 8765):
    async with websockets.serve(handler, "localhost", port):
        print(f"WebSocket server started on ws://localhost:{port}")
        await asyncio.Future()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8765)
    args = parser.parse_args()
    asyncio.run(main(args.port))