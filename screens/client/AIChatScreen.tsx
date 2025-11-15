import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChatMessage } from '../../types';
import { IconArrowLeft, IconRobot, IconSend } from '../../components/icons';
import ChatMessageBubble from '../../components/ChatMessage';

// The type for the chat history that we pass back and forth to the serverless function
type GeminiChatHistory = {
    role: 'user' | 'model';
    parts: { text: string }[];
}[];

const AIChatScreen: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { category, currentDescription } = location.state || { category: 'عام', currentDescription: '' };

    const [conversation, setConversation] = useState<ChatMessage[]>([]);
    const [geminiHistory, setGeminiHistory] = useState<GeminiChatHistory>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [finalDescription, setFinalDescription] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initChat = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/.netlify/functions/gemini', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'initChat',
                        payload: { category, currentDescription }
                    }),
                });

                if (!response.ok) throw new Error("Failed to initialize chat");
                
                const data = await response.json();
                
                setConversation([{ role: 'model', text: data.text }]);
                setGeminiHistory(data.history);

            } catch (error) {
                console.error("Chat initialization failed:", error);
                setConversation([{ role: 'model', text: 'عذراً، حدث خطأ أثناء تهيئة المساعد الذكي.' }]);
            } finally {
                setIsLoading(false);
            }
        };

        initChat();
    }, [category, currentDescription]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [conversation, isLoading]);


    const handleSendMessage = async () => {
        if (!userInput.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: userInput };
        setConversation(prev => [...prev, userMessage]);
        const currentInput = userInput;
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/.netlify/functions/gemini', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({
                     action: 'sendMessage',
                     payload: { message: currentInput, history: geminiHistory }
                 }),
            });

            if (!response.ok) throw new Error("Failed to send message");

            const data = await response.json();
            const modelResponseText = data.text;
            
            if (modelResponseText.includes("هذا هو الملخص المقترح:")) {
                 const description = modelResponseText.split("هذا هو الملخص المقترح:")[1].trim();
                 setFinalDescription(description);
            }

            const modelMessage: ChatMessage = { role: 'model', text: modelResponseText };
            setConversation(prev => [...prev, modelMessage]);

            // Update the history for the next turn
            setGeminiHistory(prev => [...prev, 
                { role: 'user', parts: [{ text: currentInput }] },
                { role: 'model', parts: [{ text: modelResponseText }] }
            ]);

        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: ChatMessage = { role: 'model', text: 'عذراً، لم أتمكن من معالجة طلبك. الرجاء المحاولة مرة أخرى.' };
            setConversation(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleUseDescription = () => {
        if(finalDescription) {
            navigate('/request-service', { state: { aiDescription: finalDescription } });
        }
    };

    return (
        <div className="h-screen flex flex-col bg-brand-background">
            <header className="p-4 flex items-center gap-4 bg-brand-surface border-b border-gray-200 z-10">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <IconArrowLeft className="w-6 h-6 text-gray-700 transform scale-x-[-1]" />
                </button>
                <div className="flex items-center gap-2">
                    <IconRobot className="w-6 h-6 text-brand-primary" />
                    <h1 className="text-xl font-bold text-brand-on-surface">المساعد الذكي</h1>
                </div>
            </header>

            <main ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
                {conversation.map((msg, index) => (
                    <ChatMessageBubble key={index} message={msg} />
                ))}
                {isLoading && (
                    <ChatMessageBubble message={{ role: 'model', text: '...' }} />
                )}
            </main>
            
            {finalDescription && (
                <div className="p-4 bg-green-100 border-t-2 border-green-200">
                    <p className="text-sm text-green-800 font-semibold mb-2">اقتراح جاهز!</p>
                     <button
                        onClick={handleUseDescription}
                        className="w-full text-lg font-bold text-white bg-green-600 rounded-xl h-12 hover:bg-green-700 transition-all"
                    >
                        استخدام هذا الوصف
                    </button>
                </div>
            )}

            <footer className="p-4 bg-brand-surface border-t border-gray-200">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="اكتب رسالتك هنا..."
                        className="flex-grow p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !userInput.trim()}
                        className="w-12 h-12 flex-shrink-0 bg-brand-primary text-white rounded-full flex items-center justify-center hover:bg-brand-secondary transition-colors disabled:bg-gray-400"
                        aria-label="إرسال"
                    >
                        <IconSend className="w-5 h-5" />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default AIChatScreen;