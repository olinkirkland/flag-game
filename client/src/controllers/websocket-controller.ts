/**
 * Send a base64 image string to the server via websocket.
 * @param base64Image The base64-encoded PNG string (no data: prefix)
 */
export function sendImageData(base64Image: string) {
    if (isSocketOpen()) {
        socket.send(base64Image);
    } else {
        console.warn('WebSocket is not open. Cannot send image data.');
    }
}
import LoadingModal from '@/components/modals/templates/LoadingModal.vue';
import { useGameStateStore } from '@/store/game-state-store';
import { applyPatch } from 'fast-json-patch';
import ModalController from './modal-controller';

let socket: WebSocket;

export type SocketMessageType = 'patch';

export interface SocketMessage {
    type: SocketMessageType;
    data?: any;
}

// The message that is sent over the socket
export interface SocketMessage {
    type: SocketMessageType;
    data?: any;
}

export function isSocketOpen() {
    return socket && socket.readyState === WebSocket.OPEN;
}

export async function connectToSocket(playerId: string) {
    destroyConnection();

    // Is 'localhost' in the hostname?
    const isLocalhost = window.location.hostname.includes('localhost');
    const baseAddress = isLocalhost
        ? 'ws://localhost:3002'
        : 'ws://flag-game-production.up.railway.app:3002';
    // Pass playerId as a query parameter
    const address = `${baseAddress}?id=${encodeURIComponent(playerId)}`;

    try {
        socket = new WebSocket(address);
    } catch (error) {
        return false;
    }

    return new Promise((resolve) => {
        socket.onopen = () => {
            socket.onopen = onOpen;
            socket.onclose = onClose;
            socket.onmessage = onMessage;
            socket.onerror = () => {
                resolve(false);
            };

            console.log('Connected to socket server');
            resolve(true);
        };
    });
}

async function onMessage(message: any) {
    if (!message.data) return;

    try {
        const data = JSON.parse(message.data);
        const socketMessage = data as SocketMessage;
        // console.log('Applying patch:', socketMessage.data);
        useGameStateStore().model = applyPatch(useGameStateStore().model, [
            socketMessage.data
        ]).newDocument;
    } catch (error) {
        console.error('Error parsing socket message:', error);
    }
}

function onOpen() {}

function onClose() {
    setTimeout(() => {
        ModalController.open(LoadingModal);
    }, 1000);
}

export async function destroyConnection() {
    if (!socket) return;
    if (socket.readyState === WebSocket.OPEN) socket.close();

    onClose();

    socket.onclose = null;
    socket.onmessage = null;
    socket.onerror = null;
    socket.onopen = null;
}
