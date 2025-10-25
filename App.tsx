
import React, { useState, useCallback } from 'react';
import { ChatWindow } from './components/ChatWindow';
import { Message } from './types';
import { generateResponse, fileToGenerativePart } from './services/geminiService';
import { PlantIcon } from './components/icons/PlantIcon';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hello! I'm Garden Genius. How can I help you with your plants today? Feel free to upload a photo for identification or ask any gardening question.",
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = useCallback(async (text: string, image?: File) => {
    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      role: 'user',
      text,
    };

    if (image) {
      try {
        const imageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(image);
        });
        userMessage.image = imageBase64;
      } catch (e) {
        setError("Failed to read image file.");
        setIsLoading(false);
        return;
      }
    }
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      let imagePart;
      if (image) {
        imagePart = await fileToGenerativePart(image);
      }
      
      const responseText = await generateResponse(text, imagePart);
      
      const modelMessage: Message = {
        role: 'model',
        text: responseText,
      };
      setMessages((prevMessages) => [...prevMessages, modelMessage]);

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Sorry, I couldn't get a response. Error: ${errorMessage}`);
      const modelErrorMessage: Message = {
        role: 'model',
        text: `Sorry, something went wrong. Please try again. (${errorMessage})`,
      };
      setMessages((prevMessages) => [...prevMessages, modelErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);


  return (
    <div className="flex flex-col h-screen bg-green-50 font-sans">
        <header className="bg-white shadow-md p-4 flex items-center gap-3 border-b-2 border-green-200">
            <PlantIcon className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-800">Garden Genius</h1>
        </header>
        <main className="flex-1 overflow-hidden">
            <ChatWindow 
              messages={messages} 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading} 
            />
        </main>
    </div>
  );
};

export default App;
