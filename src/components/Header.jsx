import {Info, X} from 'lucide-react'
import {useState} from 'react';

export default function Header() {

    // 모달의 열림/닫힘 상태를 관리하는 state
    const [isOpen, setIsOpen] = useState(false);

    // 모달을 열 때 호출되는 함수
    const openModal = () => setIsOpen(true);

    // 모달을 닫을 때 호출되는 함수
    const closeModal = () => setIsOpen(false);

    return (
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">금융용어 및 금융상품 챗봇</h1>
            </div>
            <button className="rounded-full hover:bg-gray-200 transition-colors"
                    onClick={openModal}>
                <Info className="w-6 h-6"/>
            </button>

            {/* 모달 */}
            {isOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold ">부가정보</h2>
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
                                onClick={closeModal}  // 모달 닫기
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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

