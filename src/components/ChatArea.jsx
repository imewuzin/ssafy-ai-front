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
    
        try {
            const chatHistory = await getMessages(sessionId);
            const messageHistory = chatHistory.map(msg => ({
                role: msg.role,
                content: msg.content
            }));
            messageHistory.push(userMessage);
    
            const reply = await sendMessage(messageHistory);
    
            await addMessage({
                sessionId,
                ...userMessage,
                timestamp: Date.now(),
            });
    
            const aiMessage = {
                sessionId,
                role: 'assistant',
                content: reply,
                timestamp: Date.now(),
            };
    
            await addMessage(aiMessage);
            await loadMessages();
            setInput('');
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = {
                sessionId,
                role: 'assistant',
                content: `오류가 발생했습니다: ${error.message}`,
                timestamp: Date.now(),
            };
            await addMessage(errorMessage);
            await loadMessages();
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
        <div className="flex-1 flex flex-col p-4 bg-white">
            <div className="flex-1 overflow-y-auto mb-4">
                {messages.map((message, index) => (
                    <div key={index} className="mb-4">
                        <div className="font-semibold mb-1 text-[#1428A0]">
                            {message.role === 'user' ? '사용자' : 'AI'}
                        </div>
                        <div className={`p-3 rounded-lg shadow ${
                            message.role === 'user' 
                            ? 'bg-[#F8F9FA] border border-[#E9ECEF]' 
                            : 'bg-[#E7F5FE] border border-[#D1E9FA]'
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
            <form onSubmit={handleSubmit} className="flex items-center bg-white rounded-lg shadow border border-[#E9ECEF]">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                    className="flex-1 p-3 rounded-lg focus:outline-none"
                    disabled={isLoading}
                />
                <button type="submit" className="p-3 text-[#1428A0] hover:text-[#00B3E3]" disabled={isLoading}>
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
