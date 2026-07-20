import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LuckyWheelProps {
  lang: "ru" | "en";
  theme: "light" | "dark";
  referralLink: string;
  t: any;
  user: any | null;
  onBalanceUpdate: (newBalance: number) => void;
  onOpenAuth: () => void;
}

interface Prize {
  id: number;
  textRu: string;
  textEn: string;
  descRu: string;
  descEn: string;
  icon: string;
  color: string;
  textColor: string;
  probability: number; // Weighted probability
}

const PRIZES: Prize[] = [
  {
    id: 0,
    textRu: "+$3 Старт-Бонус",
    textEn: "+$3 Welcome Bonus",
    descRu: "Гарантированный денежный бонус на ваш баланс сразу при регистрации по нашей партнерской ссылке!",
    descEn: "Guaranteed cash bonus added to your balance immediately after registering through our affiliate link!",
    icon: "fa-solid fa-dollar-sign",
    color: "#f6b026", // Golden honey
    textColor: "#0f172a", // slate-900
    probability: 15,
  },
  {
    id: 1,
    textRu: "+$1 Бонус-Кэш",
    textEn: "+$1 Bonus Cash",
    descRu: "Дополнительный доллар на ваш баланс, который вы получите сверху стандартного приветственного подарка!",
    descEn: "An extra dollar on your balance that you will receive on top of the standard welcome gift!",
    icon: "fa-solid fa-sack-dollar",
    color: "#fca5a5", // red-300
    textColor: "#0f172a",
    probability: 25,
  },
  {
    id: 2,
    textRu: "+25% Реф-Буст",
    textEn: "+25% Ref Boost",
    descRu: "Максимальный партнерский процент! Вы будете получать пожизненно 25% от заработка каждого приглашенного друга.",
    descEn: "Maximum affiliate share! You will earn a lifetime 25% share of the daily earnings of every friend you invite.",
    icon: "fa-solid fa-chart-line",
    color: "#fb923c", // orange-400
    textColor: "#0f172a",
    probability: 15,
  },
  {
    id: 3,
    textRu: "Билет на Конкурс",
    textEn: "Contest Entry Ticket",
    descRu: "Бесплатный VIP-билет на наш Мега-Розыгрыш $100! Ваши шансы выиграть главный приз удваиваются автоматически.",
    descEn: "A free VIP ticket to our $100 Mega Giveaway! Your chances to win the main prize double automatically.",
    icon: "fa-solid fa-ticket",
    color: "#f472b6", // pink-400
    textColor: "#0f172a",
    probability: 20,
  },
  {
    id: 4,
    textRu: "+$5 Премиум Бонус",
    textEn: "+$5 Premium Bonus",
    descRu: "Супер-редкий супер-приз! Максимальный стартовый бонус $5 на ваш баланс Honeygain. Начните зарабатывать на максимальной скорости!",
    descEn: "Super rare grand prize! The absolute maximum start bonus of $5 on your Honeygain balance. Start earning at maximum speed!",
    icon: "fa-solid fa-crown",
    color: "#a78bfa", // purple-400
    textColor: "#0f172a",
    probability: 5,
  },
  {
    id: 5,
    textRu: "+$2 Кэш-Подарок",
    textEn: "+$2 Cash Gift",
    descRu: "Приятный денежный буст $2 на ваш новый аккаунт при запуске фонового режима Honeygain на ПК или смартфоне.",
    descEn: "A sweet $2 cash boost to your new account when launching Honeygain in the background on your PC or smartphone.",
    icon: "fa-solid fa-gift",
    color: "#38bdf8", // sky-400
    textColor: "#0f172a",
    probability: 10,
  },
  {
    id: 6,
    textRu: "+10% Реф-Бонус",
    textEn: "+10% Ref Share",
    descRu: "Увеличенный процент прибыли от активности ваших друзей. Приглашайте больше участников и получайте пассивный доход в команде!",
    descEn: "Increased profit rate from your friends' activity. Invite more active members and enjoy passive income together!",
    icon: "fa-solid fa-users",
    color: "#34d399", // emerald-400
    textColor: "#0f172a",
    probability: 5,
  },
  {
    id: 7,
    textRu: "VIP Билет x2",
    textEn: "Contest Ticket x2",
    descRu: "Двойной счастливый купон на ежемесячный розыгрыш $100! Ваше имя вносится в списки претендентов дважды.",
    descEn: "Double lucky coupon for our monthly $100 prize draw! Your name enters the participant lists twice.",
    icon: "fa-solid fa-star",
    color: "#fbbf24", // amber-400
    textColor: "#0f172a",
    probability: 5,
  },
];

