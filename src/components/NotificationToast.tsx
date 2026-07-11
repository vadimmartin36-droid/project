import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface NameItem {
  name: string;
  gender: 'male' | 'female';
  initials: string;
}

const NAMES: NameItem[] = [
  // Русские
  { name: 'Александр', gender: 'male', initials: 'А' },
  { name: 'Дмитрий', gender: 'male', initials: 'Д' },
  { name: 'Сергей', gender: 'male', initials: 'С' },
  { name: 'Алексей', gender: 'male', initials: 'А' },
  { name: 'Иван', gender: 'male', initials: 'И' },
  { name: 'Екатерина', gender: 'female', initials: 'Е' },
  { name: 'Ольга', gender: 'female', initials: 'О' },
  { name: 'Анна', gender: 'female', initials: 'А' },
  { name: 'Татьяна', gender: 'female', initials: 'Т' },
  { name: 'Мария', gender: 'female', initials: 'М' },
  
  // Английские
  { name: 'James', gender: 'male', initials: 'J' },
  { name: 'Oliver', gender: 'male', initials: 'O' },
  { name: 'William', gender: 'male', initials: 'W' },
  { name: 'Henry', gender: 'male', initials: 'H' },
  { name: 'George', gender: 'male', initials: 'G' },
  { name: 'Emma', gender: 'female', initials: 'E' },
  { name: 'Sophia', gender: 'female', initials: 'S' },
  { name: 'Charlotte', gender: 'female', initials: 'C' },
  { name: 'Amelia', gender: 'female', initials: 'A' },
  { name: 'Lily', gender: 'female', initials: 'L' },

  // Немецкие
  { name: 'Lukas', gender: 'male', initials: 'L' },
  { name: 'Maximilian', gender: 'male', initials: 'M' },
  { name: 'Felix', gender: 'male', initials: 'F' },
  { name: 'Moritz', gender: 'male', initials: 'M' },
  { name: 'Paul', gender: 'male', initials: 'P' },
  { name: 'Hannah', gender: 'female', initials: 'H' },
  { name: 'Lea', gender: 'female', initials: 'L' },
  { name: 'Laura', gender: 'female', initials: 'L' },
  { name: 'Julia', gender: 'female', initials: 'J' },
  { name: 'Sophie', gender: 'female', initials: 'S' },

  // Французские
  { name: 'Louis', gender: 'male', initials: 'L' },
  { name: 'Hugo', gender: 'male', initials: 'H' },
  { name: 'Gabriel', gender: 'male', initials: 'G' },
  { name: 'Raphaël', gender: 'male', initials: 'R' },
  { name: 'Arthur', gender: 'male', initials: 'A' },
  { name: 'Camille', gender: 'female', initials: 'C' },
  { name: 'Léa', gender: 'female', initials: 'L' },
  { name: 'Chloé', gender: 'female', initials: 'C' },
  { name: 'Inès', gender: 'female', initials: 'I' },
  { name: 'Manon', gender: 'female', initials: 'M' },

  // Испанские
  { name: 'Mateo', gender: 'male', initials: 'M' },
  { name: 'Santiago', gender: 'male', initials: 'S' },
  { name: 'Diego', gender: 'male', initials: 'D' },
  { name: 'Andrés', gender: 'male', initials: 'A' },
  { name: 'Javier', gender: 'male', initials: 'J' },
  { name: 'Valentina', gender: 'female', initials: 'V' },
  { name: 'Isabella', gender: 'female', initials: 'I' },
  { name: 'Camila', gender: 'female', initials: 'C' },
  { name: 'Lucía', gender: 'female', initials: 'L' },
  { name: 'María', gender: 'female', initials: 'M' },

  // Итальянские
  { name: 'Leonardo', gender: 'male', initials: 'L' },
  { name: 'Alessandro', gender: 'male', initials: 'A' },
  { name: 'Francesco', gender: 'male', initials: 'F' },
  { name: 'Marco', gender: 'male', initials: 'M' },
  { name: 'Andrea', gender: 'male', initials: 'A' },
  { name: 'Sofia', gender: 'female', initials: 'S' },
  { name: 'Giulia', gender: 'female', initials: 'G' },
  { name: 'Aurora', gender: 'female', initials: 'A' },
  { name: 'Ginevra', gender: 'female', initials: 'G' },
  { name: 'Alice', gender: 'female', initials: 'A' },

  // Китайские
  { name: 'Wei', gender: 'male', initials: 'W' },
  { name: 'Chen', gender: 'male', initials: 'C' },
  { name: 'Li', gender: 'male', initials: 'L' },
  { name: 'Wang', gender: 'male', initials: 'W' },
  { name: 'Zhang', gender: 'male', initials: 'Z' },
  { name: 'Yuki', gender: 'female', initials: 'Y' },
  { name: 'Mei', gender: 'female', initials: 'M' },
  { name: 'Xia', gender: 'female', initials: 'X' },
  { name: 'Jing', gender: 'female', initials: 'J' },
  { name: 'Lin', gender: 'female', initials: 'L' },

  // Арабские
  { name: 'Mohammed', gender: 'male', initials: 'M' },
  { name: 'Ahmed', gender: 'male', initials: 'A' },
  { name: 'Ali', gender: 'male', initials: 'A' },
  { name: 'Ibrahim', gender: 'male', initials: 'I' },
  { name: 'Hassan', gender: 'male', initials: 'H' },
  { name: 'Fatima', gender: 'female', initials: 'F' },
  { name: 'Khadija', gender: 'female', initials: 'K' },
  { name: 'Aisha', gender: 'female', initials: 'A' },
  { name: 'Noor', gender: 'female', initials: 'N' },
  { name: 'Layla', gender: 'female', initials: 'L' },

  // Индийские
  { name: 'Arjun', gender: 'male', initials: 'A' },
  { name: 'Rohan', gender: 'male', initials: 'R' },
  { name: 'Vikram', gender: 'male', initials: 'V' },
  { name: 'Karan', gender: 'male', initials: 'K' },
  { name: 'Raj', gender: 'male', initials: 'R' },
  { name: 'Ananya', gender: 'female', initials: 'A' },
  { name: 'Priya', gender: 'female', initials: 'P' },
  { name: 'Neha', gender: 'female', initials: 'N' },
  { name: 'Sneha', gender: 'female', initials: 'S' },
  { name: 'Deepika', gender: 'female', initials: 'D' }
];

