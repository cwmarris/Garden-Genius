
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message as MessageType } from '../types';
import { Message } from './Message';
import { Spinner } from './Spinner';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { PaperclipIcon } from './icons/PaperclipIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface ChatWindowProps {
  messages: MessageType[];
  onSendMessage: (text: string, image?: File) => void;
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isLoading }) => {
  const [textInput, setTextInput] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    if (selectedFile) {
        const objectUrl = URL.createObjectURL(selectedFile);
        setImagePreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }
    setImagePreview(null);
  }, [selectedFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        setSelectedFile(event.target.files[0]);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (textInput.trim() || selectedFile) {
      onSendMessage(textInput.trim(), selectedFile || undefined);
      setTextInput('');
      removeSelectedFile();
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <Message key={index} message={msg} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 rounded-lg p-3 max-w-lg inline-block">
                <Spinner />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 bg-white border-t border-gray-200">
        {imagePreview && (
          <div className="mb-2 p-2 bg-gray-100 rounded-lg relative w-32 h-32">
            <img src={imagePreview} alt="Selected preview" className="w-full h-full object-cover rounded" />
            <button
              onClick={removeSelectedFile}
              className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
              aria-label="Remove image"
            >
              <XCircleIcon className="w-5 h-5" />
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          <button
            type="button"
            onClick={handleAttachClick}
            className="p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            aria-label="Attach image"
          >
            <PaperclipIcon className="w-6 h-6" />
          </button>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={handleTextareaKeyDown}
            placeholder={selectedFile ? "Describe the image or ask a question..." : "Ask about your garden..."}
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || (!textInput.trim() && !selectedFile)}
            className="p-3 bg-green-600 text-white rounded-full disabled:bg-green-300 disabled:cursor-not-allowed hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};
