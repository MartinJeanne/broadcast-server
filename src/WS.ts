import WSServer from './WSServer';
import WSClient from './WSClient';

export function startServer() {
  const server = new WSServer();
  server.start();
}

export function connect(givenName?: string) {
  const client = new WSClient(givenName);
  client.connect();
}
