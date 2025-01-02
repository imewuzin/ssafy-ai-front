import { openDB } from 'idb';

const dbPromise = openDB('ChatAppDB', 1, {
    upgrade(db) {
        const messageStore = db.createObjectStore('chat-messages', {
            keyPath: 'id',
            autoIncrement: true,
        });
        messageStore.createIndex('by-session', 'sessionId');

        db.createObjectStore('chat-sessions', { keyPath: 'id' });
    },
});

export async function createChatSession() {
    const db = await dbPromise;
    const sessionId = `session_${Date.now()}`;
    const newSession = {
        id: sessionId,
        title: '새로운 채팅',
        timestamp: Date.now(),
    };
    await db.add('chat-sessions', newSession);
    return sessionId;
}

export async function addMessage(message) {
    const db = await dbPromise;
    return db.add('chat-messages', message);
}

export async function getMessages(sessionId) {
    const db = await dbPromise;
    return db.getAllFromIndex('chat-messages', 'by-session', sessionId);
}

export async function getChatSessions() {
    const db = await dbPromise;
    return db.getAll('chat-sessions');
}

export async function updateSessionTitle(sessionId, title) {
    const db = await dbPromise;
    const session = await db.get('chat-sessions', sessionId);
    if (session) {
        session.title = title;
        await db.put('chat-sessions', session);
    }
}

export async function clearAllData() {
    const db = await dbPromise;
    await db.clear('chat-messages');
    await db.clear('chat-sessions');
}

export async function deleteSession(sessionId) {
    const db = await dbPromise;
    await db.delete('chat-sessions', sessionId);
    const tx = db.transaction('chat-messages', 'readwrite');
    const index = tx.store.index('by-session');
    let cursor = await index.openCursor(sessionId);
    while (cursor) {
        await cursor.delete();
        cursor = await cursor.continue();
    }
    await tx.done;
}
