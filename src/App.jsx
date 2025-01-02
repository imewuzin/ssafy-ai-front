import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import Header from './components/Header'
import './App.css'
import ssafyLogo from './assets/logo.png'

function App() {
    const [currentSessionId, setCurrentSessionId] = useState('')

    return (
        <div className="flex h-screen bg-[#87CEEB]">
            <Sidebar onSelectSession={setCurrentSessionId} currentSessionId={currentSessionId} />
            <main className="flex flex-col flex-1 bg-white">
                <Header logo={ssafyLogo} title="SSAFinancial" />
                <ChatArea sessionId={currentSessionId}/>
            </main>
        </div>
    )
}

export default App
