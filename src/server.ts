import { Server } from 'ws';

export default function setupServer(server: Server) {
    server.on('connection', function connection(ws) {
        ws.on('error', console.error);

        ws.on('message', function message(data, isBinary) {
            console.log(`Received: ${data}`);
            server.clients.forEach((client) => {
                if (client !== ws &&client.readyState === WebSocket.OPEN) 
                    client.send(data, { binary: isBinary });
            });
        });
    });
}
