import { useEffect, useRef, useState } from 'react';
import chatbotService from '../api/services/chatbotService';

interface Message {
  id: string;
  from: 'user' | 'bot';
  text: string;
}

export default function ChatbotPopup({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // focus the textarea when modal opens
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), from: 'user', text: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const resp = await chatbotService.sendMessage(userMsg.text);
      const botText = resp?.data?.message || 'No response from chatbot';
      const botMsg: Message = { id: Date.now().toString() + '-bot', from: 'bot', text: botText };
      setMessages((m) => [...m, botMsg]);
    } catch (error) {
      console.error('Chatbot request failed', error);
      const errMsg: Message = { id: Date.now().toString() + '-err', from: 'bot', text: 'Failed to reach chatbot' };
      setMessages((m) => [...m, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="OKR Chatbot"
      className="fixed bottom-20 right-6 z-50 w-[360px] max-w-[95%] bg-white rounded-xl shadow-2xl flex flex-col h-96 overflow-hidden"
    >
      <div className="px-4 py-2 bg-linear-to-r from-blue-500 to-blue-600 text-white flex items-center justify-between">
        <div className="font-semibold">OKR Chatbot</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMessages([]);
            }}
            aria-label="Clear chat"
            className="text-white/80 hover:text-white text-sm"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            aria-label="Close chatbot"
            className="p-1 rounded hover:bg-white/10"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-3 flex-1 overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <div className="text-sm text-gray-500">Ask me about your Objectives or Key Results.</div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] text-sm px-3 py-2 rounded-lg ${m.from === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}
              >
                {m.text}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-gray-100 bg-white">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 p-2 border border-gray-200 rounded-md h-14 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button
            onClick={send}
            disabled={isLoading || !input.trim()}
            className={`px-4 py-2 rounded-md text-white ${isLoading || !input.trim() ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
