import { RawData, Server, WebSocket } from 'ws';

export default class WSServer {
    private server: Server;

    constructor(givenPort?: number) {
        const port = givenPort ? givenPort : 8080;
        this.server = new Server({ port: port });
    }

    start() {
        this.server.on('connection', (ws) => {
            ws.on('error', console.error);

            ws.on('message', (data, isBinary) => {
                this.onMessage(ws, data, isBinary);
            });
        });
    }

    private onMessage(ws: WebSocket, data: RawData, isBinary: boolean) {
        console.log(`Received: ${data}`);

        this.server.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN)
                client.send(data, { binary: isBinary });
        });
    }

    private getConnectionsNb() {
        if (this.server.clients)
            return this.server.clients.size;
        else return 0;
    }
}
