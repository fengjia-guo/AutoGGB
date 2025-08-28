import asyncio

from AutoGGB import AutoGGBClient

async def main():
    url = "ws://localhost:8765"
    client = AutoGGBClient(server_url=url)

    await client.connect()

    await client.reset()

    commands = [
        "A = (4,0)",
        "B = (0,3)",
        "distance = Distance(A,B)"
    ]
    valuesToGet = ["distance"]
    response = await client.command(commands, valuesToGet)
    print(response['results'])

if __name__ == "__main__":
    asyncio.run(main())