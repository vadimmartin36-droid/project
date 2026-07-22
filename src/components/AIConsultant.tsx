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
      {/* Interactive Chat Window Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-50 flex items-end justify-end p-0 sm:p-4 pointer-events-none">
            {/* Click outside to close (Only active on mobile screens where it takes full screen overlay) */}
            <div className="fixed inset-0 sm:hidden bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full sm:w-[380px] h-full sm:h-[550px] sm:rounded-3xl border flex flex-col relative pointer-events-auto glass-card overflow-hidden shadow-2xl"
              style={{ 
                backgroundColor: "var(--card-bg)", 
                borderColor: "var(--card-border)",
                boxShadow: "0 25px 50px -12px rgba(246, 176, 38, 0.25)"
              }}
            >
              {/* Glowing decorative top bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-pulse z-20" />
              
              {/* HEADER CONTAINER */}
              <div className="px-5 py-4 border-b flex items-center justify-between relative z-10" style={{ borderColor: "var(--card-border)", backgroundColor: "rgba(0,0,0,0.15)" }}>
                <div className="flex items-center space-x-3 text-left">
                  {/* Status Indicator Avatar */}
                  <div className="relative w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <i className="fa-solid fa-robot text-lg"></i>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2" style={{ borderColor: "var(--card-bg)" }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm" style={{ color: "var(--text-main)" }}>
                      {t.headerTitle}
                    </h3>
                    <p className="text-[10px] text-emerald-400 font-medium">
                      {t.headerSubtitle}
                    </p>
                  </div>
                </div>

                {/* Header Controls (Clear, Settings, Close) */}
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={handleClear}
                    title={t.clearChat}
                    className="w-8 h-8 rounded-xl hover:bg-white/5 flex items-center justify-center transition-all text-[var(--text-muted)] hover:text-red-400 cursor-pointer"
                  >
                    <i className="fa-solid fa-trash-can text-sm"></i>
                  </button>
                  <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    title="Gemini API Settings"
                    className={`w-8 h-8 rounded-xl hover:bg-white/5 flex items-center justify-center transition-all cursor-pointer ${isSettingsOpen ? 'text-amber-500' : 'text-[var(--text-muted)] hover:text-amber-500'}`}
                  >
                    <i className="fa-solid fa-sliders text-sm"></i>
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-xl hover:bg-white/5 flex items-center justify-center transition-all text-amber-500/70 hover:text-amber-500 cursor-pointer"
                  >
                    <i className="fa-solid fa-xmark text-lg"></i>
                  </button>
                </div>
              </div>

              {/* SETTINGS PANELS (Conditional) */}
              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 py-4 border-b text-left text-xs space-y-3 bg-black/25 overflow-hidden z-10"
                    style={{ borderColor: "var(--card-border)" }}
                  >
                    <p className="font-semibold text-honey">⚙️ Gemini API Key Settings</p>
                    <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      {lang === "ru" 
                        ? "Если у вас есть собственный ключ Gemini API, введите его здесь, чтобы разблокировать полноценный свободный диалог без ограничений шаблонов." 
                        : "If you have a custom Gemini API Key, insert it here to unlock 100% free unconstrained conversations."}
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder="AIzaSy..."
                        value={userApiKey}
                        onChange={(e) => {
                          setUserApiKey(e.target.value);
                          localStorage.setItem("honeygain_gemini_api_key", e.target.value);
                        }}
                        className="flex-1 px-3 py-2 rounded-xl bg-black/20 border border-[var(--card-border)] focus:outline-none focus:border-amber-500 text-xs"
                      />
                      {userApiKey && (
                        <button
                          onClick={() => {
                            setUserApiKey("");
                            localStorage.removeItem("honeygain_gemini_api_key");
                          }}
                          className="px-2.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs transition-colors cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* MESSAGES FLOW WINDOW */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col bg-slate-950/20 relative">
                {messages.map((m) => {
                  const isUser = m.role === "user";
                  return (
                    <div
                      key={m.id}
                      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} items-start space-x-2.5 max-w-full`}
                    >
                      {!isUser && (
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0 mt-0.5 shadow-sm">
                          <i className="fa-solid fa-robot text-xs" />
                        </div>
                      )}
                      <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed text-left shadow-sm ${
                            isUser
                              ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                              : 'bg-[var(--header-bg)] rounded-tl-none border border-[var(--card-border)] text-[var(--text-main)]'
                          }`}
                          style={{ whiteSpace: "pre-wrap" }}
                        >
                          {m.content}
                        </div>
                        <span className="text-[9px] mt-1 px-1 opacity-50" style={{ color: "var(--text-muted)" }}>
                          {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {isLoading && (
                  <div className="flex justify-start items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0 shadow-sm animate-pulse">
                      <i className="fa-solid fa-robot text-xs" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-[var(--header-bg)] rounded-tl-none border border-[var(--card-border)] flex items-center space-x-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* QUICK SUGGESTIONS BLOCK */}
              {messages.length <= 2 && !isLoading && (
                <div className="px-4 py-2 bg-slate-950/10 border-t border-[var(--card-border)] flex flex-wrap gap-1.5 justify-start max-h-[100px] overflow-y-auto">
                  {suggestions[lang].map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(s)}
                      className="px-2.5 py-1.5 rounded-xl border bg-[var(--header-bg)] hover:bg-amber-500/5 hover:border-amber-500/50 hover:text-amber-500 text-[10px] text-left transition-all cursor-pointer truncate max-w-[180px]"
                      style={{ borderColor: "var(--card-border)" }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* INPUT CONTAINER */}
              <div className="p-3 border-t bg-[var(--header-bg)] flex items-center gap-2" style={{ borderColor: "var(--card-border)" }}>
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(input);
                    }
                  }}
                  placeholder={t.placeholder}
                  className="flex-1 min-h-[38px] max-h-[80px] resize-none px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-black/15 dark:bg-black/25 border border-[var(--card-border)] focus:outline-none focus:border-amber-500 text-[var(--text-main)] placeholder-[var(--text-muted)] transition-colors leading-relaxed"
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-xl honey-gradient text-slate-950 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 cursor-pointer flex-shrink-0"
                >
                  <i className="fa-solid fa-paper-plane text-sm" />
                </button>
              </div>
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
