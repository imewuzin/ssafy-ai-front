const API_URL = import.meta.env.VITE_API_URL;

export async function sendMessage(messages) {
    const response = await fetch(API_URL + '/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageContent }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send message: ${errorText}`);
      }
    
      return response.text();
}