// Robust Browser Fingerprinting Function (Canvas, WebGL, User-Agent, Hardware parameters)
async function generateBrowserFingerprint(): Promise<string> {
  const parts = [
    navigator.userAgent || "",
    navigator.language || "",
    screen.colorDepth || "",
    screen.width + "x" + screen.height,
    new Date().getTimezoneOffset(),
    navigator.platform || "",
    navigator.hardwareConcurrency || "",
    (navigator as any).deviceMemory || ""
  ];

  // Canvas Fingerprinting
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      canvas.width = 200;
      canvas.height = 50;
      ctx.textBaseline = "top";
      ctx.font = "14px 'Arial'";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("LuckyWheel,?!", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText("LuckyWheel,?!", 4, 17);
      parts.push(canvas.toDataURL());
    }
  } catch (e) {
    // Canvas fingerprinting failed/blocked
  }

  // WebGL Fingerprinting
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as any;
    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        parts.push(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
        parts.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
      }
    }
  } catch (e) {
    // WebGL fingerprinting failed/blocked
  }

  const rawString = parts.join("|||");
  
  try {
    const msgUint8 = new TextEncoder().encode(rawString);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  } catch (err) {
    // Fallback simple hash
    let hash = 5381;
    for (let i = 0; i < rawString.length; i++) {
      hash = (hash * 33) ^ rawString.charCodeAt(i);
    }
    return (hash >>> 0).toString(16);
  }
}

