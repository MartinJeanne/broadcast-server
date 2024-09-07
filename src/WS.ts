import { WebSocketServer, WebSocket } from 'ws';
import setupServer from './server';
import connectClient from './client';

export function startWebSocketServer() {
  const wss = new WebSocketServer({ port: 8080 });
  setupServer(wss);
}

export function connectToWebSocketServer() {
  const ws = new WebSocket('ws://localhost:8080');
  connectClient(ws);
}
