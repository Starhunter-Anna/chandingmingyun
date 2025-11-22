import React, { useState, useRef, useEffect } from 'react';
import { BaziResult, ChatMessage, Language } from '../types';
import { createBaziChat } from '../services/geminiService';
import { Send, User, Bot, Loader2, X } from 'lucide-react';
import { Chat, GenerateContentResponse } from '@google/genai';
import { t } from '../translations';

interface ChatInterfaceProps {
  bazi: BaziResult;
  lang: Language;
  onClose: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ bazi, lang, onClose }) => {
  const txt = t(lang);
  
  const getInitialMessage = () => {
      if (lang === 'zh') {
          return `您好。我已经分析了您出生在${bazi.birthPlace}的八字。您的日主是${bazi.dayMaster}（${t(lang).elements[bazi.dayPillar.ganElement as keyof typeof txt.elements]}）。今天我可以为您指引什么？您可以询问关于事业、财运或姻缘。`;
      } else {
          return `Greetings. I have analyzed your BaZi chart based on your birth in ${bazi.birthPlace}. Your Day Master is ${bazi.dayMaster} (${bazi.dayPillar.ganElement}). How may I guide you today? You can ask about Career, Wealth, or Relationships.`;
      }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Re-initialize when bazi or lang changes
  useEffect(() => {
    chatSessionRef.current = createBaziChat(bazi, lang);
    setMessages([{
        id: 'init',
        role: 'model',
        text: getInitialMessage()
    }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bazi, lang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chatSessionRef.current || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const responseStream = await chatSessionRef.current.sendMessageStream({ message: userMsg.text });
      
      const botMsgId = (Date.now() + 1).toString();
      let fullText = '';
      
      // Add placeholder bot message
      setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '', isStreaming: true }]);

      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        if (text) {
            fullText += text;
            setMessages(prev => prev.map(msg => 
                msg.id === botMsgId ? { ...msg, text: fullText } : msg
            ));
        }
      }
      
      // Finalize message
      setMessages(prev => prev.map(msg => 
        msg.id === botMsgId ? { ...msg, isStreaming: false } : msg
      ));

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: lang === 'zh' ? "连接中断，请重试。" : "The cosmic connection was interrupted. Please try asking again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] max-h-[70vh] w-full md:w-[400px] bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden animate-scale-in origin-bottom-right">
      {/* Header */}
      <div className="bg-stone-800 text-white p-4 flex justify-between items-center shadow-sm">
        <h3 className="text-lg font-serif-sc font-bold flex items-center gap-2">
          <Bot size={20} className="text-amber-400" />
          {txt.chatTitle}
        </h3>
        <button onClick={onClose} className="text-stone-400 hover:text-white transition-colors">
            <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#faf9f6]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-stone-700 text-white' : 'bg-amber-600 text-white'}`}>
                {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
              </div>
              <div className={`p-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-stone-700 text-white rounded-tr-none' 
                  : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none'
              }`}>
                {msg.text}
                {msg.isStreaming && <span className="inline-block w-1.5 h-4 ml-1 bg-amber-500 animate-pulse align-middle"></span>}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length < 3 && (
         <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide bg-stone-50/50">
            {txt.suggestions.map((s, i) => (
                <button 
                    key={i} 
                    onClick={() => setInputValue(s)}
                    className="text-[10px] whitespace-nowrap bg-white hover:bg-amber-50 text-stone-600 px-2 py-1 rounded-full border border-stone-200 transition-colors shadow-sm"
                >
                    {s}
                </button>
            ))}
         </div>
      )}

      <div className="p-3 bg-white border-t border-stone-100">
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={txt.chatPlaceholder}
            className="flex-1 bg-stone-50 border border-stone-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors shadow-md"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};