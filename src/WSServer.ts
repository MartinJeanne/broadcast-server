import { RawData, Server, WebSocket } from 'ws';
import fs from 'node:fs/promises';

type ClientData = {
    username: string,
    ip: string
}

export default class WSServer {
    private server: Server;
    private connectedClients: Map<WebSocket, ClientData>;
    private usedNamesNb: number;

    constructor(givenPort?: number) {
        const port = givenPort ? givenPort : 8080;
        this.server = new Server({ port: port });
        this.connectedClients = new Map();
        this.usedNamesNb = 0;
    }

    start() {
        this.server.on('connection', async (ws, req) => {
            ws.on('error', console.error);

            if (this.getConnectionsNb() >= 20) {
                ws.send('Too much clients albready connected, closing connection.')
                return ws.close(0);
            }

            const ip = req.socket.remoteAddress;
            if (!ip) {
                ws.send('Error, your IP was not retrieved, closing connection.')
                return ws.close(1);
            }

            const username = await this.giveName();
            const client: ClientData = { ip, username };
            this.connectedClients.set(ws, client);
            console.log(`Connected: ${client.username}`);
            ws.send(`Welcome ${ip}!\nThere's currently ${this.getConnectionsNb()} connected client(s)\nYour name is: ${username}`);

            ws.on('message', (data, isBinary) => {
                this.onMessage(ws, data, isBinary);
            });

            ws.on('close', () => {
                this.onClose();
            });
        });
    }

    private onClose() {
        const updatedClientMap: Map<WebSocket, ClientData> = new Map();
        this.server.clients.forEach((client) => {
            const clientData = this.connectedClients.get(client);
            if (clientData) updatedClientMap.set(client, clientData);
        });

        this.connectedClients.forEach((value, key) => {
            if (!updatedClientMap.has(key)) {
                console.log(`Disconnected: ${value.username}`);
            }
        })

        this.connectedClients = updatedClientMap;
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

    private async giveName(): Promise<string> {
        const usernames: string[] = await fs.readFile('./usernames.json', { encoding: 'utf8' })
            .then(json => JSON.parse(json))
            .catch(console.error);


        if (!Array.isArray(usernames) || !usernames.every(n => typeof n === 'string'))
            throw new Error('Error, corrupted JSON: usernames.json');

        const username = usernames[this.usedNamesNb];
        this.usedNamesNb++;
        return username;
    }
}
