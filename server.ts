import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import {
  initializeDatabase,
  getUsers,
  findUserByUsernameOrEmail,
  findUserByToken,
  findUserById,
  createUser,
  updateUserToken,
  updateUserBalance,
  updateUserPassword,
  getSpins,
  findRecentSpin,
  addSpin,
  isD1Configured
} from "./src/database";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.set("trust proxy", true);
  app.use(express.json());

  // Initialize DB (D1 or Local File fallback)
  await initializeDatabase();

  // Simple hashing function for password protection
  function hashPassword(pwd: string): string {
    let hash = 0;
    for (let i = 0; i < pwd.length; i++) {
      hash = (hash << 5) - hash + pwd.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return "hash_" + hash.toString(16);
  }

  const PRIZE_PROBABILITIES = [15, 25, 15, 20, 5, 10, 5, 5]; // Matches PRIZES indexes in frontend

  function getWeightedPrizeIndex(): number {
    const totalWeight = PRIZE_PROBABILITIES.reduce((sum, w) => sum + w, 0);
    let randomNum = Math.random() * totalWeight;
    for (let i = 0; i < PRIZE_PROBABILITIES.length; i++) {
      if (randomNum < PRIZE_PROBABILITIES[i]) {
        return i;
      }
      randomNum -= PRIZE_PROBABILITIES[i];
    }
    return 0; // Fallback
  }

  function isPublicIp(ip: string): boolean {
    if (!ip) return false;
    let cleanIp = ip.replace(/^::ffff:/i, "").trim();
    if (cleanIp === "127.0.0.1" || cleanIp === "::1" || cleanIp === "localhost" || cleanIp === "") {
      return false;
    }
    if (cleanIp.startsWith("10.") || cleanIp.startsWith("192.168.")) {
      return false;
    }
    if (cleanIp.startsWith("172.")) {
      const parts = cleanIp.split(".");
      if (parts.length >= 2) {
        const second = parseInt(parts[1], 10);
        if (second >= 16 && second <= 31) return false;
      }
    }
    if (cleanIp.startsWith("fe80:") || cleanIp.startsWith("fc00:") || cleanIp.startsWith("fd00:")) {
      return false;
    }
    return true;
  }

  function getClientIp(req: express.Request): string {
    const headersToCheck = [
      "x-forwarded-for",
      "x-real-ip",
      "cf-connecting-ip",
      "true-client-ip",
      "x-client-ip"
    ];

    for (const header of headersToCheck) {
      const val = req.headers[header];
      if (val) {
        if (typeof val === "string") {
          const parts = val.split(",");
          for (const part of parts) {
            const trimmed = part.trim();
            if (trimmed && isPublicIp(trimmed)) {
              return trimmed;
            }
          }
        } else if (Array.isArray(val) && val.length > 0) {
          const trimmed = val[0].trim();
          if (trimmed && isPublicIp(trimmed)) {
            return trimmed;
          }
        }
      }
    }

    const directIp = req.ip || req.socket.remoteAddress || "";
    return directIp.replace(/^::ffff:/i, "").trim();
  }

  // --- AUTHENTICATION ENDPOINTS ---

  // Register Endpoint
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ error: "Все поля обязательны для заполнения" });
      }

      const cleanUsername = username.trim();
      const cleanEmail = email.trim().toLowerCase();

      // Email format validation
      if (!cleanEmail.includes("@") || cleanEmail.length < 5) {
        return res.status(400).json({ error: "Некорректный формат email" });
      }

      if (cleanUsername.length < 3) {
        return res.status(400).json({ error: "Имя пользователя должно быть не менее 3 символов" });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "Пароль должен быть не менее 6 символов" });
      }

      // Check if username or email already exists
      const existingUser = await findUserByUsernameOrEmail(cleanUsername);
      if (existingUser) {
        return res.status(400).json({ error: "Это имя пользователя уже занято" });
      }

      const existingEmail = await findUserByUsernameOrEmail(cleanEmail);
      if (existingEmail) {
        return res.status(400).json({ error: "Этот адрес электронной почты уже зарегистрирован" });
      }

      // Create new user with standard Honeygain starting bonus ($3)
      const userId = "usr_" + Math.random().toString(36).substring(2, 11);
      const token = "tok_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const newUser = {
        id: userId,
        username: cleanUsername,
        email: cleanEmail,
        passwordHash: hashPassword(password),
        registeredAt: Date.now(),
        balance: 3.00, // Starts with a super nice $3 starting bonus!
        token
      };

      await createUser(newUser);

      // Return user data without sensitive passwordHash
      const { passwordHash: _, ...userResponse } = newUser;
      return res.json({ success: true, user: userResponse });
    } catch (err) {
      console.error("Error during registration:", err);
      res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
  });

  // Login Endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { loginIdentifier, password } = req.body; // loginIdentifier can be username or email
      if (!loginIdentifier || !password) {
        return res.status(400).json({ error: "Пожалуйста, введите логин и пароль" });
      }

      const cleanIdentifier = loginIdentifier.trim();
      const user = await findUserByUsernameOrEmail(cleanIdentifier);

      if (!user) {
        return res.status(400).json({ error: "Пользователь с таким именем или email не найден" });
      }

      const incomingHash = hashPassword(password);
      if (user.passwordHash !== incomingHash) {
        return res.status(400).json({ error: "Неверный пароль" });
      }

      // Generate a new token upon fresh login to ensure freshness
      const newToken = "tok_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      await updateUserToken(user.id, newToken);
      user.token = newToken;

      const { passwordHash: _, ...userResponse } = user;
      return res.json({ success: true, user: userResponse });
    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
  });

  // Forgot Password Endpoint
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Пожалуйста, введите ваш email" });
      }

      const cleanEmail = email.trim().toLowerCase();
      const user = await findUserByUsernameOrEmail(cleanEmail);

      if (!user) {
        return res.status(404).json({ error: "Пользователь с таким адресом электронной почты не найден" });
      }

      // Generate a temporary password '123456' for convenience in demo testing, hash it, and save it
      const tempPass = "123456";
      const newHash = hashPassword(tempPass);
      await updateUserPassword(user.id, newHash);

      return res.json({ 
        success: true, 
        message: "Ссылка для восстановления отправлена на ваш e-mail! В демонстрационном режиме мы также сбросили ваш пароль на '123456' для быстрого входа." 
      });
    } catch (err) {
      console.error("Error in forgot-password:", err);
      res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
  });

  // Session Me Check Endpoint
  app.post("/api/auth/me", async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(401).json({ error: "Не авторизован" });
      }

      const user = await findUserByToken(token);
      if (!user) {
        return res.status(401).json({ error: "Невалидный сессионный токен" });
      }

      const { passwordHash: _, ...userResponse } = user;
      return res.json({ success: true, user: userResponse });
    } catch (err) {
      console.error("Error verifying token:", err);
      res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
  });

  // GET or POST Route to check wheel status (using POST to securely accept fingerprint and optional auth token)
  app.post("/api/wheel-status", async (req, res) => {
    try {
      const { fingerprint, token } = req.body;
      const ip = getClientIp(req);

      // Resolve user if token is provided
      let userId: string | undefined = undefined;
      if (token) {
        const matchedUser = await findUserByToken(token);
        if (matchedUser) {
          userId = matchedUser.id;
        }
      }

      // Find if this IP (only if public), Fingerprint, or User has already spun in the last 24 hours
      const record = await findRecentSpin(ip, fingerprint || "", userId);

      if (record) {
        const cooldownPeriod = 24 * 60 * 60 * 1000;
        const remainingMs = cooldownPeriod - (Date.now() - record.timestamp);
        return res.json({ cooldownSeconds: Math.max(0, Math.ceil(remainingMs / 1000)) });
      }

      return res.json({ cooldownSeconds: 0 });
    } catch (error) {
      console.error("Error checking wheel status:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // POST Route to execute spin
  app.post("/api/wheel-spin", async (req, res) => {
    try {
      const { fingerprint, token } = req.body;
      if (!fingerprint) {
        return res.status(400).json({ error: "Fingerprint is required" });
      }

      const ip = getClientIp(req);
      const now = Date.now();
      const cooldownPeriod = 24 * 60 * 60 * 1000;

      // Resolve user if token is provided
      let activeUser = null;
      if (token) {
        activeUser = await findUserByToken(token);
      }

      // Verify cooldown one more time across IP, Fingerprint, and User ID
      const record = await findRecentSpin(ip, fingerprint, activeUser ? activeUser.id : undefined);

      if (record) {
        const remainingMs = cooldownPeriod - (now - record.timestamp);
        return res.status(400).json({ 
          error: "Cooldown active", 
          cooldownSeconds: Math.max(0, Math.ceil(remainingMs / 1000)) 
        });
      }

      // Roll secure prize index on server
      const selectedIndex = getWeightedPrizeIndex();

      // Register spin on server
      await addSpin({
        ip,
        fingerprint,
        userId: activeUser ? activeUser.id : undefined,
        timestamp: now
      });

      // Dynamic immersive update: if logged in, we add actual prize to their profile balance!
      if (activeUser) {
        let prizeAdded = 0;
        if (selectedIndex === 0) prizeAdded = 1.00;
        else if (selectedIndex === 1) prizeAdded = 0.50;
        else if (selectedIndex === 2) prizeAdded = 1.50;
        else if (selectedIndex === 4) prizeAdded = 5.00;
        else if (selectedIndex === 5) prizeAdded = 0.20;

        if (prizeAdded > 0) {
          const newBalance = parseFloat((activeUser.balance + prizeAdded).toFixed(2));
          await updateUserBalance(activeUser.id, newBalance);
          activeUser.balance = newBalance;
        }
      }

      return res.json({ 
        success: true, 
        prizeIndex: selectedIndex,
        newBalance: activeUser ? activeUser.balance : undefined
      });
    } catch (error) {
      console.error("Error executing spin:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // API Route for chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages array" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Smart Local Responder Fallback (Ensures excellent, correct answers during local/preview tests without API key)
        const lastUserMessageObj = [...messages].reverse().find(m => m.role === "user");
        const userQuery = (lastUserMessageObj?.content || "").toLowerCase().trim();

        let responseText = "";

        if (userQuery.includes("начать") || userQuery.includes("как заработать") || userQuery.includes("как начать") || userQuery.includes("старт") || userQuery.includes("регистрац")) {
          responseText = "Привет! 😊 Чтобы начать зарабатывать в Honeygain, выполните три простых шага:\n\n1. **Зарегистрируйтесь** по реферальной ссылке на нашем сайте (вы сразу получите приветственный бонус **$3** на ваш баланс!).\n2. **Скачайте и установите** официальное приложение Honeygain на любое ваше устройство (поддерживаются Windows, macOS, Linux, Android и iOS).\n3. **Запустите приложение** и войдите в свой аккаунт. Оно будет безопасно работать в фоновом режиме, делясь неиспользуемым интернетом и принося вам полностью пассивный доход!\n\nЕсли у вас возникнут сложности, я всегда готов подсказать!";
        } else if (userQuery.includes("безопасн") || userQuery.includes("вирус") || userQuery.includes("данн") || userQuery.includes("слеж") || userQuery.includes("вред")) {
          responseText = "Привет! 😊 Да, приложение Honeygain абсолютно безопасно!\n\n• Оно использует только неиспользуемую часть вашего интернет-трафика для задач контентной доставки и маркетинговых исследований проверенных компаний.\n• У приложения **нет доступа** к вашим личным файлам, контактам, фотографиям, банковским картам или персональным данным.\n• Все соединения шифруются, приложение не замедляет работу устройства и не содержит вирусов.\n\nВы можете использовать его с полной уверенностью в безопасности вашей конфиденциальности!";
        } else if (userQuery.includes("сколько") || userQuery.includes("доход") || userQuery.includes("заработок") || userQuery.includes("прибыль") || userQuery.includes("деньг")) {
          responseText = "Привет! 😊 Ваш заработок зависит от нескольких важных факторов:\n\n• **Объема трафика**, которым вы делитесь (зависит от скорости интернета).\n• **Количества устройств** (можно подключить по 1 устройству на каждый уникальный IP-адрес).\n• **Вашего региона** (в некоторых странах спрос на трафик выше).\n\nВ среднем пользователи зарабатывают от **$10 до $30 в месяц** полностью пассивно. Чтобы увеличить доход, вы можете участвовать в нашем ежемесячном конкурсе на **$100** и приглашать друзей — вы будете пожизненно получать **25%** от их ежедневного заработка!";
        } else if (userQuery.includes("вывести") || userQuery.includes("вывод") || userQuery.includes("выплат") || userQuery.includes("paypal") || userQuery.includes("крипт") || userQuery.includes("jmpt")) {
          responseText = "Привет! 😊 Вывести заработанные средства можно очень просто и удобно при достижении минимального порога выплат:\n\n1. **PayPal** — классический вывод фиатных денег прямо на ваш кошелек.\n2. **JumpTask (JMPT)** — вывод в криптовалюте без минимального порога и практически без комиссий в любое время!\n\nСервис выплачивает средства стабильно и честно. Если у вас возникнут вопросы по конкретной выплате, наша поддержка всегда поможет разобраться.";
        } else if (userQuery.includes("привет") || userQuery.includes("здравствуй") || userQuery.includes("здравствуйте") || userQuery.includes("добрый день") || userQuery.includes("добрый вечер") || userQuery.includes("ку")) {
          responseText = "Привет! 😊 Рад приветствовать вас на Honeygain.store! Я ваш личный AI-помощник.\n\nЯ с удовольствием помогу вам разобраться в сервисе, расскажу, как установить приложение, начать получать полностью пассивный доход и как принять участие в нашем ежемесячном конкурсе на $100! О чем рассказать подробнее?";
        } else {
          responseText = "Привет! 😊 Я ваш дружелюбный AI-консультант. Моя задача — помогать посетителям разобраться в сервисе, отвечать на вопросы о том, как начать зарабатывать, как работает приложение, и помогать решать типичные проблемы.\n\nВы можете спросить меня:\n• *Как начать зарабатывать на Honeygain?*\n• *Безопасно ли использовать приложение?*\n• *Сколько можно заработать?*\n• *Как вывести деньги?*\n\nЕсли у вас сложный вопрос, требующий проверки аккаунта, вы всегда можете написать в официальную службу поддержки или нашему администратору в Telegram!";
        }

        return res.status(200).json({ text: responseText });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Map roles correctly
      const contents = messages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));

      const systemInstruction = `Ты — дружелюбный и профессиональный AI-консультант на русском языке на сайте honeygain.store. 

Твоя задача — помогать посетителям разобраться в сервисе Honeygain, отвечать на вопросы о том, как начать зарабатывать, как работает приложение, и помогать решать типичные проблемы.

ПРАВИЛА ДЛЯ АССИСТЕНТА:
1. Всегда начинай диалог с дружелюбного приветствия и предложения помощи.
2. Отвечай кратко, ясно и по делу на русском языке. Избегай слишком длинных текстов, разбивай информацию на небольшие абзацы или списки для легкости чтения.
3. Если вопрос сложный, специфический, требует доступа к личному кабинету пользователя или касается технических сбоев выплат, вежливо предложи пользователю обратиться в официальную службу поддержки Honeygain на их официальном сайте или написать нашему администратору Вадиму Мартину в Telegram (ссылка есть в подвале нашего сайта).
4. Общайся исключительно в вежливом, позитивном и теплом тоне.

КЛЮЧЕВЫЕ ЗНАНИЯ О HONEYGAIN И САЙТЕ HONEYGAIN.STORE:
- Наш сайт honeygain.store — это независимый информационный и партнерский (реферальный) ресурс.
- Приложение Honeygain позволяет зарабатывать пассивный доход, делясь своим неиспользуемым интернет-трафиком. Трафик используется проверенными компаниями для исследований рынка, проверки рекламы и SEO-мониторинга. Это абсолютно безопасно: у приложения нет доступа к вашим личным файлам, контактам, банковским картам или персональным данным.
- Стартовый бонус: при регистрации по нашей партнерской ссылке (кнопки на сайте) каждый новый пользователь мгновенно получает гарантированный бонус $3 на свой баланс бесплатно!
- Как начать зарабатывать:
  1. Зарегистрироваться по ссылке на нашем сайте (получить $3 сразу).
  2. Скачать и установить приложение Honeygain (поддерживаются Windows, macOS, Linux, Android, iOS).
  3. Запустить приложение и оставить его работать в фоновом режиме, пока устройство подключено к Интернету.
- Выплаты: Можно выводить средства через PayPal или в криптовалюте JumpTask (JMPT) в любое время при достижении порога.
- Реферальная система: 25% пожизненный бонус от ежедневного заработка приглашенных друзей.
- Ежемесячный Мега-Конкурс: Проводится на нашем сайте. Призовой фонд $100 каждый месяц ($50 за 1-е место, $30 за 2-е, $20 за 3-е). Розыгрыш проходит 1-го числа каждого месяца в 20:00 UTC, результаты публикуются в нашем официальном Telegram-канале @vadimmartin. Для участия достаточно зарегистрироваться по нашей ссылке, установить приложение и быть активным (приглашение 3 друзей удваивает шансы!).
- Совместимость: работает на ПК (Windows, Mac, Linux), Android-смартфонах и iOS-устройствах (iPhone/iPad). Максимум 1 активное устройство на один IP-адрес. Можно подключить больше устройств, если у них разные IP-адреса.

Пожалуйста, всегда отвечай строго в соответствии с этими правилами, тепло, лаконично и профессионально.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Внутренняя ошибка сервера при общении с ИИ" });
    }
  });

  // Explicit routes for SPA pages to ensure they are matched and served correctly on the server
  const spaPages = [
    '/o-proekte', 
    '/o-proekte/', 
    '/baza-znanij', 
    '/baza-znanij/', 
    '/about', 
    '/about/'
  ];

  app.get(spaPages, async (req, res, next) => {
    if (process.env.NODE_ENV !== "production") {
      // In development, let Vite middleware handle it (passed via next)
      return next();
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      return res.sendFile(path.join(distPath, 'index.html'));
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Explicit catch-all SPA routing in development mode as well
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api') || (url.includes('.') && !url.endsWith('.html'))) {
        return next();
      }
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
