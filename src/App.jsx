import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import Header from './components/Header'
import './App.css'
import ssafyLogo from './assets/ssafy-logo.png'

function App() {
    const [currentSessionId, setCurrentSessionId] = useState('')

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar onSelectSession={setCurrentSessionId} currentSessionId={currentSessionId} />
            <main className="flex flex-col flex-1">
                <Header logo={ssafyLogo} title="SSAFinancial" />
                <ChatArea sessionId={currentSessionId}/>
            </main>
        </div>
    )
}

export default App
