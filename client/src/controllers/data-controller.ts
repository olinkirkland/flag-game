export function getUserId() {
    const playerId = localStorage.getItem('user-id');
    return playerId || null;
}

export function setUserId(id: string) {
    localStorage.setItem('user-id', id);
}

export function clearUserId() {
    localStorage.removeItem('user-id');
}
