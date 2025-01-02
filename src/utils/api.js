export async function sendMessage(messages) {
    // 대화 컨텍스트를 구조화하고 최근 10개의 메시지만 포함
    const recentMessages = messages.slice(-10);
    const context = recentMessages.map(msg => 
        `${msg.role === 'user' ? '사용자' : 'AI'}: ${msg.content}`
    ).join('\n');

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
