import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIConsultantProps {
  lang: "ru" | "en";
}

export function AIConsultant({ lang }: AIConsultantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested questions
  const suggestions = {
    ru: [
      "Как начать зарабатывать?",
      "Безопасно ли это?",
      "Сколько можно заработать?",
      "Как вывести деньги?"
    ],
    en: [
      "How to start earning?",
      "Is it safe?",
      "How much can I earn?",
      "How to withdraw money?"
    ]
  };

  // UI Texts
  const texts = {
    ru: {
      headerTitle: "AI Консультант",
      headerSubtitle: "Онлайн • Отвечает мгновенно",
      placeholder: "Задайте ваш вопрос...",
      tooltip: "Привет! Есть вопросы по Honeygain? 😊",
      clearChat: "Очистить чат",
      supportSuggestion: "Если у вас сложный вопрос, вы всегда можете написать нашей поддержке.",
      errorMsg: "Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз."
    },
    en: {
      headerTitle: "AI Consultant",
      headerSubtitle: "Online • Responds instantly",
      placeholder: "Ask your question...",
      tooltip: "Hey! Any questions about Honeygain? 😊",
      clearChat: "Clear chat",
      supportSuggestion: "If you have a complex question, you can always contact our support.",
      errorMsg: "An error occurred while sending. Please try again."
    }
  };

  const t = texts[lang];

  // Tooltip auto-hide after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  // Welcome message when opening first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg = lang === "ru" 
        ? "Привет! 😊 Рад приветствовать вас на Honeygain.store! Я ваш личный AI-помощник. Помогу разобраться, как установить приложение, начать получать полностью пассивный доход и как принять участие в нашем ежемесячном конкурсе на $100! О чем рассказать в первую очередь?"
        : "Hello! 😊 Welcome to Honeygain.store! I'm your personal AI assistant. I can help you understand how to install the app, start earning completely passive income, and join our monthly $100 giveaway! What would you like to know first?";
      
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: welcomeMsg,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, lang, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Build conversation payload
      const historyPayload = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyPayload })
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text || "Извините, не удалось получить ответ.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: t.errorMsg,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    const welcomeMsg = lang === "ru" 
      ? "Привет! 😊 Давайте начнем сначала. Задайте любой вопрос о заработке на Honeygain!"
      : "Hello! 😊 Let's start fresh. Ask any question about earning on Honeygain!";
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        content: welcomeMsg,
        timestamp: new Date()
      }
    ]);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (showBadge) setShowBadge(false);
    if (showTooltip) setShowTooltip(false);
  };

  return (
    <>
      {/* Centered Chat Window Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            {/* Click outside to close */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="w-full max-w-[440px] h-[620px] max-h-[85vh] rounded-3xl shadow-2xl border flex flex-col overflow-hidden relative z-10 glass-card"
              style={{ 
                backgroundColor: "var(--card-bg)", 
                borderColor: "var(--card-border)",
                boxShadow: "0 25px 50px -12px rgba(246, 176, 38, 0.25)"
              }}
            >
              {/* Header */}
              <div className="px-5 py-4 flex items-center justify-between border-b relative" style={{ borderColor: "var(--card-border)" }}>
                {/* Glowing decorative indicator */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#f6b026]/40 to-transparent" />
                
                <div className="flex items-center space-x-3.5">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner">
                      <i className="fa-solid fa-robot text-xl animate-pulse"></i>
                    </div>
                    {/* Status Indicator */}
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
                    </span>
                  </div>
                  
                  <div className="text-left">
                    <h4 className="text-base font-extrabold tracking-tight text-amber-500" style={{ fontFamily: "Georgia" }}>
                      {t.headerTitle}
                    </h4>
                    <p className="text-[11px] opacity-75" style={{ color: "var(--text-muted)" }}>
                      {t.headerSubtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Trash can for clearing chat */}
                  {messages.length > 1 && (
                    <button
                      onClick={handleClear}
                      title={t.clearChat}
                      className="w-9 h-9 rounded-xl hover:bg-white/5 text-amber-500/70 hover:text-amber-500 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <i className="fa-solid fa-trash-can text-base"></i>
                    </button>
                  )}
                  {/* Close Button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center transition-colors cursor-pointer"
                    style={{ color: "var(--text-main)" }}
                  >
                    <i className="fa-solid fa-xmark text-xl"></i>
                  </button>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} items-end space-x-2`}
                  >
                    {m.role === "assistant" && (
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex-shrink-0 flex items-center justify-center text-amber-500 text-xs">
                        <i className="fa-solid fa-robot"></i>
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs sm:text-[13px] leading-relaxed text-left ${
                        m.role === "user"
                          ? "honey-gradient text-slate-950 font-medium rounded-br-sm shadow-md"
                          : "glass-card border rounded-bl-sm"
                      }`}
                      style={
                        m.role === "assistant"
                          ? { 
                              backgroundColor: "rgba(255, 255, 255, 0.02)", 
                              borderColor: "var(--card-border)",
                              color: "var(--text-main)"
                            }
                          : undefined
                      }
                    >
                      <div className="whitespace-pre-line">{m.content}</div>
                      <span 
                        className={`block text-[9px] mt-1 text-right opacity-50 ${
                          m.role === "user" ? "text-slate-950/70" : ""
                        }`}
                      >
                        {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isLoading && (
                  <div className="flex justify-start items-end space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex-shrink-0 flex items-center justify-center text-amber-500 text-xs">
                      <i className="fa-solid fa-robot"></i>
                    </div>
                    <div 
                      className="rounded-2xl px-4 py-3 border glass-card flex items-center space-x-1"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.02)", borderColor: "var(--card-border)" }}
                    >
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestion Chips */}
              {!isLoading && (
                <div className="px-5 py-3 border-t flex flex-wrap gap-1.5 bg-black/10" style={{ borderColor: "var(--card-border)" }}>
                  {suggestions[lang].map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(s)}
                      className="text-[11px] font-semibold px-3 py-1.5 rounded-full border border-amber-500/25 bg-amber-500/5 hover:bg-amber-500/15 hover:border-amber-500/50 text-amber-500 transition-all cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Footer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="p-4 border-t flex items-center space-x-2.5 bg-black/20"
                style={{ borderColor: "var(--card-border)" }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.placeholder}
                  className="flex-1 bg-transparent border-0 outline-none focus:ring-0 text-xs sm:text-sm px-2 py-1.5"
                  style={{ color: "var(--text-main)" }}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    input.trim() && !isLoading
                      ? "honey-gradient text-slate-950 shadow-md shadow-amber-500/10 scale-100 hover:scale-105 active:scale-95"
                      : "opacity-40"
                  }`}
                  style={!(input.trim() && !isLoading) ? { backgroundColor: "var(--card-border)", color: "var(--text-muted)" } : undefined}
                >
                  <i className="fa-solid fa-paper-plane text-xs"></i>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Trigger & Tooltip (Fixed bottom and right) */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 flex flex-col items-end">
        {/* Greeting Tooltip bubble above the button */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.3 }}
              className="mb-3 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold select-none cursor-pointer border glass-card text-left max-w-[240px] relative"
              style={{ 
                borderColor: "var(--card-border)", 
                backgroundColor: "var(--card-bg)",
                color: "var(--text-main)" 
              }}
              onClick={toggleChat}
            >
              {/* Tiny triangle under bubble */}
              <div 
                className="absolute bottom-[-6px] right-6 w-3.5 h-3.5 transform rotate-45 border-r border-b"
                style={{ 
                  borderColor: "var(--card-border)", 
                  backgroundColor: "var(--card-bg)" 
                }}
              />
              <div className="flex items-center space-x-2 z-10 relative">
                <i className="fa-solid fa-comment-dots text-amber-500 text-sm"></i>
                <span>{t.tooltip}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Toggle Button */}
        <motion.button
          onClick={toggleChat}
          className="w-14 h-14 rounded-full honey-gradient text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-110 active:scale-95 transition-all cursor-pointer relative group"
          id="ai-consultant-trigger"
          title={t.headerTitle}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring" }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Icon Animation */}
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.i
                key="close"
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fa-solid fa-xmark text-xl relative z-10"
              ></motion.i>
            ) : (
              <motion.i
                key="bot"
                initial={{ rotate: 45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -45, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fa-solid fa-robot text-xl relative z-10 animate-pulse"
              ></motion.i>
            )}
          </AnimatePresence>

          {/* Badge Notification */}
          {showBadge && !isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] font-extrabold text-white flex items-center justify-center">
                1
              </span>
            </span>
          )}
        </motion.button>
      </div>
    </>
  );
}
