import LoadingModal from '@/components/modals/templates/LoadingModal.vue';
import { useGameStateStore } from '@/store/game-state-store';
import { applyPatch } from 'fast-json-patch';
import ModalController from './modal-controller';
import io from 'socket.io-client';

// Is 'localhost' in the hostname?
const isLocalhost = window.location.hostname.includes('localhost');
const baseAddress = isLocalhost
    ? 'http://localhost:3001'
    : 'http://flag-game-production.up.railway.app:3001';
const socket = io(baseAddress, { autoConnect: false });

export function connectToSocket(playerId: string) {
    (socket as any).auth = { playerId };

    socket.on('close', onClose);
    socket.on('patch', onPatch);
    socket.on('connect', () => console.log('✅ Connected to socket-server'));
    socket.connect();
}

// Assume the only updates from the server are patches to the model
async function onPatch(data: any) {
    try {
        useGameStateStore().model = applyPatch(useGameStateStore().model, [
            data
        ]).newDocument;
    } catch (error) {
        console.error('Error parsing socket message:', error);
    }
}

function onClose() {
    setTimeout(() => {
        ModalController.open(LoadingModal);
    }, 1000);
}

/**
 * Send a base64 image string to the server via websocket.
 * @param base64Image The base64-encoded PNG string (no data: prefix)
 */
export function sendImageData(base64Image: string) {
    socket.send(base64Image);
}
