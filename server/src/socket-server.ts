import { Server, WebSocket } from 'ws';
import { patch } from './game';

export type SocketMessageType = 'patch';

export interface SocketMessage {
    type: SocketMessageType;
    data?: any;
}

export default class SocketServer {
    private static instance: SocketServer | null;
    private webSocketServer: Server | null;
    private streamListeners: Set<WebSocket>;
    private playerIdsBySocket: Map<WebSocket, string>;

    private constructor() {
        this.webSocketServer = null;
        this.streamListeners = new Set();
        this.playerIdsBySocket = new Map();
    }

    static getInstance(): SocketServer {
        if (!SocketServer.instance) SocketServer.instance = new SocketServer();
        return SocketServer.instance;
    }

    async start() {
        this.webSocketServer = new Server({
            port: Number(process.env.SOCKET_PORT)
        });

        this.webSocketServer.on('connection', (client, req) => {
            // Extract playerId from query string
            let playerId: string | null = null;
            try {
                const url = new URL(req.url || '', `ws://${req.headers.host}`);
                playerId = url.searchParams.get('id');
            } catch (e) {
                playerId = null;
            }

            if (!playerId) {
                // fallback: generate a random one if not provided (should not happen)
                playerId = Math.random().toString(36).substring(2, 15);
            }

            this.handleClientConnection(client);
            this.playerIdsBySocket.set(client, playerId);
            patch({
                op: 'add',
                path: '/players/-',
                value: playerId
            });
        });

        return new Promise<void>((resolve) => {
            this.webSocketServer?.on('listening', () => {
                const port = process.env.SOCKET_PORT || '3002';
                console.log('Socket server listening on port', port);
                resolve();
            });
        });
    }

    private handleClientConnection(client: WebSocket) {
        client.on('close', () => {
            this.streamListeners.delete(client);
            const playerId = this.playerIdsBySocket.get(client);
            if (!playerId) return;
            this.playerIdsBySocket.delete(client);
            patch({
                op: 'remove',
                path: `/players/${playerId}`
            });
        });
    }

    async broadcast(message: SocketMessage) {
        this.webSocketServer?.clients?.forEach((client) => {
            client.send(JSON.stringify(message));
        });
    }
}
