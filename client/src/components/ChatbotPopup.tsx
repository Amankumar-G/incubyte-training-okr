import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown'; // Import this
import remarkGfm from 'remark-gfm'; // Import this
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
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isLoading]);

  const send = async () => {
    if (!input.trim()) return;
    const trimmedInput = input.trim();
    const userMsg: Message = { id: Date.now().toString(), from: 'user', text: trimmedInput };
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
      const errMsg: Message = {
        id: Date.now().toString() + '-err',
        from: 'bot',
        text: 'Failed to reach chatbot',
      };
      setMessages((m) => [...m, errMsg]);
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleClose = () => {
    onClose();
  };

  const startNewChat = () => {
    chatbotService.resetChat().catch(console.error);
    setMessages([]);
    setInput('');
    setIsLoading(false);
    textareaRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="OKR Chatbot"
      className="fixed bottom-24 right-8 z-50 w-[380px] max-w-[95%] bg-gray-50 rounded-2xl shadow-2xl border border-gray-200 flex flex-col h-[500px] overflow-hidden transition-all duration-300 ease-in-out"
    >
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shadow-md">
        <div className="font-bold flex items-center gap-2">OKR Assistant</div>
        <div className="flex items-center gap-2">
          <button
            onClick={startNewChat}
            className="text-white/80 hover:text-white text-xs uppercase font-semibold tracking-wide"
          >
            New Chat
          </button>
          <button onClick={handleClose} className="p-1 rounded hover:bg-white/10">
            ✕
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="p-4 flex-1 overflow-y-auto space-y-4 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-3xl">🤖</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">
              How can I help with your OKRs today?
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] text-sm px-4 py-3 shadow-sm ${
                  m.from === 'user'
                    ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm'
                    : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm'
                }`}
              >
                {/* CONDITIONAL RENDERING: Use Markdown for Bot, Text for User */}
                {m.from === 'bot' ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Customizing HTML elements with Tailwind classes
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc pl-4 space-y-1" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal pl-4 space-y-1" {...props} />
                      ),
                      li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                      h1: ({ node, ...props }) => (
                        <h1 className="text-lg font-bold mt-2 mb-1" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="text-base font-bold mt-2 mb-1" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 className="text-sm font-bold mt-2 mb-1" {...props} />
                      ),
                      a: ({ node, ...props }) => (
                        <a
                          className="text-blue-600 underline hover:text-blue-800"
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}
                        />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="mb-2 last:mb-0 leading-relaxed" {...props} />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong className="font-semibold text-gray-900" {...props} />
                      ),
                      code: ({ node, ...props }) => (
                        <code
                          className="bg-gray-100 text-red-500 px-1 py-0.5 rounded text-xs font-mono border border-gray-200"
                          {...props}
                        />
                      ),
                      // Improved Table Styling
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-2 border border-gray-200 rounded-lg">
                          <table
                            className="min-w-full divide-y divide-gray-200 text-xs"
                            {...props}
                          />
                        </div>
                      ),
                      thead: ({ node, ...props }) => <thead className="bg-gray-50" {...props} />,
                      th: ({ node, ...props }) => (
                        <th
                          className="px-3 py-2 text-left font-semibold text-gray-700 uppercase tracking-wider"
                          {...props}
                        />
                      ),
                      td: ({ node, ...props }) => (
                        <td
                          className="px-3 py-2 whitespace-nowrap text-gray-600 border-t border-gray-100"
                          {...props}
                        />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          className="border-l-4 border-blue-300 pl-3 italic text-gray-500 my-2"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {m.text}
                  </ReactMarkdown>
                ) : (
                  // User messages render as plain text to preserve whitespace formatting if needed
                  <div className="whitespace-pre-wrap">{m.text}</div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2 items-center bg-gray-50 p-1.5 rounded-3xl border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            disabled={isLoading}
            className="flex-1 bg-transparent border-none focus:ring-0 p-2 text-sm resize-none h-10 max-h-24 disabled:text-gray-400 placeholder-gray-400 outline-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
              if (e.key === 'Escape') {
                e.preventDefault();
                handleClose();
              }
            }}
          />
          <button
            onClick={send}
            disabled={isLoading || !input.trim()}
            className={`p-2 rounded-full transition-colors flex-shrink-0 ${
              isLoading || !input.trim()
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
            }`}
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
