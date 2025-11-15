import React from 'react';
import { ChatMessage } from '../types';
import { IconRobot } from './icons';

interface ChatMessageProps {
    message: ChatMessage;
}

const ChatMessageBubble: React.FC<ChatMessageProps> = ({ message }) => {
    const isModel = message.role === 'model';

    return (
        <div className={`flex items-end gap-2 ${isModel ? 'justify-start' : 'justify-end'}`}>
            {isModel && (
                 <div className="flex-shrink-0 w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center">
                    <IconRobot className="w-5 h-5 text-brand-primary" />
                </div>
            )}
            <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    isModel
                        ? 'bg-gray-200 text-brand-on-surface rounded-bl-none'
                        : 'bg-brand-primary text-brand-on-primary rounded-br-none'
                }`}
            >
                {message.text === '...' ? (
                    <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></span>
                    </div>
                ) : (
                    <p style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>
                )}
            </div>
        </div>
    );
};

export default ChatMessageBubble;
