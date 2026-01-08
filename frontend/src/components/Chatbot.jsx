import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import api from '../api/api';
import './Chatbot.css';
import { IoChatbubblesSharp, IoSend, IoClose, IoSchool } from 'react-icons/io5';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Chào bạn! Mình là trợ lý ảo AcaSparkX. Bạn cần mình tư vấn về khóa học hay tạo bài test ôn tập không?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const location = useLocation();

    // Tự động lấy lessonId từ URL khi Chatbot được mở
    const lessonMatch = location.pathname.match(/\/learn\/([^/]+)/);
    const lessonId = lessonMatch ? lessonMatch[1] : null;

    // Tự động cuộn xuống cuối tin nhắn
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await api.post('/chatbot/consult', { message: input });
            const botMsg = { id: Date.now() + 1, text: response.data.message, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorText = error.response?.data?.details || "Ối, có lỗi gì đó rồi. Bạn thử lại sau nhé!";
            setMessages(prev => [...prev, { id: Date.now() + 1, text: errorText, sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateQuiz = async () => {
        if (!lessonId || isLoading) return;

        setIsLoading(true);
        setMessages(prev => [...prev, { id: Date.now(), text: "Đang tạo bộ câu hỏi ôn tập cho bạn...", sender: 'bot' }]);

        try {
            const response = await api.post('/chatbot/quiz', { lesson_id: lessonId });
            const quizData = response.data;

            if (Array.isArray(quizData)) {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    type: 'quiz',
                    questions: quizData,
                    sender: 'bot'
                }]);
            } else {
                throw new Error("Invalid quiz data structure");
            }
        } catch (error) {
            console.error("Quiz error:", error);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "Không thể tạo câu hỏi lúc này. Thử lại sau nhé!", sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const isLessonPage = location.pathname.includes('/learn/');

    return (
        <div className="chatbot-container">
            {!isOpen && (
                <button className="chatbot-button" onClick={() => setIsOpen(true)}>
                    <IoChatbubblesSharp />
                </button>
            )}

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h3>Trợ lý AcaSparkX</h3>
                        <button className="close-btn" onClick={() => setIsOpen(false)}><IoClose /></button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`message ${msg.sender}`}>
                                {msg.type === 'quiz' ? (
                                    <QuizComponent questions={msg.questions} />
                                ) : (
                                    msg.text
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message bot">
                                <div className="loading-dots">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {isLessonPage && !isLoading && (
                        <div style={{ padding: '0 20px 10px' }}>
                            <button
                                className="chatbot-footer-action"
                                onClick={handleGenerateQuiz}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '10px',
                                    border: '1px solid #22c55e',
                                    background: '#f0fdf4',
                                    color: '#16a34a',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <IoSchool /> Tạo câu hỏi ôn tập bài này
                            </button>
                        </div>
                    )}

                    <form className="chatbot-footer" onSubmit={handleSend}>
                        <input
                            type="text"
                            placeholder="Nhập tin nhắn..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit" className="send-btn"><IoSend /></button>
                    </form>
                </div>
            )}
        </div>
    );
};

const QuizComponent = ({ questions }) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleAnswer = (idx) => {
        if (selectedOption !== null) return;

        setSelectedOption(idx);
        if (idx === questions[currentIdx].answer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(currentIdx + 1);
            setSelectedOption(null);
        } else {
            setShowResult(true);
        }
    };

    if (showResult) {
        return (
            <div className="quiz-container">
                <h4 style={{ margin: '0 0 10px' }}>Điểm số: {score}/{questions.length}</h4>
                <p style={{ fontSize: '0.9rem', margin: 0 }}>
                    {score === questions.length ? "Tuyệt vời! Bạn đã nắm vững bài học." : "Cố gắng lên nhé, bạn có thể xem lại bài học để hiểu rõ hơn."}
                </p>
            </div>
        );
    }

    const q = questions[currentIdx];

    return (
        <div className="quiz-container">
            <div className="quiz-question">Câu {currentIdx + 1}: {q.question}</div>
            <div className="quiz-options">
                {q.options.map((opt, i) => (
                    <button
                        key={i}
                        className={`quiz-option ${selectedOption === i ? (i === q.answer ? 'correct' : 'wrong') : (selectedOption !== null && i === q.answer ? 'correct' : '')}`}
                        onClick={() => handleAnswer(i)}
                    >
                        {opt}
                    </button>
                ))}
            </div>
            {selectedOption !== null && (
                <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '10px' }}>
                        {q.explanation}
                    </div>
                    <button className="quiz-next-btn" onClick={handleNext}>
                        {currentIdx < questions.length - 1 ? "Câu tiếp theo" : "Xem kết quả"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
