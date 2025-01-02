import { Info, X } from 'lucide-react'
import { useState } from 'react';

export default function Header({ logo, title }) {
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <header className="bg-[#87CEEB] text-[#1428A0] shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center">
                {logo && <img src={logo} alt="SSAFY Logo" className="h-12 mr-3" />}
                <h1 className="text-2xl font-bold">{title}</h1>
            </div>
            <button className="rounded-full hover:bg-[#00B3E3] transition-colors p-1" onClick={openModal}>
                <Info className="w-6 h-6 text-[#1428A0]"/>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-[#1428A0]">부가정보</h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                <X className="w-6 h-6"/>
                            </button>
                        </div>

                        <p className="mb-4">
                            금융용어 및 금융상품 챗봇은 사용자가 궁금한 금융 용어와 상품에 대해
                            실시간으로 답변을 제공합니다. 궁금한 내용을 질문해 보세요!
                        </p>
                        <p className="text-sm opacity-90">2024.01.03 SSAFY 게절학기 AI 코스 서울 5팀</p>
                        <div className="flex w-full justify-end">
                            <button
                                onClick={closeModal}
                                className="mt-4 px-4 py-2 bg-[#1428A0] text-white rounded hover:bg-[#00B3E3] transition-colors"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
