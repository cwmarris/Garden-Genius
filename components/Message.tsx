
import React from 'react';
import { Message as MessageType } from '../types';
import { PlantIcon } from './icons/PlantIcon';
import { UserIcon } from './icons/UserIcon';

interface MessageProps {
  message: MessageType;
}

// Basic markdown to HTML converter
const MarkdownContent: React.FC<{ content: string }> = ({ content }) => {
    // Simple replacements for bold, lists, etc.
    const htmlContent = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italics
        .replace(/(\r\n|\n|\r)/g, '<br />') // Line breaks
        .replace(/(\n|^)- (.*)/g, '<li>$2</li>') // List items
        .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>'); // Wrap lists

    return <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  const bubbleClasses = isUser
    ? 'bg-green-600 text-white rounded-lg'
    : 'bg-white text-gray-800 rounded-lg border border-gray-200';
  const icon = isUser 
    ? <UserIcon className="w-8 h-8 text-white bg-green-400 rounded-full p-1" /> 
    : <PlantIcon className="w-8 h-8 text-green-600 bg-green-100 rounded-full p-1" />;
    
  const contentOrder = isUser ? 'order-1' : 'order-2';
  const iconOrder = isUser ? 'order-2 ml-2' : 'order-1 mr-2';

  return (
    <div className={`${containerClasses} items-end gap-2`}>
        <div className={`${iconOrder} self-start flex-shrink-0`}>
          {icon}
        </div>
        <div className={`${contentOrder} p-4 max-w-xl ${bubbleClasses} shadow-sm`}>
            {message.image && (
                <img 
                    src={message.image} 
                    alt="User upload" 
                    className="rounded-md mb-2 max-h-64"
                />
            )}
            {message.text && <MarkdownContent content={message.text} />}
        </div>
    </div>
  );
};
