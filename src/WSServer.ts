import { RawData, Server, WebSocket } from 'ws';

type ClientData = {
    username: string,
    ip: string
}

export default class WSServer {
    private server: Server;
    private connectedClients: Map<WebSocket, ClientData>;

    constructor(givenPort?: number) {
        const port = givenPort ? givenPort : 8080;
        this.server = new Server({ port: port });
        this.connectedClients = new Map();
    }

    start() {
        this.server.on('connection', (ws, req) => {
            ws.on('error', console.error);

            const ip = req.socket.remoteAddress;
            if (!ip) {
                ws.send('Error, your IP was not retrieved, closing connection.')
                return ws.close(1);
            }

            const username = `client-nb-${this.getConnectionsNb()}`;
            const client: ClientData = { ip, username };
            this.connectedClients.set(ws, client);
            ws.send(`Welcome ${ip}!\nThere's currently ${this.getConnectionsNb()} connected client(s)\nYour name is: ${username}`);

            ws.on('message', (data, isBinary) => {
                this.onMessage(ws, data, isBinary);
            });
        });
    }

    private onMessage(ws: WebSocket, data: RawData, isBinary: boolean) {
        const clientData = this.connectedClients.get(ws);
        if (!clientData) {
            ws.send('Error, your data was not retrieved, closing connection.')
            return ws.close(1);
        }

        console.log(`${clientData.username}: ${data}`);

        this.server.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN)
                client.send(`${clientData?.username}: ${data}`, { binary: isBinary });
        });
    }

    private getConnectionsNb() {
        if (this.server.clients)
            return this.server.clients.size;
        else return 0;
    }
}
