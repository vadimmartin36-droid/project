import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Direct client-side Gemini REST API fetch helper
async function callGeminiDirectly(key: string, history: { role: string; content: string }[]) {
  const systemInstructionText = `Ты — дружелюбный и профессиональный AI-консультант на русском языке на сайте honeygain.store. 

Твоя задача — помогать посетителям разобраться в сервисе Honeygain, отвечать на вопросы о том, как начать зарабатывать, как работает приложение, и помогать решать типичные проблемы.

ПРАВИЛА ДЛЯ АССИСТЕНТА:
1. Всегда начинай диалог с дружелюбного приветствия и предложения помощи.
2. Отвечай кратко, ясно и по делу на русском языке. Избегай слишком длинных текстов, разбивай информацию на небольшие абзацы или списки для легкости чтения.
3. Если вопрос сложный, специфический, требует доступа к личному кабинету пользователя или касается технических сбоев выплат, вежливо предложи пользователю обратиться в официальную службу поддержки Honeygain на их официальном сайте или написать нашему администратору Вадиму Мартину в Telegram (ссылка есть в подвале нашего сайта).
4. Общайся исключительно в вежливом, позитивном и теплом тоне.

КЛЮЧЕВЫЕ ЗНАНИЯ О HONEYGAIN И САЙТЕ HONEYGAIN.STORE:
- Наш сайт honeygain.store — это независимый информационный и партнерский (реферальный) ресурс.
- Мы помогаем пользователям начать зарабатывать на Honeygain и даем дополнительный бонус за регистрацию по нашей ссылке.
- Приветственный бонус: при регистрации по нашей реферальной ссылке (кнопки на сайте) каждый новый пользователь мгновенно получает гарантированный бонус $3 на свой баланс бесплатно!
- Как начать зарабатывать:
  1. Зарегистрироваться по ссылке на нашем сайте (получить $3 сразу).
  2. Скачать и установить приложение Honeygain (поддерживаются Windows, macOS, Linux, Android, iOS).
  3. Запустить приложение и оставить его работать в фоновом режиме, пока устройство подключено к Интернету.
- Выплаты: Можно выводить средства через PayPal или в криптовалюте JumpTask (JMPT) в любое время при достижении порога.
- Реферальная система: 25% пожизненный бонус от ежедневного заработка приглашенных друзей.
- Ежемесячный Мега-Конкурс: Проводится на нашем сайте. Призовой фонд $100 каждый месяц ($50 за 1-е место, $30 за 2-е, $20 за 3-е). Розыгрыш проходит 1-го числа каждого месяца в 20:00 UTC, результаты публикуются в нашем официальном Telegram-канале @vadimmartin. Для участия достаточно зарегистрироваться по нашей ссылке, установить приложение и быть активным (приглашение 3 друзей удваивает шансы!).
- Совместимость: работает на ПК (Windows, Mac, Linux), Android-смартфонах и iOS-устройствах (iPhone/iPad). Максимум 1 активное устройство на один IP-адрес. Можно подключить больше устройств, если у них разные IP-адреса.`;

  const contents = history.map(h => ({
    role: h.role === "assistant" ? "model" : "user",
    parts: [{ text: h.content }]
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [{ text: systemInstructionText }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      })
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`REST Error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!result) {
    throw new Error("No text content returned");
  }
  return result;
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userApiKey, setUserApiKey] = useState(() => localStorage.getItem("honeygain_gemini_api_key") || "");
  
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

      let apiResponseText = "";
      let parsedSuccessfully = false;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: historyPayload })
        });

        // If response is OK and has JSON content type (avoiding Netlify 200 HTML redirects on non-existent endpoints)
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (data && data.text) {
            apiResponseText = data.text;
            parsedSuccessfully = true;
          }
        }
      } catch (apiError) {
        console.warn("API request failed or timed out, falling back to smart local AI assistant logic:", apiError);
      }

      // Smart Local Client-Side AI Response Fallback if API failed, timed out, or returned non-JSON
      if (!parsedSuccessfully) {
        const clientApiKey = localStorage.getItem("honeygain_gemini_api_key") || (import.meta as any).env?.VITE_GEMINI_API_KEY;
        if (clientApiKey) {
          try {
            apiResponseText = await callGeminiDirectly(clientApiKey, historyPayload);
            parsedSuccessfully = true;
          } catch (geminiError) {
            console.error("Direct client-side Gemini call failed:", geminiError);
          }
        }
      }

      // 3. Static templates fallback if no client-side API key or if the call failed
      if (!parsedSuccessfully) {
        const query = textToSend.toLowerCase().trim();
        if (lang === "ru") {
          if (query.includes("начать") || query.includes("как заработать") || query.includes("как начать") || query.includes("старт") || query.includes("регистрац") || query.includes("запустить") || query.includes("установ")) {
            apiResponseText = "Привет! 😊 Чтобы начать зарабатывать в Honeygain, выполните три простых шага:\n\n1. **Зарегистрируйтесь** по реферальной ссылке на нашем сайте (вы сразу получите приветственный бонус **$3** на ваш баланс!).\n2. **Скачайте и установите** официальное приложение Honeygain на любое ваше устройство (поддерживаются Windows, macOS, Linux, Android и iOS).\n3. **Запустите приложение** и войдите в свой аккаунт. Оно будет безопасно работать в фоновом режиме, делясь неиспользуемым интернетом и принося вам полностью пассивный доход!\n\nЕсли у вас возникнут сложности, я всегда готов подсказать!";
          } else if (query.includes("безопасн") || query.includes("вирус") || query.includes("данн") || query.includes("слеж") || query.includes("вред") || query.includes("честн")) {
            apiResponseText = "Привет! 😊 Да, приложение Honeygain абсолютно безопасно!\n\n• Оно использует только неиспользуемую часть вашего интернет-трафика для задач контентной доставки и маркетинговых исследований проверенных компаний.\n• У приложения **нет доступа** к вашим личным файлам, контактам, фотографиям, банковским картам или персональным данным.\n• Все соединения шифруются, приложение не замедляет работу устройства и не содержит вирусов.\n\nВы можете использовать его с полной уверенностью в безопасности вашей конфиденциальности!";
          } else if (query.includes("сколько") || query.includes("доход") || query.includes("заработок") || query.includes("прибыль") || query.includes("деньг") || query.includes("платят") || query.includes("курс")) {
            apiResponseText = "Привет! 😊 Ваш заработок зависит от нескольких важных факторов:\n\n• **Объема трафика**, которым вы делитесь (зависит от скорости интернета).\n• **Количества устройств** (можно подключить по 1 устройству на каждый уникальный IP-адрес).\n• **Вашего региона** (в некоторых странах спрос на трафик выше).\n\nВ среднем пользователи зарабатывают от **$10 до $30 в месяц** полностью пассивно. Чтобы увеличить доход, вы можете участвовать в нашем ежемесячном конкурсе на **$100** и приглашать друзей — вы будете пожизненно получать **25%** от их ежедневного заработка!";
          } else if (query.includes("вывести") || query.includes("вывод") || query.includes("выплат") || query.includes("paypal") || query.includes("крипт") || query.includes("jmpt") || query.includes("кошел")) {
            apiResponseText = "Привет! 😊 Вывести заработанные средства можно очень просто и удобно при достижении минимального порога выплат:\n\n1. **PayPal** — классический вывод фиатных денег прямо на ваш кошелек.\n2. **JumpTask (JMPT)** — вывод в криптовалюте без минимального порога и практически без комиссий в любое время!\n\nСервис выплачивает средства стабильно и честно. Если у вас возникнут вопросы по конкретной выплате, наша поддержка всегда поможет разобраться.";
          } else if (query.includes("привет") || query.includes("здравствуй") || query.includes("здравствуйте") || query.includes("добрый день") || query.includes("добрый вечер") || query.includes("ку")) {
            apiResponseText = "Привет! 😊 Рад приветствовать вас на Honeygain.store! Я ваш личный AI-помощник.\n\nЯ с удовольствием помогу вам разобраться в сервисе, расскажу, как установить приложение, начать получать полностью пассивный доход и как принять участие в нашем ежемесячном конкурсе на $100! О чем рассказать подробнее?";
          } else if (query.includes("конкурс") || query.includes("розыгрыш") || query.includes("100") || query.includes("выиграть") || query.includes("приз")) {
            apiResponseText = "Привет! 😊 Наш ежемесячный Мега-Конкурс с призовым фондом **$100** проводится 1-го числа каждого месяца в 20:00 UTC!\n\n• **1-е место**: $50 на ваш баланс.\n• **2-е место**: $30.\n• **3-е место**: $20.\n\n**Правила участия простые**:\n1. Зарегистрируйтесь по нашей ссылке (получите гарантированный бонус $3 сразу).\n2. Установите приложение Honeygain и держите его активным.\n3. Пригласите 3 друзей (это удваивает ваши шансы в конкурсе!).\nРезультаты конкурса публикуются в нашем официальном Telegram-канале Vadim Martin!";
          } else {
            apiResponseText = "Привет! 😊 Я ваш дружелюбный AI-консультант. Моя задача — помогать посетителям разобраться в сервисе, отвечать на вопросы о том, как начать зарабатывать, как работает приложение, и помогать решать типичные проблемы.\n\nВы можете спросить меня:\n• *Как начать зарабатывать на Honeygain?*\n• *Безопасно ли использовать приложение?*\n• *Сколько можно заработать?*\n• *Как вывести деньги?*\n• *Как принять участие в конкурсе на $100?*\n\n⚠️ **Для владельца сайта**: так как сайт запущен на статическом хостинге, для ответов на любые свободные вопросы без шаблонов, пожалуйста, укажите ваш бесплатный API-ключ Gemini во встроенных настройках чата (значок шестерёнки ⚙️ в верхнем правом углу).";
          }
        } else {
          // English Fallbacks
          if (query.includes("start") || query.includes("earn") || query.includes("how to start") || query.includes("regist") || query.includes("install") || query.includes("setup")) {
            apiResponseText = "Hello! 😊 To start earning with Honeygain, follow these three simple steps:\n\n1. **Register** using the referral link on our website to immediately get a **$3 welcome bonus**!\n2. **Download and install** the official Honeygain app on your devices (Windows, macOS, Linux, Android, iOS supported).\n3. **Run the app** and log in. It will safely work in the background, sharing unused internet and earning you passive income!\n\nIf you have any questions, I'm here to help!";
          } else if (query.includes("safe") || query.includes("virus") || query.includes("data") || query.includes("secur") || query.includes("privac")) {
            apiResponseText = "Hello! 😊 Yes, Honeygain is completely safe!\n\n• It only uses your unused internet bandwidth for content delivery and web intelligence tasks by verified companies.\n• The app **never** accesses your personal files, photos, contacts, cards, or private data.\n• All connections are fully encrypted and secure.\n\nYou can use it with absolute peace of mind!";
          } else if (query.includes("how much") || query.includes("income") || query.includes("money") || query.includes("profit") || query.includes("revenue") || query.includes("rate")) {
            apiResponseText = "Hello! 😊 Your earnings depend on a few factors:\n\n• **Shared traffic volume** (depends on your internet speed).\n• **Number of devices** (you can connect 1 device per unique IP address).\n• **Your location** (higher demand in some countries).\n\nOn average, users earn **$10 to $30 per month** completely passively. To earn more, join our monthly **$100 contest** and invite friends to get **25%** of their daily earnings!";
          } else if (query.includes("withdraw") || query.includes("payout") || query.includes("paypal") || query.includes("crypto") || query.includes("jmpt") || query.includes("wallet")) {
            apiResponseText = "Hello! 😊 Withdrawing your earnings is very easy once you reach the payout threshold:\n\n1. **PayPal** — standard fiat payout directly to your wallet.\n2. **JumpTask (JMPT)** — crypto payout with no minimum threshold and almost zero transaction fees at any time!\n\nHoneygain payouts are stable and reliable. Feel free to ask if you need details!";
          } else if (query.includes("hello") || query.includes("hi") || query.includes("hey") || query.includes("greetings")) {
            apiResponseText = "Hello! 😊 Welcome to Honeygain.store! I'm your personal AI assistant.\n\nI'll gladly help you learn about the platform, explain how to set up the app, start earning 100% passive income, and how to participate in our monthly $100 giveaway! What would you like to know more about?";
          } else if (query.includes("contest") || query.includes("giveaway") || query.includes("win") || query.includes("prize") || query.includes("100")) {
            apiResponseText = "Hello! 😊 Our monthly $100 Giveaway is held on the 1st of every month at 20:00 UTC!\n\n• **1st Place**: $50.\n• **2nd Place**: $30.\n• **3rd Place**: $20.\n\n**Simple Rules**:\n1. Register via our link (get $3 welcome bonus immediately).\n2. Install Honeygain and keep it active.\n3. Invite 3 friends to double your winning chances!\nResults are published in our Telegram channel!";
          } else {
            apiResponseText = "Hello! 😊 I'm your friendly AI assistant. My job is to help visitors understand Honeygain, answer how to start earning, how the app works, and solve common issues.\n\nAsk me:\n• *How to start earning on Honeygain?*\n• *Is the application safe to use?*\n• *How much can I earn?*\n• *How to withdraw money?*\n• *How to join the $100 contest?*\n\n⚠️ **For Site Owner**: To allow answering any custom questions, configure your Gemini API Key in the settings (gear icon ⚙️ in top right).";
          }
        }
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: apiResponseText,
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
                  {/* Settings gear for API Key */}
                  <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    title={lang === "ru" ? "Настройки ИИ" : "AI Settings"}
                    className={`w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center transition-colors cursor-pointer ${
                      isSettingsOpen ? "text-amber-500 bg-white/5" : "text-amber-500/70 hover:text-amber-500"
                    }`}
                  >
                    <i className="fa-solid fa-gear text-base"></i>
                  </button>
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

              {/* Settings Panel */}
              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="px-5 py-4 border-b text-xs text-left overflow-hidden bg-slate-900/90 backdrop-blur-md"
                    style={{ borderColor: "var(--card-border)" }}
                  >
                    <div className="font-bold text-amber-500 mb-1.5 flex items-center justify-between">
                      <span>⚙️ {lang === "ru" ? "Настройки API Ключа Gemini" : "Gemini API Key Settings"}</span>
                      <button
                        type="button"
                        onClick={() => setIsSettingsOpen(false)}
                        className="text-amber-500 hover:text-amber-400 font-extrabold cursor-pointer"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                    <p className="opacity-80 mb-3 leading-normal" style={{ color: "var(--text-muted)" }}>
                      {lang === "ru"
                        ? "Если ваш сайт работает на статическом хостинге (Netlify/Vercel/GitHub Pages), у вас нет бэкенд-сервера. Чтобы ИИ мог полноценно отвечать на любые свободные вопросы без шаблонов, укажите ваш бесплатный API-ключ Gemini (он сохранится в памяти вашего браузера):"
                        : "If your site is hosted on a static provider (Netlify/Vercel/GitHub Pages), you don't have a backend server. To let the AI answer any custom questions without templates, enter your free Gemini API key (stored safely in your browser):"}
                    </p>
                    <div className="flex space-x-2">
                      <input
                        type="password"
                        value={userApiKey}
                        onChange={(e) => setUserApiKey(e.target.value)}
                        placeholder="AIzaSy..."
                        className="flex-1 px-3 py-2 rounded-xl bg-black/40 border text-white outline-none focus:border-amber-500/80 text-xs font-mono"
                        style={{ borderColor: "var(--card-border)" }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (userApiKey.trim()) {
                            localStorage.setItem("honeygain_gemini_api_key", userApiKey.trim());
                          } else {
                            localStorage.removeItem("honeygain_gemini_api_key");
                          }
                          setIsSettingsOpen(false);
                        }}
                        className="px-3 py-2 rounded-xl honey-gradient text-slate-950 font-bold hover:scale-105 active:scale-95 transition-all text-xs cursor-pointer"
                      >
                        {lang === "ru" ? "Сохранить" : "Save"}
                      </button>
                    </div>
                    <div className="mt-2.5 opacity-65 flex items-center justify-between" style={{ color: "var(--text-muted)" }}>
                      <span>{lang === "ru" ? "Ключ можно получить бесплатно на:" : "Get a free key at:"}</span>
                      <a
                        href="https://aistudio.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-500 underline font-semibold hover:text-amber-400"
                      >
                        Google AI Studio ↗
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
