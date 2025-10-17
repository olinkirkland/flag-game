import { Server } from 'socket.io';
import { patch } from './game';
import { Express } from 'express';
import { createServer } from 'http';

export default class SocketServer {
    private static instance: SocketServer | null = null;
    private io: Server | null = null;
    private playerIdsBySocket: Map<string, string>;

    private constructor() {
        this.playerIdsBySocket = new Map();
    }

    static getInstance(): SocketServer {
        if (!SocketServer.instance) SocketServer.instance = new SocketServer();
        return SocketServer.instance;
    }

    async start(app: Express) {
        const server = createServer(app);
        this.io = new Server(server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST', 'PUT', 'DELETE']
            }
        });

        this.io.on('connection', (socket) => {
            console.log('User connected, Socket id:', socket.id);

            const playerId =
                (socket.handshake.auth.playerId as string) ||
                Math.random().toString(36).substring(2, 15);

            if (socket.handshake.auth.playerId)
                console.log('   Received playerId:', playerId);
            else console.log('   No playerId, generating a new one:', playerId);

            this.playerIdsBySocket.set(socket.id, playerId);
            patch({ op: 'add', path: '/players/-', value: playerId });
            this.handleClientEvents(socket, playerId);
        });

        console.log('Socket.IO server started');

        return server;
    }

    /**
     * Handle the disconnect and imageData events from a connected socket (player)
     */
    private handleClientEvents(socket: any, playerId: string) {
        socket.on('disconnect', () => {
            this.playerIdsBySocket.delete(socket.id);
            patch({ op: 'remove', path: `/players/${playerId}` });
        });

        socket.on('imageData', (base64: string) => {
            const { gameState } = require('./game');
            if (gameState.artist !== playerId) return;
            patch({ op: 'replace', path: '/imageData', value: base64 });
        });
    }

    async broadcast(message: { type: string; data: any }) {
        this.io?.emit(message.type, message.data);
    }
}
