'use client'

import {useState, useEffect} from 'react'
import {PlusCircle, Trash2, X} from 'lucide-react'
import {getChatSessions, createChatSession, clearAllData, deleteSession} from '../utils/db'
import {Modal} from './Modal'

export default function Sidebar({
                                    onSelectSession,
                                    currentSessionId
                                }) {
    const [chatSessions, setChatSessions] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        onConfirm: () => {
        }
    })

    useEffect(() => {
        loadChatSessions()
    }, [])

    async function loadChatSessions() {
        const sessions = await getChatSessions()
        setChatSessions(sessions.sort((a, b) => b.timestamp - a.timestamp))
    }

    const handleNewChat = async () => {
        const newSessionId = await createChatSession()
        await loadChatSessions()
        onSelectSession(newSessionId)
    }

    const handleClearAllChats = () => {
        setModalConfig({
            title: '모든 채팅 삭제',
            message: '모든 채팅을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
            onConfirm: async () => {
                await clearAllData()
                setChatSessions([])
                onSelectSession('')
            }
        })
        setIsModalOpen(true)
    }

    const handleDeleteSession = (sessionId) => {
        setModalConfig({
            title: '채팅 삭제',
            message: '이 채팅을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
            onConfirm: async () => {
                await deleteSession(sessionId)
                await loadChatSessions()
                if (currentSessionId === sessionId) {
                    onSelectSession('')
                }
            }
        })
        setIsModalOpen(true)
    }

    return (
        <div className="w-64 bg-[#DBF3FE] text-black p-4 flex flex-col">
            <button
                onClick={handleNewChat}
                className="flex items-center justify-center w-full py-3 px-3 mb-4 rounded-md text-sm bg-[#6dcef5] hover:bg-[#F0F0F0] text-black font-semibold transition-colors"
            >
                <PlusCircle className="w-4 h-4 mr-2"/>
                새 채팅
            </button>
            <div className="flex-1 overflow-y-auto">
                {chatSessions.map((session) => (
                    <div
                        key={session.id}
                        className={`flex items-center justify-between py-2 px-3 rounded-md hover:bg-[#C3E7F5] cursor-pointer mb-2 ${
                            session.id === currentSessionId ? 'bg-[#C3E7F5]' : ''
                        }`}
                    >
                        <div
                            onClick={() => onSelectSession(session.id)}
                            className="flex-1 overflow-hidden"
                        >
                            <div className="text-sm truncate">{session.title}</div>
                            <div className="text-xs text-black">
                                {new Date(session.timestamp).toLocaleString()}
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSession(session.id);
                            }}
                            className="p-1 rounded-full hover:bg-[#C3E7F5]"
                        >
                            <X className="w-4 h-4"/>
                        </button>
                    </div>
                ))}
            </div>
            <button
                onClick={handleClearAllChats}
                className="flex items-center justify-center w-full py-3 px-3 mt-4 rounded-md text-sm bg-[#1E94F6] hover:bg-[#0F1E6E] text-white font-semibold transition-colors"
            >
                <Trash2 className="w-4 h-4 mr-2"/>
                모든 채팅 삭제
            </button>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
            />
        </div>
    )
}