type ActionType = 'link' | 'signup' | 'bonus' | 'earn' | 'app';

interface ActionTexts {
  ru: { male: string; female: string };
  en: string;
  icon: string;
  colorClass: string;
}

const ACTIONS: Record<ActionType, ActionTexts> = {
  link: {
    ru: { male: 'перешёл по ссылке', female: 'перешла по ссылке' },
    en: 'followed the link',
    icon: '🔗',
    colorClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
  },
  signup: {
    ru: { male: 'зарегистрировался', female: 'зарегистрировалась' },
    en: 'signed up',
    icon: '👤',
    colorClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
  },
  bonus: {
    ru: { male: 'получил бонус $3', female: 'получила бонус $3' },
    en: 'got $3 bonus',
    icon: '🎁',
    colorClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  },
  earn: {
    ru: { male: 'начал зарабатывать', female: 'начала зарабатывать' },
    en: 'started earning',
    icon: '⚡',
    colorClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
  },
  app: {
    ru: { male: 'установил приложение', female: 'установила приложение' },
    en: 'installed the app',
    icon: '📱',
    colorClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
  }
};

interface NotificationToastProps {
  lang: 'ru' | 'en';
}

interface ActiveNotification {
  id: number;
  name: string;
  initials: string;
  actionText: string;
  icon: string;
  colorClass: string;
  timeAgo: string;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ lang }) => {
  const [notification, setNotification] = useState<ActiveNotification | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let active = true;

    const showRandomNotification = () => {
      if (!active) return;

      // Выбираем случайное имя
      const nameObj = NAMES[Math.floor(Math.random() * NAMES.length)];
      // Выбираем случайное действие
      const actionKeys = Object.keys(ACTIONS) as ActionType[];
      const actionKey = actionKeys[Math.floor(Math.random() * actionKeys.length)];
      const actionObj = ACTIONS[actionKey];

      // Текст действия в зависимости от языка и пола
      const actionText = lang === 'ru' 
        ? (nameObj.gender === 'male' ? actionObj.ru.male : actionObj.ru.female)
        : actionObj.en;

      const timeTexts = lang === 'ru'
        ? ['только что', '1 мин. назад', '2 мин. назад', '30 сек. назад']
        : ['just now', '1 min ago', '2 min ago', '30s ago'];
      const timeAgo = timeTexts[Math.floor(Math.random() * timeTexts.length)];

      setNotification({
        id: Date.now(),
        name: nameObj.name,
        initials: nameObj.initials,
        actionText,
        icon: actionObj.icon,
        colorClass: actionObj.colorClass,
        timeAgo
      });

      // Скрываем через 5.5 секунд
      timeoutId = setTimeout(() => {
        setNotification(null);

        // Планируем следующее появление через 8-15 секунд после исчезновения предыдущего
        const nextInterval = Math.floor(Math.random() * (15000 - 8000 + 1)) + 8000;
        timeoutId = setTimeout(showRandomNotification, nextInterval);
      }, 5500);
    };

    // Первое появление через 4 секунды после загрузки
    const initialTimeout = setTimeout(showRandomNotification, 4000);

    return () => {
      active = false;
      clearTimeout(initialTimeout);
      clearTimeout(timeoutId);
    };
  }, [lang]);

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 pointer-events-none select-none max-w-sm w-[calc(100vw-3rem)]">
      <AnimatePresence mode="wait">
        {notification && (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 30, scale: 0.92, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, scale: 0.95, filter: 'blur(4px)', transition: { duration: 0.25, ease: 'easeIn' } }}
            className="w-full p-4 rounded-2xl border backdrop-blur-xl flex items-center space-x-3.5 pointer-events-auto relative overflow-hidden group transition-all duration-300 hover:shadow-amber-500/10 dark:hover:shadow-amber-500/5"
            style={{ 
              backgroundColor: 'var(--header-bg)',
              borderColor: 'var(--card-border)',
              boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.25), 0 1px 3px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255,255,255,0.1)',
              fontFamily: 'Georgia',
            }}
          >
            {/* Аватар с индикатором активности */}
            <div className="relative flex-shrink-0">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold border transition-all duration-300 shadow-md group-hover:scale-105 ${notification.colorClass}`}>
                <span>{notification.initials}</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            </div>

            {/* Контент */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center space-x-1.5 mb-0.5">
                <span className="text-[10px] font-bold tracking-wider uppercase text-amber-500 dark:text-amber-400" style={{ fontFamily: 'Georgia' }}>
                  {lang === 'ru' ? 'Активность' : 'Activity'}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                <span className="text-[10px] font-light flex items-center" style={{ color: 'var(--text-muted)' }}>
                  <i className="fa-regular fa-clock mr-1 text-[9px]"></i>
                  {notification.timeAgo}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-normal leading-snug" style={{ color: 'var(--text-main)' }}>
                <span className="font-bold text-slate-800 dark:text-slate-100">{notification.name}</span>{' '}
                <span className="font-light" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>{notification.actionText}</span>
              </p>
            </div>

            {/* Иконка статуса */}
            <div className="w-9 h-9 rounded-full bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-center text-base flex-shrink-0 shadow-inner group-hover:rotate-12 transition-transform duration-300 select-none">
              {notification.icon}
            </div>

            {/* Тонкий анимированный индикатор оставшегося времени */}
            <motion.div 
              initial={{ width: "100%" }} 
              animate={{ width: "0%" }} 
              transition={{ duration: 5.5, ease: "linear" }} 
              className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 rounded-b-2xl" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
