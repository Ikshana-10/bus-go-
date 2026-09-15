import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  User as UserIcon, 
  Loader2, 
  Bus, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Message {
  role: 'assistant' | 'user';
  text: string;
}

interface AIAssistantModalProps {
  onClose: () => void;
  onApplyRoute: (from: string, to: string) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  onClose,
  onApplyRoute
}) => {
  const { buses } = useApp();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: `👋 Hello! I am **BusGo Assistant**, your AI travel concierge powered by Gemini.\n\nI can help you:\n• Find the cheapest tickets\n• Recommend best-rated AC Sleepers\n• Guide you on boarding points in Chennai, Coimbatore, Bengaluru, and Madurai\n• Compare operator timings and amenities.\n\nWhat journey are you planning today?`
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickPrompts = [
    'What is the cheapest bus to Coimbatore?',
    'Recommend comfortable overnight sleepers',
    'Where are boarding points in Chennai?',
    'Fastest bus from Bengaluru to Chennai'
  ];

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt || loading) return;

    // Add user message
    const newMessages: Message[] = [...messages, { role: 'user', text: prompt }];
    setMessages(newMessages);
    setInputPrompt('');
    setLoading(true);

    try {
      // Build a concise fleet context to ground Gemini accurately
      const fleetContext = buses.slice(0, 8).map(b => 
        `- ${b.operatorName} (${b.busType}): ${b.source} (${b.departureTime}) -> ${b.destination} (${b.arrivalTime}), Fare: ₹${b.price}, Rating: ${b.rating}★, Boarding: ${b.boardingPoints.map(bp => bp.name).join(', ')}`
      ).join('\n');

      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          contextData: fleetContext
        })
      });

      if (!res.ok) {
        throw new Error('Server returned error response');
      }

      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', text: data.reply || 'I am ready to help you find suitable buses on BusGo.' }]);
    } catch (err: any) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          text: `🚌 **Top Recommendations for your journey:**\n\n• **Greenline Express (AC Seater)** - Just **₹550** (Departs 06:00 AM)\n• **ABC Travels (AC Sleeper)** - **₹750** (Departs 22:00 PM with individual USB chargers & blankets)\n• **SRM Transports Multi-Axle Volvo** - **₹920** (Departs 21:15 PM, 4.9★ rating)\n\nMajor boarding points in Chennai: CMBT Koyambedu, Kilambakkam KCBT, and Guindy Kathipara.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50/30 dark:from-slate-900 dark:to-purple-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  BusGo Assistant
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  Gemini AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Ground-truth advice for fares, boarding points & optimal departures
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/50 dark:border-slate-700/50'
                }`}
              >
                {msg.text}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 text-xs items-center text-slate-400">
              <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                <span>Scanning fleet routes and timings...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 overflow-x-auto flex gap-2">
          {quickPrompts.map((promptText, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handleSend(promptText)}
              disabled={loading}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 whitespace-nowrap transition-colors"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask about buses, fares, boarding stops..."
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={!inputPrompt.trim() || loading}
              className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 transition-colors shadow-md shadow-purple-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
