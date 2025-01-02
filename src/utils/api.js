const API_URL = import.meta.env.VITE_API_URL;

export async function sendMessage(messages) {
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();

    const response = await fetch(API_URL + '/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: lastUserMessage.content }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send message: ${errorText}`);
      }
    
    const data = await response.json();
    return data.reply;
}
