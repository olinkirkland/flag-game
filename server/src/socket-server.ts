import { Server, WebSocket } from 'ws';

export type SocketMessageType = 'patch';

export interface SocketMessage {
    type: SocketMessageType;
    data?: any;
}

export default class SocketServer {
    private static instance: SocketServer | null;
    private webSocketServer: Server | null;
    private streamListeners: Set<WebSocket>;

    private constructor() {
        this.webSocketServer = null;
        this.streamListeners = new Set();
    }

    static getInstance(): SocketServer {
        if (!SocketServer.instance) SocketServer.instance = new SocketServer();
        return SocketServer.instance;
    }

    async start() {
        this.webSocketServer = new Server({
            port: Number(process.env.SOCKET_PORT)
        });

        this.webSocketServer.on('connection', (client) => {
            // Handle new client connection
            this.handleClientConnection(client);
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
        });
    }

    async broadcast(message: SocketMessage) {
        this.webSocketServer?.clients?.forEach((client) => {
            client.send(JSON.stringify(message));
        });
    }
}
