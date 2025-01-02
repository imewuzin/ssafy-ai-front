const API_URL = import.meta.env.VITE_API_URL;

export async function sendMessage(messages) {
    // 마지막 사용자 메시지만 전송하되, 이전 대화 내용을 포함
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
    const context = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
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

