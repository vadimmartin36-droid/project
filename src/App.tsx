import { useState, useEffect, useRef } from 'react';
import { translations, TranslationSet, Review } from './translations';
import { getStandaloneHtml } from './standalone';
import { motion, AnimatePresence } from 'motion/react';
import { NotificationToast } from './components/NotificationToast';
import { AIConsultant } from './components/AIConsultant';
import { LuckyWheel } from './components/LuckyWheel';
import { AuthModal } from './components/AuthModal';
import { GuidePage } from './components/GuidePage';
import { AboutPage } from './components/AboutPage';

export default function App() {
  // Текущая активная страница (home, guide или about)
  const [currentPage, setCurrentPage] = useState<'home' | 'guide' | 'about'>(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path.includes('/baza-znanij') || hash.includes('/baza-znanij')) return 'guide';
    if (path.includes('/o-proekte') || path.includes('/about') || hash.includes('/o-proekte') || hash.includes('/about')) return 'about';
    return 'home';
  });

  // Синхронизация при переходах "назад" / "вперед" в браузере
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.includes('/baza-znanij') || hash.includes('/baza-znanij')) {
        setCurrentPage('guide');
      } else if (path.includes('/o-proekte') || path.includes('/about') || hash.includes('/o-proekte') || hash.includes('/about')) {
        setCurrentPage('about');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Обновление пути URL в браузере при изменении состояния страницы
  useEffect(() => {
    const path = window.location.pathname;
    const isCurrentlyGuide = path.includes('/baza-znanij');
    const isCurrentlyAbout = path.includes('/o-proekte') || path.includes('/about');

    if (currentPage === 'guide') {
      if (!isCurrentlyGuide) {
        history.pushState({ page: 'guide' }, '', '/baza-znanij' + window.location.search);
      }
    } else if (currentPage === 'about') {
      if (!isCurrentlyAbout) {
        history.pushState({ page: 'about' }, '', '/o-proekte' + window.location.search);
      }
    } else {
      if (isCurrentlyGuide || isCurrentlyAbout) {
        history.pushState({ page: 'home' }, '', '/' + window.location.search);
      }
    }
  }, [currentPage]);

  // Скролл наверх при смене активной страницы
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollToTop();
    
    // Повторяем несколько раз на следующих кадрах для уверенности в условиях монтирования компонентов и анимаций
    const h1 = requestAnimationFrame(scrollToTop);
    const t1 = setTimeout(scrollToTop, 50);
    const t2 = setTimeout(scrollToTop, 150);

    return () => {
      cancelAnimationFrame(h1);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [currentPage]);

  // Инициализация темы и языка из localStorage или значений по умолчанию
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const [lang, setLang] = useState<'ru' | 'en'>(() => {
    const saved = localStorage.getItem('lang');
    return (saved === 'ru' || saved === 'en') ? saved : 'ru';
  });

  // Состояние калькулятора
  const [traffic, setTraffic] = useState<number>(2500); // в МБ
  const [devices, setDevices] = useState<number>(3);

  // Состояние карусели отзывов
  const [currentReview, setCurrentReview] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Состояние модального окна "В разработке"
  const [showPopup, setShowPopup] = useState<boolean>(false);

  // Состояние модального окна условий конкурса
  const [showTermsPopup, setShowTermsPopup] = useState<boolean>(false);

  // Состояние модального окна политики конфиденциальности
  const [showPrivacyPopup, setShowPrivacyPopup] = useState<boolean>(false);

  // Состояние модального окна правил сайта
  const [showRulesPopup, setShowRulesPopup] = useState<boolean>(false);

  // Состояние согласия на использование файлов cookie
  const [showCookieConsent, setShowCookieConsent] = useState<boolean>(false);

  useEffect(() => {
    const consent = localStorage.getItem('honeygain_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setShowCookieConsent(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('honeygain_cookie_consent', 'true');
    setShowCookieConsent(false);
  };

  // Состояние кнопки прокрутки наверх
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Состояние имитации пользователей онлайн
  const [onlineUsers, setOnlineUsers] = useState<number>(() => {
    return Math.floor(Math.random() * (130 - 90 + 1)) + 90;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers((prev) => {
        const change = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, 2
        const next = prev + change;
        if (next < 0) return 0;
        if (next > 150) return 150;
        return next;
      });
    }, 7000); // Обновление каждые 7 секунд
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Состояние таймера обратного отсчета для конкурса
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextMonth = new Date();
      if (now.getUTCDate() === 1 && now.getUTCHours() < 20) {
        nextMonth.setUTCMonth(now.getUTCMonth(), 1);
      } else {
        nextMonth.setUTCMonth(now.getUTCMonth() + 1, 1);
      }
      nextMonth.setUTCHours(20, 0, 0, 0);
      
      const difference = nextMonth.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  // Реферальная ссылка
  const referralLink = "https://join.honeygain.com/VADIM82855";

  // Словарь переводов для текущего языка
  const t: TranslationSet = translations[lang];

  // Применение темы оформления
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Сохранение языка в localStorage
  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  // Состояния авторизации
  const [user, setUser] = useState<any | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('honeygain_auth_token');
    if (token) {
      fetch('/api/auth/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Stale token');
      })
      .then(data => {
        if (data.success) {
          setUser(data.user);
        }
      })
      .catch(() => {
        localStorage.removeItem('honeygain_auth_token');
      });
    }
  }, []);

  // Автоматическое перелистывание карусели каждые 5 секунд
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % t.reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, t.reviews.length]);

  // Вычисление дохода: (МБ/день * 30 * устройств) * $0.0003
  const monthlyEarnings = (traffic * 30 * devices) * 0.0003;

  // Форматирование трафика (МБ или ГБ)
  const formatTraffic = (val: number) => {
    if (val >= 1000) {
      return (val / 1000).toFixed(1) + ' GB';
    }
    return val + ' MB';
  };

  // Обработчик загрузки готового HTML-кода
  const handleDownloadHtml = () => {
    const htmlContent = getStandaloneHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen transition-colors duration-300 pb-0 relative z-0">
      {/* BACKGROUND DECORATIVE LAYERS (BEAUTIFUL & ADAPTIVE) */}
      <div className="fixed inset-0 z-[-10] pointer-events-none overflow-hidden select-none">
        {/* Base background color */}
        <div className="absolute inset-0" style={{ backgroundColor: 'var(--background)' }} />
        
        {/* Dot Grid Layer */}
        <div className="absolute inset-0 bg-dot-grid opacity-[0.85]" />
        
        {/* Honeycomb Vignette Overlay */}
        <div className="absolute inset-0 bg-honeycomb-overlay" />
        
        {/* Dynamic Glowing Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 dark:bg-amber-500/5 blur-[120px]" style={{ animation: 'float 12s ease-in-out infinite' }} />
        <div className="absolute bottom-[10%] right-[-10%] w-[65%] h-[65%] rounded-full bg-orange-500/10 dark:bg-orange-500/4 blur-[140px]" style={{ animation: 'float 15s ease-in-out infinite', animationDelay: '2.5s' }} />
        <div className="absolute top-[35%] left-[25%] w-[45%] h-[45%] rounded-full bg-yellow-500/5 dark:bg-yellow-500/2 blur-[100px]" style={{ animation: 'float 18s ease-in-out infinite', animationDelay: '5s' }} />
      </div>
      
      {/* ШАПКА САЙТА (STICKY HEADER) */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b" style={{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--card-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Логотип */}
          <button 
            onClick={() => {
              setCurrentPage('home');
              window.scrollTo(0, 0);
            }} 
            className="flex items-center space-x-2.5 group text-left cursor-pointer" 
            style={{ fontFamily: 'Georgia' }}
          >
            <div className="w-8 h-8 rounded-lg honey-gradient flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-transform">
              <span>H</span>
            </div>
            <span className="text-xl sm:text-2xl tracking-tight font-semibold" style={{ color: 'var(--text-main)' }}>
              HoneyGain<span className="text-honey">.store</span>
            </span>
          </button>

          {/* Навигационные ссылки */}
          <div className="hidden md:flex items-center space-x-8 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('home');
                window.scrollTo(0, 0);
              }}
              className={`hover:text-[var(--text-main)] transition-colors cursor-pointer ${currentPage === 'home' ? 'text-honey font-bold' : ''}`} 
              style={{ fontFamily: 'Georgia' }}
            >
              {lang === 'ru' ? 'Главная' : 'Home'}
            </a>
            <button 
              onClick={() => {
                setCurrentPage('guide');
                window.scrollTo(0, 0);
              }}
              className={`hover:text-[var(--text-main)] transition-colors cursor-pointer text-xs font-semibold uppercase tracking-widest ${currentPage === 'guide' ? 'text-honey font-bold' : ''}`}
              style={{ fontFamily: 'Georgia' }}
            >
              {lang === 'ru' ? 'База знаний' : 'Guide'}
            </button>
            <button 
              onClick={() => {
                setCurrentPage('about');
                window.scrollTo(0, 0);
              }}
              className={`hover:text-[var(--text-main)] transition-colors cursor-pointer text-xs font-semibold uppercase tracking-widest ${currentPage === 'about' ? 'text-honey font-bold' : ''}`}
              style={{ fontFamily: 'Georgia' }}
            >
              {lang === 'ru' ? 'О проекте' : 'About'}
            </button>
          </div>

          {/* Кнопки управления (Тема, Язык, Руководство, Авторизация, CTA) */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Кнопка смены темы */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 rounded-full glass-card flex items-center justify-center cursor-pointer text-base hover:scale-110 active:scale-95 transition-all"
              title="Сменить тему"
            >
              <i className={theme === 'dark' ? "fa-solid fa-sun text-[#f6b026]" : "fa-solid fa-moon text-slate-800"}></i>
            </button>

            {/* Кнопка переключения языка */}
            <button 
              onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
              className="h-9 px-2.5 sm:px-3 rounded-full glass-card flex items-center space-x-1 sm:space-x-1.5 text-xs font-semibold cursor-pointer hover:scale-105 transition-all"
            >
              <i className="fa-solid fa-globe text-[#f6b026]"></i>
              <span style={{ fontFamily: 'Georgia' }}>{lang.toUpperCase()}</span>
            </button>

            {/* Кнопка "База знаний" (Руководство) для мобильных */}
            <button 
              onClick={() => {
                setCurrentPage(currentPage === 'guide' ? 'home' : 'guide');
                window.scrollTo(0, 0);
              }}
              className={`md:hidden h-9 px-2.5 sm:px-3 rounded-full glass-card flex items-center space-x-1 sm:space-x-1.5 text-xs font-semibold cursor-pointer hover:scale-105 active:scale-95 transition-all ${currentPage === 'guide' ? 'border-[#f6b026] text-[#f6b026]' : ''}`}
              title={lang === 'ru' ? 'Руководство по заработку' : 'Earnings Guide'}
            >
              <i className="fa-solid fa-book text-[#f6b026]"></i>
              <span className="hidden sm:inline" style={{ fontFamily: 'Georgia' }}>
                {lang === 'ru' ? 'База знаний' : 'Guide'}
              </span>
            </button>

            {/* Кнопка "О проекте" для мобильных */}
            <button 
              onClick={() => {
                setCurrentPage(currentPage === 'about' ? 'home' : 'about');
                window.scrollTo(0, 0);
              }}
              className={`md:hidden h-9 px-2.5 sm:px-3 rounded-full glass-card flex items-center space-x-1 sm:space-x-1.5 text-xs font-semibold cursor-pointer hover:scale-105 active:scale-95 transition-all ${currentPage === 'about' ? 'border-[#f6b026] text-[#f6b026]' : ''}`}
              title={lang === 'ru' ? 'О проекте' : 'About Project'}
            >
              <i className="fa-solid fa-circle-info text-[#f6b026]"></i>
              <span className="hidden sm:inline" style={{ fontFamily: 'Georgia' }}>
                {lang === 'ru' ? 'О проекте' : 'About'}
              </span>
            </button>

            {/* ПРОФИЛЬ ИЛИ ВХОД */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="h-9 px-2 sm:px-4 rounded-full glass-card flex items-center space-x-1.5 sm:space-x-2 text-xs font-semibold cursor-pointer border border-[#f6b026]/30 hover:bg-white/5 transition-all select-none"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#f6b026] text-slate-950 flex items-center justify-center font-bold text-[10px] sm:text-xs shadow shadow-amber-500/20">
                    {user.username.substring(0, 1).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-[var(--text-main)]" style={{ fontFamily: 'Georgia' }}>{user.username}</span>
                  <span className="text-honey font-mono font-bold">${user.balance.toFixed(2)}</span>
                  <i className={`fa-solid fa-chevron-down text-[8px] sm:text-[10px] text-[var(--text-muted)] transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}></i>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <>
                      {/* Backdrop overlay */}
                      <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 rounded-2xl border p-4 shadow-2xl glass-card z-50 text-left"
                        style={{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--card-border)' }}
                      >
                        <div className="border-b border-[var(--card-border)] pb-3 mb-3">
                          <div className="text-[10px] text-[var(--text-muted)] font-light" style={{ fontFamily: 'Georgia' }}>
                            {lang === 'ru' ? 'Вы вошли как:' : 'Logged in as:'}
                          </div>
                          <div className="text-xs sm:text-sm font-bold text-white tracking-tight truncate mt-0.5" style={{ fontFamily: 'Georgia' }}>
                            {user.email}
                          </div>
                        </div>

                        <div className="space-y-2 mb-3 text-xs">
                          <div className="flex justify-between items-center text-[var(--text-muted)]">
                            <span style={{ fontFamily: 'Georgia' }}>{lang === 'ru' ? 'Ваш баланс:' : 'Your balance:'}</span>
                            <span className="font-bold text-honey font-mono">${user.balance.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center text-[var(--text-muted)]">
                            <span style={{ fontFamily: 'Georgia' }}>{lang === 'ru' ? 'Статус:' : 'Status:'}</span>
                            <span className="font-semibold text-emerald-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Active
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-[var(--text-muted)] text-[10px] pt-1">
                            <span style={{ fontFamily: 'Georgia' }}>{lang === 'ru' ? 'Создан:' : 'Registered:'}</span>
                            <span>{new Date(user.registeredAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            localStorage.removeItem('honeygain_auth_token');
                            setUser(null);
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                          style={{ fontFamily: 'Georgia' }}
                        >
                          <i className="fa-solid fa-arrow-right-from-bracket text-xs"></i>
                          <span>{lang === 'ru' ? 'Выйти' : 'Sign Out'}</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="h-9 px-3 rounded-full glass-card flex items-center space-x-1.5 text-xs font-bold cursor-pointer text-[var(--text-main)] hover:bg-white/5 transition-all"
                style={{ fontFamily: 'Georgia' }}
              >
                <i className="fa-solid fa-user text-[#f6b026]"></i>
                <span>{lang === 'ru' ? 'Вход' : 'Sign In'}</span>
              </button>
            )}


          </div>
        </div>
      </header>

      {/* ТЕХНИЧЕСКИЕ РАБОТЫ (MAINTENANCE RUNNING TEXT) */}
      <div className="w-full overflow-hidden border-b py-2 sm:py-2.5 flex items-center select-none" style={{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--card-border)' }}>
        <div className="flex items-center space-x-2 px-3 sm:px-4 z-10 font-bold text-[#f6b026] text-xs sm:text-sm shrink-0 border-r" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--header-bg)' }}>
          <i className="fa-solid fa-triangle-exclamation text-[#f6b026] animate-pulse"></i>
          <span style={{ fontFamily: 'Georgia' }}>{lang === 'ru' ? 'Внимание:' : 'Notice:'}</span>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap flex items-center py-0.5 text-xs sm:text-sm font-medium" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
            <span className="inline-flex items-center mx-4">
              {lang === 'ru' 
                ? 'На сайте ведутся технические работы. Примерная дата окончания работ запланирована до 01.08.26. Извините за неудобства.' 
                : 'The website is undergoing technical maintenance. The estimated completion date is scheduled for August 1, 2026. We apologize for any inconvenience.'}
            </span>
            <span className="inline-flex items-center mx-4 text-[#f6b026]">•</span>
            <span className="inline-flex items-center mx-4">
              {lang === 'ru' 
                ? 'На сайте ведутся технические работы. Примерная дата окончания работ запланирована до 01.08.26. Извините за неудобства.' 
                : 'The website is undergoing technical maintenance. The estimated completion date is scheduled for August 1, 2026. We apologize for any inconvenience.'}
            </span>
            <span className="inline-flex items-center mx-4 text-[#f6b026]">•</span>
            <span className="inline-flex items-center mx-4">
              {lang === 'ru' 
                ? 'На сайте ведутся технические работы. Примерная дата окончания работ запланирована до 01.08.26. Извините за неудобства.' 
                : 'The website is undergoing technical maintenance. The estimated completion date is scheduled for August 1, 2026. We apologize for any inconvenience.'}
            </span>
            <span className="inline-flex items-center mx-4 text-[#f6b026]">•</span>
            <span className="inline-flex items-center mx-4">
              {lang === 'ru' 
                ? 'На сайте ведутся технические работы. Примерная дата окончания работ запланирована до 01.08.26. Извините за неудобства.' 
                : 'The website is undergoing technical maintenance. The estimated completion date is scheduled for August 1, 2026. We apologize for any inconvenience.'}
            </span>
            <span className="inline-flex items-center mx-4 text-[#f6b026]">•</span>
          </div>
        </div>
      </div>

      {currentPage === 'home' ? (
        <>
          {/* ГЕРОЙ-БЛОК (HERO SECTION) */}
          <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 overflow-hidden">
        {/* Декоративные фоновые элементы */}
        <div className="absolute top-1/4 left-1/10 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-amber-500/5 blur-3xl -z-10 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/10 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-orange-500/5 blur-3xl -z-10 animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-7xl mx-auto px-4 text-center">
          
          {/* Парящий бейдж */}
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#f6b026]/10 text-[#f6b026] text-xs font-semibold tracking-wider uppercase mb-8 border border-[#f6b026]/20 animate-float">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f6b026] animate-pulse" />
            <span style={{ fontFamily: 'Georgia' }}>{t.badge}</span>
          </div>

          {/* Главный заголовок */}
          <h1 className="text-center w-full block font-bold tracking-tight serif-title italic text-balance border-solid border-0" style={{ color: 'var(--text-main)', fontSize: '36px', lineHeight: '36px', height: '40px', marginTop: '0px', marginBottom: '10px', marginLeft: '0px', marginRight: '0px', paddingLeft: '0px', paddingRight: '0px', paddingBottom: '0px' }}>
            {t.heroTitle}{' '}
            <span className="text-honey font-bold">
              {t.heroTitleHighlight}
            </span>{t.heroTitleEnd}
          </h1>

          {/* Описание */}
          <div className="text-center text-base sm:text-xl max-w-6xl mx-auto mb-10 leading-relaxed font-light space-y-1" style={{ color: 'var(--text-muted)', paddingTop: '55px' }}>
            <p style={{ fontSize: '18px', lineHeight: '28px', fontFamily: 'Georgia', fontWeight: 'normal' }}>{t.heroSubtitle}</p>
            <p className="whitespace-normal" style={{ fontSize: '18px', lineHeight: '28px', fontFamily: 'Georgia' }}>{t.heroSubtitleSec}</p>
          </div>

          {/* Кнопки действия */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mx-auto" style={{ width: '1200px', maxWidth: '100%' }}>
            <a 
              href={referralLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full sm:w-auto max-w-xs sm:max-w-none mx-auto px-6 py-3 sm:px-8 sm:py-4 rounded-xl honey-gradient text-slate-950 font-bold text-sm sm:text-lg flex items-center justify-center space-x-3 shadow-lg shadow-amber-500/10 hover:scale-[1.02] active:scale-95 transition-all group cursor-pointer"
              style={{ borderStyle: 'solid', borderWidth: '0px', borderRadius: '12px', fontFamily: 'Georgia' }}
            >
              <span style={{ fontFamily: 'Georgia', fontWeight: 'bold', fontStyle: 'normal' }}>{t.btnStart}</span>
              <i className="fa-solid fa-arrow-right group-hover:translate-x-1.5 transition-transform"></i>
            </a>
          </div>

          {/* Имитация пользователей онлайн под кнопкой */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-xs sm:text-sm font-semibold select-none" style={{ fontFamily: 'Georgia' }}>
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500"></span>
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              {lang === 'ru' ? `Сейчас на сайте: ${onlineUsers} участников` : `Active users on site: ${onlineUsers} members`}
            </span>
          </div>
        </div>
      </section>

      {/* РАЗДЕЛ КОНКУРС (CONTEST SECTION) */}
      <section id="contest" className="py-24 sm:py-32 relative overflow-hidden border-t animate-fade-in" style={{ borderColor: 'var(--card-border)' }}>
        <div className="absolute top-1/3 right-10 w-72 h-72 rounded-full bg-[#f6b026]/5 blur-[80px] -z-10 animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 left-10 w-72 h-72 rounded-full bg-[#f28c28]/5 blur-[80px] -z-10 animate-pulse-glow"></div>
        
        <div className="max-w-7xl mx-auto px-4">
          {/* Заголовок */}
          <div className="text-center mb-16 sm:mb-24">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#f6b026]/10 text-[#f6b026] text-xs font-semibold tracking-wider uppercase mb-4 border border-[#f6b026]/20">
              <i className="fa-solid fa-trophy"></i>
              <span style={{ fontFamily: 'Georgia' }}>{t.contestBadge}</span>
            </span>
            <h2 className="font-bold tracking-tight mb-4 serif-title italic border-solid border-0" style={{ color: 'var(--text-main)', fontSize: '36px', height: '40px', lineHeight: '36px' }}>
              {t.contestTitle}
            </h2>
            <p className="text-base sm:text-lg font-light max-w-[800px] mx-auto" style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: '28px', paddingTop: '25px', fontFamily: 'Georgia' }}>
              {t.contestSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
            {/* Карточка 1: Инфо о призовом фонде и Таймер (Bento Left - 5 cols) */}
            <div className="lg:col-span-5 glass-card p-8 rounded-3xl border border-amber-500/10 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-amber-500/5 blur-2xl group-hover:bg-amber-500/10 transition-colors"></div>
              
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-2 block" style={{ fontFamily: 'Georgia' }}>{t.contestPrizePool}</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-honey serif-title italic mb-6">
                  {t.contestPrizePoolVal}
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <i className="fa-solid fa-calendar-day"></i>
                    </div>
                    <div>
                      <div className="text-xs opacity-70" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>{t.contestDate}</div>
                      <div className="font-semibold text-sm" style={{ color: 'var(--text-main)', fontFamily: 'Georgia' }}>{t.contestDateVal}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Обратный отсчет */}
              <div className="border-t border-amber-500/10 pt-6">
                <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
                  {lang === 'ru' ? 'До розыгрыша осталось:' : 'Time left until next draw:'}
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-2 sm:p-3">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-honey">{String(timeLeft.days).padStart(2, '0')}</div>
                    <div className="text-[10px] uppercase opacity-75 font-light" style={{ color: 'var(--text-muted)' }}>
                      {lang === 'ru' ? 'дн' : 'days'}
                    </div>
                  </div>
                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-2 sm:p-3">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-honey">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="text-[10px] uppercase opacity-75 font-light" style={{ color: 'var(--text-muted)' }}>
                      {lang === 'ru' ? 'ч' : 'hours'}
                    </div>
                  </div>
                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-2 sm:p-3">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-honey">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="text-[10px] uppercase opacity-75 font-light" style={{ color: 'var(--text-muted)' }}>
                      {lang === 'ru' ? 'мин' : 'mins'}
                    </div>
                  </div>
                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-2 sm:p-3">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-honey">{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className="text-[10px] uppercase opacity-75 font-light" style={{ color: 'var(--text-muted)' }}>
                      {lang === 'ru' ? 'сек' : 'secs'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Карточка 2: Призовые места (Bento Right - 7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              
              {/* 1 Место */}
              <div className="glass-card p-6 rounded-2xl border border-amber-500/20 flex items-center space-x-5 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
                <div className="absolute right-0 top-0 w-32 h-32 rounded-full bg-[#f6b026]/5 blur-xl group-hover:bg-[#f6b026]/10 transition-colors"></div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center text-slate-950 text-2xl font-bold shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform flex-shrink-0">
                  👑
                </div>
                <div>
                  <h4 className="text-lg font-bold text-honey serif-title italic mb-1">{t.contestT1Title}</h4>
                  <p className="text-xs sm:text-sm font-light leading-relaxed" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>{t.contestT1Desc}</p>
                </div>
              </div>

              {/* 2 Место */}
              <div className="glass-card p-6 rounded-2xl border border-[var(--card-border)] flex items-center space-x-5 relative overflow-hidden group hover:border-slate-500/40 transition-colors">
                <div className="absolute right-0 top-0 w-32 h-32 rounded-full bg-slate-400/5 blur-xl group-hover:bg-slate-400/10 transition-colors"></div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 flex items-center justify-center text-slate-950 text-2xl font-bold shadow-lg shadow-slate-400/10 group-hover:scale-110 transition-transform flex-shrink-0">
                  🥈
                </div>
                <div>
                  <h4 className="text-lg font-bold serif-title italic mb-1" style={{ color: 'var(--text-main)' }}>{t.contestT2Title}</h4>
                  <p className="text-xs sm:text-sm font-light leading-relaxed" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>{t.contestT2Desc}</p>
                </div>
              </div>

              {/* 3 Место */}
              <div className="glass-card p-6 rounded-2xl border border-[var(--card-border)] flex items-center space-x-5 relative overflow-hidden group hover:border-amber-700/40 transition-colors">
                <div className="absolute right-0 top-0 w-32 h-32 rounded-full bg-amber-700/5 blur-xl group-hover:bg-amber-700/10 transition-colors"></div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-amber-800/10 group-hover:scale-110 transition-transform flex-shrink-0">
                  🥉
                </div>
                <div>
                  <h4 className="text-lg font-bold serif-title italic mb-1" style={{ color: 'var(--text-main)' }}>{t.contestT3Title}</h4>
                  <p className="text-xs sm:text-sm font-light leading-relaxed" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>{t.contestT3Desc}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Правила участия */}
          <div className="max-w-3xl mx-auto glass-card p-8 sm:p-10 rounded-[32px] border border-amber-500/10 text-center relative">
            <h3 className="text-2xl font-bold mb-6 text-honey serif-title italic">{t.contestRulesTitle}</h3>
            
            <ul className="text-left space-y-4 mb-8">
              <li className="flex items-start space-x-3 text-sm sm:text-base font-light">
                <div className="mt-1 w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20 text-honey flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>{t.contestRule1}</span>
              </li>
              <li className="flex items-start space-x-3 text-sm sm:text-base font-light">
                <div className="mt-1 w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20 text-honey flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>{t.contestRule2}</span>
              </li>
              <li className="flex items-start space-x-3 text-sm sm:text-base font-light">
                <div className="mt-1 w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#f6b026] flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>{t.contestRule3}</span>
              </li>
            </ul>

            <p className="text-xs sm:text-sm text-left font-light mb-4 italic" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
              {t.contestNote}
            </p>

            <button 
              onClick={() => setShowTermsPopup(true)}
              className="text-amber-500 hover:text-amber-400 font-medium text-sm transition-colors flex items-center justify-center space-x-1.5 mx-auto mb-8 hover:underline cursor-pointer"
            >
              <i className="fa-solid fa-circle-info text-xs"></i>
              <span style={{ fontFamily: 'Georgia' }}>{t.contestTermsLink}</span>
            </button>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a 
                href={referralLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full sm:w-auto px-8 py-4 rounded-2xl honey-gradient text-slate-950 font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 text-center cursor-pointer"
                style={{ fontFamily: 'Georgia' }}
              >
                <i className="fa-solid fa-gift mr-2 animate-bounce"></i>
                {t.contestJoinBtn}
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* РУЛЕТКА / КОЛЕСО УДАЧИ (LUCKY WHEEL SECTION) */}
      <LuckyWheel 
        lang={lang} 
        theme={theme} 
        referralLink={referralLink} 
        t={t} 
        user={user}
        onBalanceUpdate={(newBalance) => {
          setUser((prev: any) => prev ? { ...prev, balance: newBalance } : prev);
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
      />
      {/* ВИДЕО-БЛОК (VIDEO SECTION) */}
      <section className="pb-24 sm:pb-32 px-4 pt-[60px]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 pl-0 pt-[60px]">
            <h2 className="font-semibold tracking-tight mb-3 serif-title italic max-w-full lg:w-[768px] mx-auto text-center" style={{ color: 'var(--text-main)', fontSize: '36px', height: '40px', lineHeight: '36px' }}>{t.videoTitle}</h2>
            <p className="text-sm sm:text-base max-w-3xl mx-auto font-light" style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: '27px', paddingTop: '25px', fontFamily: 'Georgia' }}>{t.videoSubtitle}</p>
          </div>
          
          <div className="video-glow-frame p-2 sm:p-3 rounded-3xl max-w-3xl mx-auto overflow-hidden" style={{ borderRadius: '24px' }}>
            <div className="relative pb-[56.25%] h-0 rounded-2xl overflow-hidden shadow-2xl">
              <iframe 
                className="absolute top-0 left-0 w-full h-full border-0" 
                src="https://www.youtube.com/embed/_acLhr4XLU4" 
                title="Honeygain Explainer Video" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* СЕКЦИЯ «КАК ЭТО РАБОТАЕТ» (HOW IT WORKS SECTION) */}
      <section id="how" className="py-24 sm:py-32 border-t border-b scroll-mt-20" style={{ borderColor: 'var(--card-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
            <h2 className="font-bold tracking-tight mb-4 serif-title italic" style={{ color: 'var(--text-main)', fontSize: '36px', height: '40px', lineHeight: '36px' }}>{t.howTitle}</h2>
            <p className="text-base sm:text-lg font-light" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>{t.howSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Шаг 1 */}
            <div className="glass-card p-8 sm:p-10 rounded-3xl relative group">
              <span className="absolute -top-10 left-6 text-7xl sm:text-8xl font-black font-serif italic text-transparent bg-clip-text bg-gradient-to-b from-[#f6b026]/10 to-transparent select-none">{t.step1Num}</span>
              <div className="w-12 h-12 rounded-xl bg-[var(--input-bg)] border border-[var(--card-border)] flex items-center justify-center text-xl text-[#f6b026] mb-8 group-hover:rotate-12 transition-transform">
                <i className="fa-solid fa-download"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 serif-title italic" style={{ color: 'var(--text-main)' }}>{t.step1Title}</h3>
              <p className="text-sm sm:text-base leading-relaxed font-light" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>{t.step1Desc}</p>
            </div>

            {/* Шаг 2 */}
            <div className="glass-card p-8 sm:p-10 rounded-3xl relative group">
              <span className="absolute -top-10 left-6 text-7xl sm:text-8xl font-black font-serif italic text-transparent bg-clip-text bg-gradient-to-b from-[#f6b026]/10 to-transparent select-none">{t.step2Num}</span>
              <div className="w-12 h-12 rounded-xl bg-[var(--input-bg)] border border-[var(--card-border)] flex items-center justify-center text-xl text-[#f6b026] mb-8 group-hover:rotate-12 transition-transform">
                <i className="fa-solid fa-bolt"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 serif-title italic" style={{ color: 'var(--text-main)' }}>{t.step2Title}</h3>
              <p className="text-sm sm:text-base leading-relaxed font-light" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>{t.step2Desc}</p>
            </div>

            {/* Шаг 3 */}
            <div className="glass-card p-8 sm:p-10 rounded-3xl relative group">
              <span className="absolute -top-10 left-6 text-7xl sm:text-8xl font-black font-serif italic text-transparent bg-clip-text bg-gradient-to-b from-[#f6b026]/10 to-transparent select-none">{t.step3Num}</span>
              <div className="w-12 h-12 rounded-xl bg-[var(--input-bg)] border border-[var(--card-border)] flex items-center justify-center text-xl text-[#f6b026] mb-8 group-hover:rotate-12 transition-transform">
                <i className="fa-solid fa-wallet"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 serif-title italic" style={{ color: 'var(--text-main)' }}>{t.step3Title}</h3>
              <p className="text-sm sm:text-base leading-relaxed font-light" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>{t.step3Desc}</p>
            </div>

          </div>
        </div>
      </section>

      {/* СЕКЦИЯ ПРЕИМУЩЕСТВ (BENEFITS SECTION) */}
      <section id="advantages" className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
            <h2 className="font-semibold tracking-tight mb-4 serif-title italic text-center no-underline" style={{ color: 'var(--text-main)', textDecorationLine: 'none', textAlign: 'center', fontFamily: 'Playfair Display', fontSize: '36px', height: '40px', lineHeight: '36px' }}>{t.benefitsTitle}</h2>
            <p className="text-base sm:text-lg font-light" style={{ color: 'var(--text-muted)', paddingTop: '25px', fontFamily: 'Georgia' }}>{t.benefitsSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Преимущество 1 */}
            <div className="glass-card p-8 rounded-3xl text-center group">
              <div className="w-14 h-14 rounded-xl bg-[var(--input-bg)] border border-[var(--card-border)] mx-auto flex items-center justify-center text-xl text-[#f6b026] mb-6 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-mug-hot"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 serif-title italic" style={{ color: 'var(--text-main)' }}>{t.b1Title}</h3>
              <p className="text-xs sm:text-sm font-light" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>{t.b1Desc}</p>
            </div>

            {/* Преимущество 2 */}
            <div className="glass-card p-8 rounded-3xl text-center group">
              <div className="w-14 h-14 rounded-xl bg-[var(--input-bg)] border border-[var(--card-border)] mx-auto flex items-center justify-center text-xl text-[#f6b026] mb-6 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 serif-title italic" style={{ color: 'var(--text-main)' }}>{t.b2Title}</h3>
              <p className="text-xs sm:text-sm font-light" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>{t.b2Desc}</p>
            </div>

            {/* Преимущество 3 */}
            <div className="glass-card p-8 rounded-3xl text-center group border-[#f6b026]/30 shadow-md shadow-amber-500/5">
              <div className="w-14 h-14 rounded-xl honey-gradient mx-auto flex items-center justify-center text-2xl text-slate-950 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/10">
                <i className="fa-solid fa-gift"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-honey serif-title italic">{t.b3Title}</h3>
              <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>{t.b3Desc}</p>
            </div>

            {/* Преимущество 4 */}
            <div className="glass-card p-8 rounded-3xl text-center group">
              <div className="w-14 h-14 rounded-xl bg-[var(--input-bg)] border border-[var(--card-border)] mx-auto flex items-center justify-center text-xl text-[#f6b026] mb-6 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-users"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 serif-title italic" style={{ color: 'var(--text-main)' }}>{t.b4Title}</h3>
              <p className="text-xs sm:text-sm font-light" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>{t.b4Desc}</p>
            </div>

          </div>
        </div>
      </section>

      {/* КАЛЬКУЛЯТОР ДОХОДА (INCOME CALCULATOR) */}
      <section className="py-24 sm:py-32 border-t border-b" style={{ borderColor: 'var(--card-border)', backgroundColor: 'transparent', fontFamily: 'Georgia' }}>
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="text-center mb-16">
            <h2 className="font-semibold tracking-tight mb-4 serif-title italic" style={{ color: 'var(--text-main)', fontSize: '36px', height: '40px', lineHeight: '36px' }}>{t.calcTitle}</h2>
            <p className="text-base sm:text-lg font-light" style={{ color: 'var(--text-muted)', paddingTop: '25px', fontFamily: 'Georgia' }}>{t.calcSubtitle}</p>
          </div>

          <div className="glass-card p-6 sm:p-10 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center" style={{ fontFamily: 'Georgia' }}>
            
            {/* Ползунки */}
            <div className="space-y-8">
              
              {/* Ползунок Трафика */}
              <div>
                <div className="flex justify-between items-center mb-4 text-sm sm:text-base font-semibold">
                  <span style={{ color: 'var(--text-main)' }}>{t.trafficLabel}</span>
                  <span className="text-[#f6b026] text-lg font-mono font-bold">{formatTraffic(traffic)}</span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="5000" 
                  step="100" 
                  value={traffic}
                  onChange={(e) => setTraffic(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-[var(--slider-track)] rounded-lg appearance-none cursor-pointer accent-[#f6b026]"
                />
                <div className="flex justify-between text-xs mt-2 font-mono" style={{ color: 'var(--text-muted)' }}>
                  <span>100 MB</span>
                  <span>5 GB</span>
                </div>
              </div>

              {/* Ползунок Устройств */}
              <div>
                <div className="flex justify-between items-center mb-4 text-sm sm:text-base font-semibold">
                  <span style={{ color: 'var(--text-main)' }}>{t.devicesLabel}</span>
                  <span className="text-[#f6b026] text-lg font-mono font-bold">{devices}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  step="1" 
                  value={devices}
                  onChange={(e) => setDevices(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-[var(--slider-track)] rounded-lg appearance-none cursor-pointer accent-[#f6b026]"
                />
                <div className="flex justify-between text-xs mt-2 font-mono" style={{ color: 'var(--text-muted)' }}>
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>

            </div>

            {/* Результат вычислений */}
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-[var(--input-bg)] border border-[var(--card-border)] relative overflow-hidden text-center min-h-[220px]">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-amber-500/5 blur-xl"></div>
              
              <span className="text-xs uppercase tracking-widest font-bold mb-3" style={{ color: 'var(--text-muted)' }}>{t.estTitle}</span>
              
              {/* Анимированная сумма */}
              <span className="text-5xl sm:text-6xl text-honey font-bold serif-title italic tracking-tight mb-3 select-none">
                ${monthlyEarnings.toFixed(2)}
              </span>
              
              <span className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>
                {t.estPeriod}
              </span>

              <p className="text-[10px] sm:text-[11px] mt-6 leading-relaxed opacity-85 font-light" style={{ color: 'var(--text-muted)' }}>
                {t.calcDisclaimer}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* КАРУСЕЛЬ ОТЗЫВОВ (REVIEWS CAROUSEL) */}
      <section className="py-24 sm:py-32 overflow-hidden relative">
        <div className="max-w-5xl mx-auto px-4">
          
          <div className="text-center mb-16 sm:mb-24">
            <h2 className="font-semibold tracking-tight mb-4 serif-title italic" style={{ color: 'var(--text-main)', fontSize: '36px', height: '40px', lineHeight: '36px' }}>{t.reviewsTitle}</h2>
            <p className="text-base sm:text-lg font-light" style={{ color: 'var(--text-muted)', paddingTop: '25px', fontFamily: 'Georgia' }}>{t.reviewsSubtitle}</p>
          </div>

          {/* Главная обертка карусели */}
          <div className="relative max-w-3xl mx-auto">
            
            {/* Окно просмотра */}
            <div 
              className="overflow-hidden rounded-3xl glass-card p-8 sm:p-12 relative cursor-grab active:cursor-grabbing"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{ fontFamily: 'Georgia' }}
            >
              <div className="relative min-h-[180px] sm:min-h-[160px]">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentReview}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Аватар по инициалам */}
                      <div className="w-12 h-12 rounded-full bg-[#f6b026]/10 text-[#f6b026] border border-[#f6b026]/20 flex items-center justify-center font-bold text-base shadow-md">
                        {t.reviews[currentReview].initials}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg" style={{ color: 'var(--text-main)' }}>
                           {t.reviews[currentReview].name}
                        </h4>
                        <div className="text-xs flex items-center space-x-2 font-light" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
                          <span>{t.reviews[currentReview].country}</span>
                          <span>&bull;</span>
                          <span>{t.reviews[currentReview].date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Звезды */}
                    <div className="flex text-[#f6b026] space-x-1 text-sm">
                      {[...Array(t.reviews[currentReview].rating)].map((_, i) => (
                        <i key={i} className="fa-solid fa-star"></i>
                      ))}
                    </div>

                    {/* Текст */}
                    <p className="text-base sm:text-lg leading-relaxed italic font-light" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
                      "{t.reviews[currentReview].text}"
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Боковые кнопки (десктопные) */}
            <button 
              onClick={() => setCurrentReview((prev) => (prev - 1 + t.reviews.length) % t.reviews.length)}
              className="hidden lg:flex absolute left-[-60px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-card items-center justify-center text-lg text-[#f6b026] cursor-pointer hover:scale-110 active:scale-95 transition-all z-10"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button 
              onClick={() => setCurrentReview((prev) => (prev + 1) % t.reviews.length)}
              className="hidden lg:flex absolute right-[-60px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-card items-center justify-center text-lg text-[#f6b026] cursor-pointer hover:scale-110 active:scale-95 transition-all z-10"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>

            {/* Точки навигации и мобильные кнопки */}
            <div className="flex justify-center items-center space-x-6 mt-8">
              <button 
                onClick={() => setCurrentReview((prev) => (prev - 1 + t.reviews.length) % t.reviews.length)}
                className="flex lg:hidden w-10 h-10 rounded-full glass-card items-center justify-center text-[#f6b026] active:scale-90 transition-all"
              >
                <i className="fa-solid fa-chevron-left text-xs"></i>
              </button>
              
              <div className="flex items-center space-x-2">
                {t.reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentReview(index)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${index === currentReview ? 'bg-[#f6b026] w-6' : 'bg-slate-400/20 w-2'}`}
                  />
                ))}
              </div>

              <button 
                onClick={() => setCurrentReview((prev) => (prev + 1) % t.reviews.length)}
                className="flex lg:hidden w-10 h-10 rounded-full glass-card items-center justify-center text-[#f6b026] active:scale-90 transition-all"
              >
                <i className="fa-solid fa-chevron-right text-xs"></i>
              </button>
            </div>

          </div>

        </div>
      </section>



      {/* ФИНАЛЬНЫЙ ПРИЗЫВ (CTA SECTION) */}
      <section id="cta" className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-[500px] sm:h-[500px] rounded-full bg-[#f6b026]/5 blur-[100px] -z-10 animate-pulse-glow"></div>

        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="glass-card p-8 sm:p-16 rounded-[32px] border border-amber-500/20 relative">
            
            {/* Парящий бейдж с бонусом */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full honey-gradient text-slate-950 text-[10px] sm:text-xs font-bold tracking-wider uppercase animate-float flex items-center space-x-1.5 shadow-lg shadow-amber-500/10">
              <i className="fa-solid fa-award"></i>
              <span>{t.ctaBonusBadge}</span>
            </div>

            <h2 className="font-semibold tracking-tight mb-6 serif-title italic" style={{ color: 'var(--text-main)', fontSize: '36px', height: '40px', lineHeight: '36px' }}>{t.ctaTitle}</h2>
            <p className="text-base sm:text-xl max-w-xl mx-auto leading-relaxed font-light text-center" style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: '28px', height: '90px', width: '737.4px', marginLeft: 'auto', marginRight: '0px', marginTop: '0px', marginBottom: '40px', paddingBottom: '0px', paddingTop: '0px', paddingLeft: '0px', paddingRight: '0px', borderRadius: '0px', borderWidth: '0px', maxWidth: '100%', fontFamily: 'Georgia' }}>
              {t.ctaSubtitle}
            </p>

            <a 
              href={referralLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex px-5 py-3 sm:px-8 sm:py-3.5 rounded-xl honey-gradient text-slate-950 text-xs sm:text-base font-bold space-x-3 items-center justify-center shadow-xl shadow-amber-500/10 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer animate-pulse-glow"
            >
              <i className="fa-solid fa-user-plus"></i>
              <span style={{ fontFamily: 'Georgia' }}>{t.ctaBtn}</span>
            </a>
          </div>
        </div>
      </section>
        </>
      ) : currentPage === 'guide' ? (
        <GuidePage
          lang={lang}
          theme={theme}
          referralLink={referralLink}
          onSpinClick={() => {
            setCurrentPage('home');
            setTimeout(() => {
              const element = document.getElementById('wheel');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }, 300);
          }}
          onBack={() => setCurrentPage('home')}
        />
      ) : (
        <AboutPage
          lang={lang}
          theme={theme}
          referralLink={referralLink}
          onBack={() => setCurrentPage('home')}
          onGuideClick={() => setCurrentPage('guide')}
        />
      )}

      {/* ПОДВАЛ (FOOTER) */}
      <motion.footer 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="pt-8 sm:pt-10 pb-0 relative overflow-hidden" 
        style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}
      >
        {/* Верхняя светящаяся линия с градиентом */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#f6b026]/50 to-transparent" />
        
        {/* Центральное радиальное свечение */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] sm:w-[580px] h-[40px] sm:h-[80px] bg-gradient-to-b from-[#f6b026]/12 via-[#f28c28]/4 to-transparent blur-xl pointer-events-none rounded-full animate-pulse-glow" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-6">
            
            {/* Логотип */}
            <a href="#" className="flex items-center space-x-2.5 group" style={{ fontFamily: 'Georgia' }}>
              <div className="w-8 h-8 rounded-lg honey-gradient flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/10 group-hover:scale-110 group-hover:shadow-[#f6b026]/30 transition-all duration-300">
                <span>H</span>
              </div>
              <span className="text-lg tracking-tight font-semibold group-hover:text-honey transition-colors duration-300" style={{ color: 'var(--text-main)' }}>
                HoneyGain<span className="text-honey font-bold">.store</span>
              </span>
            </a>

            {/* Ссылка */}
            <div className="text-xs sm:text-sm font-semibold tracking-wide">
              <a href={referralLink} target="_blank" rel="noopener noreferrer" className="text-[#f6b026] hover:text-[#f28c28] hover:underline flex items-center space-x-1.5 transition-colors duration-200">
                <span style={{ fontFamily: 'Georgia' }}>{t.footerLinkText}</span>
                <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
              </a>
            </div>

            {/* Соцсети */}
            <div className="flex items-center space-x-4">
              <a href="https://t.me/vadimmartin" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-[#f6b026] hover:scale-110 hover:shadow-[#f6b026]/20 hover:text-white hover:border-amber-500/40 transition-all duration-300" title="Telegram">
                <i className="fa-brands fa-telegram text-base"></i>
              </a>
              <button 
                onClick={() => setShowPopup(true)} 
                className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-[#f6b026] hover:scale-110 hover:shadow-[#f6b026]/20 hover:text-white hover:border-amber-500/40 transition-all duration-300 cursor-pointer" 
                title="YouTube"
              >
                <i className="fa-brands fa-youtube text-base"></i>
              </button>
              <button 
                onClick={() => setShowPopup(true)} 
                className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-[#f6b026] hover:scale-110 hover:shadow-[#f6b026]/20 hover:text-white hover:border-amber-500/40 transition-all duration-300 cursor-pointer" 
                title="Twitter"
              >
                <i className="fa-brands fa-twitter text-base"></i>
              </button>
            </div>

          </div>

          {/* Дисклеймер и копирайт */}
          <div className="border-t pt-5 relative" style={{ borderColor: 'var(--card-border)' }}>
            <p className="text-center text-[9px] sm:text-[10px] leading-relaxed max-w-4xl mx-auto mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
              {t.footerDisclaimer}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mb-3 text-xs font-semibold mx-auto" style={{ fontFamily: 'Georgia' }}>
              <button 
                onClick={() => setShowPrivacyPopup(true)} 
                className="text-[#f6b026] hover:text-[#f28c28] hover:underline cursor-pointer transition-colors duration-200"
              >
                {t.privacyTitle}
              </button>
              <span className="opacity-20" style={{ color: 'var(--text-muted)' }}>|</span>
              <button 
                onClick={() => setShowRulesPopup(true)} 
                className="text-[#f6b026] hover:text-[#f28c28] hover:underline cursor-pointer transition-colors duration-200"
              >
                {t.rulesTitle}
              </button>
            </div>
            <p className="text-center text-[10px] sm:text-xs font-medium" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
              &copy; 2026 HoneyGain.store. {t.footerRights}
            </p>
          </div>
        </div>
      </motion.footer>

      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Задний фон / Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPopup(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
            />
            {/* Окно / Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-sm rounded-2xl p-6 md:p-8 text-center border overflow-hidden shadow-2xl glass-card z-10"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', fontFamily: 'Georgia' }}
            >
              {/* Декоративное свечение */}
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-[#f6b026]/10 blur-xl" />
              <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-[#f28c28]/10 blur-xl" />

              {/* Иконка */}
              <div className="mx-auto w-16 h-16 rounded-full bg-[#f6b026]/10 border border-[#f6b026]/20 flex items-center justify-center text-2xl text-[#f6b026] mb-5 shadow-inner">
                <i className="fa-solid fa-screwdriver-wrench animate-pulse"></i>
              </div>

              {/* Заголовок */}
              <h3 className="text-xl font-bold mb-3 tracking-tight" style={{ color: 'var(--text-main)' }}>
                {lang === 'ru' ? 'В разработке' : 'Under development'}
              </h3>

              {/* Текст */}
              <p className="text-sm leading-relaxed mb-6 text-balance" style={{ color: 'var(--text-muted)' }}>
                {lang === 'ru' 
                  ? 'В разработке. Скоро будет доступно. Следите за новостями!' 
                  : 'Under development. Coming soon. Stay tuned for news!'}
              </p>

              {/* Кнопка закрытия */}
              <button 
                onClick={() => setShowPopup(false)}
                className="w-full py-3 px-5 rounded-xl honey-gradient text-slate-950 font-bold text-sm tracking-wide uppercase shadow-lg shadow-amber-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                {lang === 'ru' ? 'Хорошо, буду ждать' : 'Great, I\'ll stay tuned'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTermsPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Задний фон / Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTermsPopup(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
            />
            {/* Окно / Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-lg rounded-2xl p-6 sm:p-8 border overflow-hidden shadow-2xl glass-card z-10 max-h-[85vh] flex flex-col"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', fontFamily: 'Georgia' }}
            >
              {/* Декоративное свечение */}
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-[#f6b026]/10 blur-xl" />
              <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-[#f28c28]/10 blur-xl" />

              {/* Заголовок */}
              <h3 className="text-xl sm:text-2xl font-bold mb-5 tracking-tight serif-title italic text-honey flex items-center space-x-2 flex-shrink-0" id="terms-title">
                <i className="fa-solid fa-file-contract text-lg"></i>
                <span>{t.contestTermsTitle}</span>
              </h3>

              {/* Текст условий (скроллящийся список) */}
              <div className="overflow-y-auto pr-2 mb-6 text-left space-y-4 font-light text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
                <div className="flex items-start space-x-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <p>{t.contestTerms1}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <p>{t.contestTerms2}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <p>{t.contestTerms3}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <p>{t.contestTerms4}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <p>{t.contestTerms5}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <p>{t.contestTerms6}</p>
                </div>
              </div>

              {/* Кнопка закрытия */}
              <button 
                onClick={() => setShowTermsPopup(false)}
                className="w-full py-3 px-5 rounded-xl honey-gradient text-slate-950 font-bold text-sm tracking-wide uppercase shadow-lg shadow-amber-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex-shrink-0"
              >
                {lang === 'ru' ? 'Закрыть условия' : 'Close terms'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPrivacyPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Задний фон / Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPrivacyPopup(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
            />
            {/* Окно / Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-lg rounded-2xl p-6 sm:p-8 border overflow-hidden shadow-2xl glass-card z-10 max-h-[85vh] flex flex-col"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', fontFamily: 'Georgia' }}
            >
              {/* Декоративное свечение */}
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-[#f6b026]/10 blur-xl" />
              <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-[#f28c28]/10 blur-xl" />

              {/* Заголовок */}
              <h3 className="text-xl sm:text-2xl font-bold mb-5 tracking-tight serif-title italic text-honey flex items-center space-x-2 flex-shrink-0" id="privacy-title">
                <i className="fa-solid fa-shield-halved text-lg"></i>
                <span>{t.privacyTitle}</span>
              </h3>

              {/* Текст (скроллящийся список) */}
              <div className="overflow-y-auto pr-2 mb-6 text-left space-y-4 font-light text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
                <div className="flex items-start space-x-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <p>{t.privacyP1}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <p>{t.privacyP2}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <p>{t.privacyP3}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <p>{t.privacyP4}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <p>{t.privacyP5}</p>
                </div>
              </div>

              {/* Кнопка закрытия */}
              <button 
                onClick={() => setShowPrivacyPopup(false)}
                className="w-full py-3 px-5 rounded-xl honey-gradient text-slate-950 font-bold text-sm tracking-wide uppercase shadow-lg shadow-amber-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex-shrink-0"
              >
                {lang === 'ru' ? 'Закрыть' : 'Close'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRulesPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Задний фон / Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRulesPopup(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
            />
            {/* Окно / Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-lg rounded-2xl p-6 sm:p-8 border overflow-hidden shadow-2xl glass-card z-10 max-h-[85vh] flex flex-col"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', fontFamily: 'Georgia' }}
            >
              {/* Декоративное свечение */}
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-[#f6b026]/10 blur-xl" />
              <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-[#f28c28]/10 blur-xl" />

              {/* Заголовок */}
              <h3 className="text-xl sm:text-2xl font-bold mb-5 tracking-tight serif-title italic text-honey flex items-center space-x-2 flex-shrink-0" id="rules-title">
                <i className="fa-solid fa-scale-balanced text-lg"></i>
                <span>{t.rulesTitle}</span>
              </h3>

              {/* Текст (скроллящийся список) */}
              <div className="overflow-y-auto pr-2 mb-6 text-left space-y-4 font-light text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
                <div className="flex items-start space-x-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <p>{t.rules1}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <p>{t.rules2}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <p>{t.rules3}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <p>{t.rules4}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <p>{t.rules5}</p>
                </div>
              </div>

              {/* Кнопка закрытия */}
              <button 
                onClick={() => setShowRulesPopup(false)}
                className="w-full py-3 px-5 rounded-xl honey-gradient text-slate-950 font-bold text-sm tracking-wide uppercase shadow-lg shadow-amber-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex-shrink-0"
              >
                {lang === 'ru' ? 'Закрыть' : 'Close'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Кнопка прокрутки наверх */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 left-6 sm:bottom-8 sm:left-8 z-40 w-12 h-12 rounded-full honey-gradient text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-110 active:scale-95 transition-all cursor-pointer group"
            id="scroll-to-top"
            title={lang === 'ru' ? 'Наверх' : 'Scroll to top'}
          >
            <i className="fa-solid fa-arrow-up text-lg group-hover:-translate-y-0.5 transition-transform"></i>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Подтверждение файлов cookie */}
      <AnimatePresence>
        {showCookieConsent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 left-6 md:left-auto md:w-full md:max-w-sm rounded-2xl p-5 border overflow-hidden shadow-2xl glass-card z-50 flex flex-col gap-4"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', fontFamily: 'Georgia' }}
          >
            {/* Декоративное свечение */}
            <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-[#f6b026]/10 blur-xl pointer-events-none" />
            
            <div className="flex items-start space-x-3.5 relative z-10">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0">
                <i className="fa-solid fa-cookie-bite text-lg"></i>
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-sm font-bold text-honey tracking-tight uppercase mb-1" style={{ fontFamily: 'Georgia' }}>
                  {lang === 'ru' ? 'Файлы Cookie' : 'Cookie Files'}
                </h4>
                <p className="text-[11px] sm:text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {t.cookieConsentText}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 relative z-10">
              <button
                onClick={() => setShowPrivacyPopup(true)}
                className="text-xs font-semibold text-amber-500 hover:text-amber-400 hover:underline cursor-pointer transition-colors"
              >
                {t.cookieConsentLearnMore}
              </button>
              <button
                onClick={handleAcceptCookies}
                className="py-2 px-4 rounded-xl honey-gradient text-slate-950 font-bold text-xs tracking-wide uppercase shadow-md shadow-amber-500/10 hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer"
              >
                {t.cookieConsentAccept}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Всплывающие уведомления активности (Временно отключено по запросу) */}
      {/* <NotificationToast lang={lang} /> */}

      {/* Дружелюбный AI-консультант */}
      <AIConsultant lang={lang} />

      {/* ГЛОБАЛЬНОЕ ОКНО АВТОРИЗАЦИИ */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        lang={lang} 
        onLoginSuccess={(userData) => setUser(userData)} 
      />

    </div>
  );
}
