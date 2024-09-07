import { Server } from 'ws';

export default function setupServer(server: Server) {
    server.on('connection', function connection(ws) {
        ws.on('error', console.error);

        ws.on('message', function message(data) {
            console.log('received: %s', data);
        });

        ws.send('Hello from server');
    });
}
