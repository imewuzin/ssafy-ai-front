const API_URL = import.meta.env.VITE_API_URL;

export async function sendMessage(messages) {
    // 대화 컨텍스트를 구조화
    const context = messages.map(msg => {
        if (msg.role === 'user') {
            return `사용자: ${msg.content}`;
        } else {
            return `AI: ${msg.content}`;
        }
    }).join('\n');

    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
    const messageWithContext = `${context}\n사용자: ${lastUserMessage.content}\nAI:`;

    const response = await fetch(API_URL + '/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageWithContext }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send message: ${errorText}`);
    }
    
    const data = await response.json();
    return data.reply;
}


