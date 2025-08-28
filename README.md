# AutoGGB
A web-based GeoGebra application supporting AI command generation and remote computation. 

[auto-ggb.vercel.app](https://auto-ggb.vercel.app)

## Features
- **GeoGebra API Integration**: The web app embeds a GeoGebra Applet and can evaluate [GeoGebra commands](https://geogebra.github.io/docs/manual/en/commands/). 

- **AI-Powered Command Generation**: The web app can generate GeoGebra commands using a large language model API with a customizable system prompt.

- **Remote Computation**: The web app can connect to a websocket server, execute the GeoGebra functions and send the results back.

## Usage
### Web Application
This project is hosted on Vercel, [visit the site](https://auto-ggb.vercel.app). 

To run the project locally,  

1. Clone the repository. 
```bash
git clone https://github.com/fengjia-guo/AutoGGB.git
cd AutoGGB
```

2. Install the dependencies. (You need to install `pnpm` first.)
```bash
pnpm install
```

3. Run locally. 
```bash
pnpm run dev
```

### Command Execution
You can click the upload a txt file, each line should be a [GeoGebra command](https://geogebra.github.io/docs/manual/en/commands/). Here is an example: 
```
A = (4,0)
B = (0,3)
c = Segment(A,B)
D = (0,0)
l = PerpendicularLine(D, c)
distance = Distance(D, c)
```
Click the "Run Command" button to execute the commands line by line. 

Click the "Reset" button to clear everything and reset GeoGebra. 

### Command Generation
1. Input your API key (remember to click the "Save" button) and config your API (url, model, temperature, etc.) 
    - currently we only support APIs compatible with OpenAI API format, e.g. OpenAI and Deepseek. 

2. (Optional) Edit system prompt ([default](./src/prompts/naturalToGGB.ts)) as you like. 

3. Input user prompt in the top-right input box. 

4. Click the "Generate" button and wait for the result. 

5. Click the "Edit Result" button to view and edit the result. 

6. Click the "Run" button to execute commands in the format of [Command Execution](#command-execution). 

### Remote Computation
1. Run a websocket server. 

2. Input the uri (e.g. `ws://localhost:8765`) of the server on the web page, and click the `Connect` button. The web app will run a websocket client and connect to the server. 

3. Run another websocket client and connect to the same server. 

4. Send requests to the server in your client and you will get responses from the web page. 

We provide a pipeline implemented with Python. 

Install the dependencies. 
```bash
pip install websockets
```

Run the websocket server. 
```bash
cd scripts
# running at default uri ws://localhost:8765
python server.py
# to specify a port number
# python server.py --port YOUR_PORT_NUMBER
```

We've implemented a simple client to send requests and parse response in [AutoGGB.py](./scripts/AutoGGB.py) with an example provided [here](./scripts/example.py). To run the example program: 
```bash
cd scripts
python example.py
# {'distance': 5}
```
You may refer to the following format to implement your own remote computation client or make other extensions. 

Request the web app to evaluate GeoGebra commands and get some values: 
```yaml
{
    "type": "geogebra_command", 
    "commands": [
        "A = (4,0)",
        "B = (0,3)", 
        "distance = Distance(A,B)" 
    ], # a list of commands to be evaluated
    "valuesToGet", [
        "distance"
    ], # a list of labels of the values to get
    "requestId": "abcd-efgh" # a unique requestId
}
```
The web app will respond with: 
```yaml
{
    "type": "geogebra_result", 
    "requestId": "abcd-efgh", 
    "results": {
        "distance": 5
    } # a dictionary containing the label-value pairs. 
}
```

Request the web app to reset the GeoGebra app, with all objects cleared. 
```yaml
{
    "type": "reset", 
    "requestId": "abcd-efgh" # a unique requestId
}
```
The web app will respond with: 
```yaml
{
    "type": "reset_result", 
    "requestId": "abcd-efgh"
}
```
If any error occurs, the web app will respond with: 
```yaml
{
    "type": "error", 
    "error": "Some Error" # error message
}
```
IMPORTANT: Errors raised by GeoGebra when executing commands will NOT be covered in this case. 