export function LuckyWheel({ lang, theme, referralLink, t, user, onBalanceUpdate, onOpenAuth }: LuckyWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prizeIndex, setPrizeIndex] = useState<number | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [fingerprint, setFingerprint] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Audio state
  const [audioFeedback, setAudioFeedback] = useState(true);

  // Initialize fingerprint and check server-side spin limit on load
  useEffect(() => {
    let active = true;

    // Quick client-side check from local storage to prevent rendering flash
    const lastSpin = localStorage.getItem("honeygain_last_spin");
    if (lastSpin) {
      const lastSpinTime = parseInt(lastSpin, 10);
      const now = Date.now();
      const difference = now - lastSpinTime;
      const cooldownPeriod = 24 * 60 * 60 * 1000;
      if (difference < cooldownPeriod) {
        setCooldownSeconds(Math.ceil((cooldownPeriod - difference) / 1000));
      }
    }

    const initFingerprint = async () => {
      try {
        const fp = await generateBrowserFingerprint();
        if (!active) return;
        setFingerprint(fp);

        // Fetch server-side status (with user token if available)
        const response = await fetch("/api/wheel-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fingerprint: fp, token: user?.token })
        });
        if (response.ok) {
          const data = await response.json();
          if (active && data.cooldownSeconds !== undefined) {
            setCooldownSeconds(data.cooldownSeconds);
          }
        }
      } catch (err) {
        console.error("Error fetching status:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    initFingerprint();

    return () => {
      active = false;
    };
  }, [user]);

  // Active countdown timer interval
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const interval = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownSeconds]);

  // Format Cooldown Time
  const formatCooldown = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleSpin = async () => {
    if (isSpinning) return;
    if (cooldownSeconds > 0 && !isDemoMode) return;

    setIsSpinning(true);
    setErrorMessage("");

    try {
      // Send secure spin request to server (include token if available)
      const response = await fetch("/api/wheel-spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fingerprint, token: user?.token })
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.cooldownSeconds) {
          setCooldownSeconds(data.cooldownSeconds);
          localStorage.setItem("honeygain_last_spin", (Date.now() - (24 * 60 * 60 * 1000 - data.cooldownSeconds * 1000)).toString());
        }
        setIsSpinning(false);
        setErrorMessage(data.error || "Ошибка вращения");
        return;
      }

      const data = await response.json();
      const selectedIndex = data.prizeIndex;

      setPrizeIndex(selectedIndex);

      // If user has a new balance, update it
      if (data.newBalance !== undefined) {
        onBalanceUpdate(data.newBalance);
      }

      // Number of complete spins + landing segment positioning
      const spinsCount = 6 + Math.floor(Math.random() * 3); // 6 to 8 full spins
      const segmentAngle = 360 / 8;
      
      // Rotation calculations (SVG starts at 0, 12 o'clock pointer)
      const targetDegrees = (spinsCount * 360) + (360 - (selectedIndex * segmentAngle) - segmentAngle / 2);
      
      // Apply animation rotation
      setRotation(targetDegrees);

      // Store locally as a caching layer
      localStorage.setItem("honeygain_last_spin", Date.now().toString());
      setCooldownSeconds(24 * 60 * 60); // 24 hours

      // Tick audio sound waves or click visual indicator
      let ticksPlayed = 0;
      const ticksCount = 40;
      const tickInterval = setInterval(() => {
        ticksPlayed++;
        if (ticksPlayed >= ticksCount) {
          clearInterval(tickInterval);
        }
      }, 120);

      // Complete spin action
      setTimeout(() => {
        setIsSpinning(false);
        setShowResultModal(true);
      }, 5500); // Wait for transition duration (5s) + minor delay

    } catch (err) {
      console.error("Error during spin:", err);
      setErrorMessage(lang === "ru" ? "Ошибка подключения. Попробуйте позже." : "Connection error. Please try again later.");
      setIsSpinning(false);
    }
  };

  // Reset wheel state to allow spin again
  const handleResetForDemo = () => {
    setRotation(0);
    setPrizeIndex(null);
    setShowResultModal(false);
    setIsSpinning(false);
  };

  const currentPrizeObj = prizeIndex !== null ? PRIZES[prizeIndex] : null;

  if (!user) {
    return null;
  }

  return (
    <section id="wheel" className="py-24 sm:py-32 relative overflow-hidden border-t border-b scroll-mt-20" style={{ borderColor: "var(--card-border)" }}>
      {/* Dynamic Background Glowing Blobs */}
      <div className="absolute top-1/4 left-10 w-80 h-80 rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-orange-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header Block */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-semibold tracking-wider uppercase mb-4 border border-amber-500/20">
            <i className="fa-solid fa-circle-notch animate-spin text-xs"></i>
            <span style={{ fontFamily: "Georgia" }}>{t.wheelBadge}</span>
          </span>
          <h2 className="font-bold tracking-tight mb-4 serif-title italic" style={{ color: "var(--text-main)", fontSize: "36px", lineHeight: "40px" }}>
            {t.wheelTitle}
          </h2>
          <p className="text-base sm:text-lg font-light max-w-[800px] mx-auto leading-relaxed" style={{ color: "var(--text-muted)", fontFamily: "Georgia" }}>
            {t.wheelSubtitle}
          </p>
        </div>

        {/* Core Layout: Bento Style Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-5xl mx-auto">
          
          {/* Left Column: Interactive Spin Canvas (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
            <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] flex items-center justify-center select-none">
              
              {/* Outer Golden Ring / Border Decor */}
              <div 
                className="absolute inset-0 rounded-full border-8 border-amber-500/30 flex items-center justify-center p-3 sm:p-4 bg-slate-950/40 backdrop-blur-sm"
                style={{
                  boxShadow: "0 0 40px rgba(246, 176, 38, 0.15), inset 0 0 30px rgba(246, 176, 38, 0.05)",
                  borderColor: "rgba(246, 176, 38, 0.25)"
                }}
              >
                {/* Blinking Dot Lights on Outer Border */}
                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                  {[...Array(16)].map((_, idx) => {
                    const angleDeg = (idx * 360) / 16;
                    return (
                      <div
                        key={idx}
                        className={`absolute w-1.5 h-1.5 rounded-full bg-amber-400`}
                        style={{
                          left: `calc(50% + ${Math.cos((angleDeg * Math.PI) / 180) * 48}% - 3px)`,
                          top: `calc(50% + ${Math.sin((angleDeg * Math.PI) / 180) * 48}% - 3px)`,
                          boxShadow: "0 0 8px #f59e0b",
                          animation: `pulse-glow 1.5s infinite`,
                          animationDelay: `${idx * 100}ms`
                        }}
                      />
                    );
                  })}
                </div>

                {/* The Rotating Wheel Body */}
                <div 
                  className="w-full h-full rounded-full relative overflow-hidden transition-transform ease-out"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transitionDuration: isSpinning ? "5000ms" : "0ms",
                    transitionTimingFunction: "cubic-bezier(0.15, 0.85, 0.15, 1)"
                  }}
                >
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Define gradients for premium segments */}
                    <defs>
                      {PRIZES.map((p) => (
                        <radialGradient id={`grad-${p.id}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%" key={p.id}>
                          <stop offset="0%" stopColor={`${p.color}22`} />
                          <stop offset="100%" stopColor={p.color} />
                        </radialGradient>
                      ))}
                      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000" floodOpacity="0.4" />
                      </filter>
                    </defs>

                    <g transform="translate(100, 100)">
                      {PRIZES.map((p, idx) => {
                        const startAngleDeg = (idx * 360) / 8 - 90;
                        const endAngleDeg = ((idx + 1) * 360) / 8 - 90;
                        const startAngleRad = (startAngleDeg * Math.PI) / 180;
                        const endAngleRad = (endAngleDeg * Math.PI) / 180;
                        
                        const x1 = Math.cos(startAngleRad) * 92;
                        const y1 = Math.sin(startAngleRad) * 92;
                        const x2 = Math.cos(endAngleRad) * 92;
                        const y2 = Math.sin(endAngleRad) * 92;
                        
                        // Sliced sector path
                        const pathData = `M 0 0 L ${x1} ${y1} A 92 92 0 0 1 ${x2} ${y2} Z`;

                        // Midpoint for text layout alignment
                        const midAngleDeg = startAngleDeg + 180 / 8;
                        const midAngleRad = (midAngleDeg * Math.PI) / 180;
                        const textX = Math.cos(midAngleRad) * 56;
                        const textY = Math.sin(midAngleRad) * 56;

                        // Alternating dark/light segment borders for luxury style
                        const borderStroke = "var(--card-border)";

                        return (
                          <g key={p.id}>
                            {/* Slice */}
                            <path
                              d={pathData}
                              fill={`url(#grad-${p.id})`}
                              stroke={borderStroke}
                              strokeWidth="0.6"
                            />
                            
                            {/* Inner icon/text group */}
                            <g transform={`translate(${textX}, ${textY}) rotate(${midAngleDeg + 90})`}>
                              <text
                                textAnchor="middle"
                                alignmentBaseline="middle"
                                fill="#ffffff"
                                fontSize="5.5"
                                fontWeight="800"
                                fontFamily="system-ui, sans-serif"
                                filter="url(#shadow)"
                                style={{ letterSpacing: "-0.1px" }}
                              >
                                {lang === "ru" ? p.textRu : p.textEn}
                              </text>
                            </g>
                          </g>
                        );
                      })}
                    </g>
                  </svg>
                </div>
              </div>

              {/* Top Selector Pin Indicator */}
              <div className="absolute top-[-5px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                <div 
                  className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-amber-500 drop-shadow-lg"
                  style={{ filter: "drop-shadow(0 4px 6px rgba(246,176,38,0.4))" }}
                />
                <div className="w-3 h-3 rounded-full bg-slate-950 border-2 border-amber-500 -mt-1.5" />
              </div>

              {/* Absolute Center Spinning Pin Button */}
              <button
                onClick={handleSpin}
                disabled={isSpinning || (cooldownSeconds > 0 && !isDemoMode)}
                className={`absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full z-20 flex flex-col items-center justify-center transition-all cursor-pointer select-none border-4 outline-none ${
                  isSpinning 
                    ? "opacity-90 scale-95 border-amber-500/40 bg-slate-900" 
                    : cooldownSeconds > 0 && !isDemoMode
                      ? "border-slate-800 bg-slate-900 text-slate-500"
                      : "border-[#f6b026] bg-slate-950 text-amber-500 hover:scale-105 hover:shadow-amber-500/20 hover:border-amber-400 active:scale-95"
                }`}
                style={{
                  boxShadow: isSpinning || (cooldownSeconds > 0 && !isDemoMode)
                    ? "0 0 10px rgba(0,0,0,0.5)"
                    : "0 10px 25px -5px rgba(246, 176, 38, 0.25), inset 0 2px 4px rgba(255,255,255,0.15)",
                  fontFamily: "Georgia, serif"
                }}
              >
                {/* Center Core Logo/Text */}
                <div className="relative flex flex-col items-center">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-bold font-sans">
                    {isSpinning ? (
                      <i className="fa-solid fa-rotate animate-spin text-lg text-honey"></i>
                    ) : (
                      lang === "ru" ? "СТАРТ" : "SPIN"
                    )}
                  </span>
                  {!isSpinning && (
                    <span className="text-[8px] opacity-70 font-semibold uppercase mt-0.5 tracking-tighter">
                      {cooldownSeconds > 0 && !isDemoMode ? "🔒" : "🍯"}
                    </span>
                  )}
                </div>
              </button>
            </div>
            
            {/* Real-time server-side block warning / error messages */}
            {errorMessage && (
              <div className="mt-4 px-4 py-2.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center max-w-[320px] shadow-lg shadow-red-500/5" style={{ fontFamily: "Georgia" }}>
                <i className="fa-solid fa-triangle-exclamation mr-1.5 text-red-500"></i>
                {errorMessage === "Cooldown active" 
                  ? (lang === "ru" ? "Вы уже участвовали! 1 спин в 24 часа для одного устройства/IP." : "You have already participated! 1 spin per 24h per device/IP.")
                  : errorMessage
                }
              </div>
            )}
          </div>

          {/* Right Column: Game Info & Statistics (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-amber-500/5 blur-xl pointer-events-none" />
              
              <h3 className="text-xl font-bold mb-4 text-honey serif-title italic">
                {lang === "ru" ? "Как работает рулетка?" : "How the Wheel Works?"}
              </h3>
              
              <p className="text-xs sm:text-sm leading-relaxed mb-5 font-light" style={{ color: "var(--text-muted)", fontFamily: "Georgia" }}>
                {lang === "ru"
                  ? "Мы разработали систему поощрения активных участников! Каждый день вы получаете одно бесплатное вращение рулетки, чтобы гарантированно получить один из наших эксклюзивных подарков."
                  : "We designed a rewarding system for active members! Every single day you get one completely free wheel spin to win one of our exclusive honey gifts on your account."}
              </p>

              {/* Dynamic Status panel */}
              <div className="border-t border-amber-500/10 pt-5 space-y-4">
                
                {/* Free Spin Cooldown Indicator */}
                {cooldownSeconds > 0 ? (
                  <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                    <div className="text-xs font-semibold uppercase tracking-wider mb-2 text-amber-500/80" style={{ fontFamily: "Georgia" }}>
                      {lang === "ru" ? "Бесплатный спин заблокирован:" : "Free spin cooldown active:"}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-mono font-bold text-honey tracking-wider">
                        {formatCooldown(cooldownSeconds)}
                      </div>
                      <div className="text-[10px] bg-slate-900 px-2.5 py-1 rounded-lg text-amber-500/70 font-bold border border-amber-500/10 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                        <span>{lang === "ru" ? "ОЖИДАНИЕ" : "COOLDOWN"}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider mb-1 text-emerald-400" style={{ fontFamily: "Georgia" }}>
                        {lang === "ru" ? "Статус спина:" : "Spin status:"}
                      </div>
                      <div className="text-sm font-bold text-white">
                        {lang === "ru" ? "Вращение доступно!" : "Free spin available!"}
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 animate-pulse">
                      <i className="fa-solid fa-circle-check text-lg"></i>
                    </div>
                  </div>
                )}

                {/* Auth-specific feedback directly on the wheel card */}
                {user ? (
                  <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider mb-1 text-amber-500" style={{ fontFamily: "Georgia" }}>
                        {lang === "ru" ? "Партнерский профиль:" : "Partner Account:"}
                      </div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        {user.username}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]" style={{ fontFamily: "Georgia" }}>
                        {lang === "ru" ? "Баланс:" : "Balance:"}
                      </div>
                      <div className="text-base font-bold text-honey font-mono">
                        ${user.balance.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex flex-col gap-2.5">
                    <div className="text-xs font-light text-[var(--text-muted)] leading-relaxed" style={{ fontFamily: "Georgia" }}>
                      {lang === "ru" 
                        ? "Вы крутите рулетку в гостевом режиме. Зарегистрируйте аккаунт партнера, чтобы сохранить выигрыш и получить приветственные $3.00!" 
                        : "You are spinning in guest mode. Create an account to save your winnings and instantly activate your $3.00 gift!"}
                    </div>
                    <button
                      onClick={onOpenAuth}
                      className="w-full py-2 px-4 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors cursor-pointer text-center"
                      style={{ fontFamily: "Georgia" }}
                    >
                      {lang === "ru" ? "Вход / Регистрация 🍯" : "Login / Register 🍯"}
                    </button>
                  </div>
                )}

              </div>
            </div>

            {/* List of prizes checklist */}
            <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/5 bg-black/10 text-xs">
              <span className="font-bold text-honey uppercase tracking-wider mb-3 block" style={{ fontFamily: "Georgia" }}>
                🎯 {lang === "ru" ? "Доступные супер-призы:" : "Available Jackpots:"}
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {PRIZES.map((p) => (
                  <div key={p.id} className="flex items-center space-x-2 opacity-85 hover:opacity-100 transition-opacity">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="font-semibold text-white/90">{lang === "ru" ? p.textRu : p.textEn}</span>
                    <span className="text-[9px] opacity-50">({p.probability}%)</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* STUNNING CONGRATULATIONS MODAL */}
      <AnimatePresence>
        {showResultModal && currentPrizeObj && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            {/* Click outside to close (if not spinning) */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setShowResultModal(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 20, stiffness: 250 }}
              className="w-full max-w-[440px] rounded-[32px] p-6 sm:p-8 shadow-2xl border flex flex-col items-center text-center relative z-10 overflow-hidden glass-card"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
                boxShadow: "0 25px 50px -12px rgba(246, 176, 38, 0.3)"
              }}
            >
              {/* Confetti Glowing Effect */}
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-pulse" />
              <div className="absolute -top-24 w-60 h-60 rounded-full bg-amber-500/10 blur-[80px]" />

              {/* Close Button */}
              <button
                onClick={() => setShowResultModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors text-amber-500/70 hover:text-amber-500 cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>

              {/* Celebratory Icon */}
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-slate-950 text-3xl font-bold mb-5 shadow-lg shadow-amber-500/10 animate-bounce"
                style={{
                  background: `linear-gradient(135deg, ${currentPrizeObj.color}, #ffffff)`,
                  boxShadow: `0 10px 25px -5px ${currentPrizeObj.color}88`
                }}
              >
                <i className={`${currentPrizeObj.icon}`}></i>
              </div>

              {/* Heading */}
              <h3 
                className="text-2xl font-extrabold tracking-tight text-amber-500 mb-1.5"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {t.wheelResultTitle}
              </h3>
              
              <div className="text-xs uppercase font-semibold tracking-widest opacity-70 mb-4" style={{ color: "var(--text-muted)" }}>
                {t.wheelResultDesc}
              </div>

              {/* Prize Name Segment */}
              <div 
                className="px-5 py-3.5 rounded-2xl border text-lg sm:text-xl font-black mb-5 w-full bg-slate-950/40 relative group"
                style={{ borderColor: "var(--card-border)" }}
              >
                <span className="text-white relative z-10">
                  {lang === "ru" ? currentPrizeObj.textRu : currentPrizeObj.textEn}
                </span>
                <div 
                  className="absolute inset-0 rounded-2xl opacity-10 blur-md pointer-events-none"
                  style={{ backgroundColor: currentPrizeObj.color }}
                />
              </div>

              {/* Prize Details Description */}
              <p 
                className="text-xs sm:text-sm leading-relaxed mb-6 font-light" 
                style={{ color: "var(--text-muted)", fontFamily: "Georgia" }}
              >
                {lang === "ru" ? currentPrizeObj.descRu : currentPrizeObj.descEn}
              </p>

              {/* Interactive buttons */}
              <div className="w-full space-y-3">
                {/* CTA Link (goes to Referral page with standard bonus) */}
                <a
                  href={referralLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowResultModal(false)}
                  className="w-full py-3.5 px-4 rounded-xl honey-gradient text-slate-950 font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm shadow-lg shadow-amber-500/10 cursor-pointer"
                >
                  <i className="fa-solid fa-circle-check text-base"></i>
                  <span>{t.wheelClaimBtn}</span>
                </a>

                {/* If in demo mode, spin again option */}
                {isDemoMode && (
                  <button
                    onClick={handleResetForDemo}
                    className="w-full py-3 px-4 rounded-xl border border-amber-500/20 font-semibold text-amber-500 text-xs sm:text-sm hover:bg-amber-500/5 transition-all cursor-pointer"
                  >
                    <i className="fa-solid fa-rotate-left mr-1.5"></i>
                    {t.wheelTryAgain}
                  </button>
                )}

                <button
                  onClick={() => setShowResultModal(false)}
                  className="w-full py-2.5 px-4 rounded-xl border font-semibold text-xs sm:text-sm hover:bg-white/5 transition-all cursor-pointer"
                  style={{ borderColor: "var(--card-border)", color: "var(--text-main)" }}
                >
                  {lang === "ru" ? "Закрыть" : "Close"}
                </button>
              </div>

              {/* Small instructions disclaimer */}
              <div className="mt-5 text-[9px] opacity-75" style={{ color: "var(--text-muted)" }}>
                {lang === "ru" 
                  ? "* Выигрыш сохраняется за вашей сессией. Нажмите 'Активировать', чтобы забрать приветственный бонус $3."
                  : "* Prize is active for your session. Click 'Claim Prize' to unlock your initial $3 registration gift."}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
