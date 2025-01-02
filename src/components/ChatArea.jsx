import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { addMessage, getMessages, updateSessionTitle } from '../utils/db';
import { sendMessage } from '../utils/api';

export default function ChatArea({ sessionId }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (sessionId) {
            loadMessages();
        } else {
            setMessages([]);
        }
    }, [sessionId]);

    async function loadMessages() {
        const loadedMessages = await getMessages(sessionId);
        setMessages(loadedMessages);

        if (loadedMessages.length > 0) {
            const firstUserMessage = loadedMessages.find(msg => msg.role === 'user');
            if (firstUserMessage) {
                updateSessionTitle(sessionId, firstUserMessage.content.slice(0, 30));
            }
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!input.trim() || !sessionId || isLoading) return;
    
        setIsLoading(true);
    
        const userMessage = {
            role: 'user',
            content: input,
        };
    
        const updatedMessages = [...messages, userMessage];
    
        try {
            const reply = await sendMessage(updatedMessages);
    
            const aiMessage = {
                role: 'assistant',
                content: reply,
            };
    
            updatedMessages.push(aiMessage);
            setMessages(updatedMessages);
    
            await addMessage({
                sessionId,
                ...userMessage,
                timestamp: Date.now(),
            });
            await addMessage({
                sessionId,
                ...aiMessage,
                timestamp: Date.now(),
            });
    
            setInput('');
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = {
                role: 'assistant',
                content: `오류가 발생했습니다: ${error.message}`,
            };
            setMessages([...updatedMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }
    

    if (!sessionId) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">채팅을 선택하거나 새로운 채팅을 시작하세요</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
            <div className="flex-1 overflow-y-auto mb-4">
                {messages.map((message, index) => (
                    <div key={index} className="mb-4">
                        <div className="font-semibold mb-1">{message.role === 'user' ? '사용자' : 'AI'}</div>
                        <div className={`p-3 rounded-lg shadow ${
                            message.role === 'user' ? 'bg-white' : 'bg-gray-100'
                        }`}>
                            {message.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="text-center text-gray-500">
                        AI가 응답을 생성 중입니다...
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit} className="flex items-center bg-white rounded-lg shadow">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                    className="flex-1 p-3 rounded-lg focus:outline-none"
                    disabled={isLoading}
                />
                <button type="submit" className="p-3 text-gray-500 hover:text-gray-700" disabled={isLoading}>
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
