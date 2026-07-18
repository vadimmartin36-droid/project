import React from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  BookOpen, 
  TrendingUp, 
  Award, 
  ArrowLeft, 
  Sparkles, 
  History, 
  DollarSign, 
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

interface AboutPageProps {
  lang: 'ru' | 'en';
  theme: 'dark' | 'light';
  referralLink: string;
  onBack: () => void;
  onGuideClick: () => void;
}

export function AboutPage({ lang, theme, referralLink, onBack, onGuideClick }: AboutPageProps) {
  const t = {
    ru: {
      badge: "👋 Давайте знакомиться!",
      title: "Обо мне и моем пути",
      titleHighlight: "в Honeygain",
      subtitle: "Реальная история обычного пользователя: от полного скептицизма и первой выплаты до создания крупной реферальной сети и стабильного пассивного дохода.",
      backBtn: "На главную",
      guideBtn: "База знаний",
      
      // Блок ключевых показателей (Stats Grid)
      statsExperience: "Опыт в проекте",
      statsExperienceVal: "3+ года",
      statsDevices: "Активных устройств",
      statsDevicesVal: "6 устройств",
      statsEarned: "Всего заработано",
      statsEarnedVal: "$4,500+",
      statsNetwork: "Реферальная сеть",
      statsNetworkVal: "1,450+ чел.",

      // История автора (My Story)
      storyTitle: "Как всё начиналось: моя история",
      storyP1: "Привет! Меня зовут Вадим. Как и многие из вас, я долгое время искал способ получать реальный пассивный доход в интернете. Большинство сайтов предлагали копеечные клики, просмотр бесконечной рекламы или требовали огромных вложений времени и денег. Всё изменилось в конце 2022 года, когда я случайно наткнулся на Honeygain.",
      storyP2: "Признаюсь честно: сначала я был жутким скептиком. Раздавать свой интернет чужим людям? 'Наверняка это вирус или способ украсть мои пароли', — думал я. Но детальное изучение технологий безопасности и сертификатов компании меня успокоило. Я установил приложение на свой старый ноутбук и телефон, просто чтобы протестировать.",
      storyP3: "Через три недели я накопил первые $20 и заказал выплату на PayPal. Когда деньги действительно пришли на мой счет на следующий день, у меня буквально открылись глаза! Я понял, что нашел золотую жилу — полностью пассивный заработок на неиспользуемой пропускной способности, который не требует ни секунды моего времени.",

      // Этапы роста (Growth milestones)
      milestonesTitle: "Ключевые этапы моего успеха",
      m1Date: "Декабрь 2022",
      m1Title: "Первый запуск",
      m1Desc: "Установка на 1 ПК и 1 смартфон. Старт с абсолютного нуля без рефералов. Проверка безопасности и стабильности трафика.",
      
      m2Date: "Март 2023",
      m2Title: "Первая выплата & Масштаб",
      m2Desc: "Успешный вывод первых $20. Подключение домашнего ПК, рабочего ноутбука и мобильного интернета родителей для ускорения начислений.",
      
      m3Date: "Октябрь 2023",
      m3Title: "Включение Content Delivery",
      m3Desc: "Активация режима CD на Windows. Доход вырос почти в 4 раза благодаря постоянному участию в приоритетном обмене трафиком.",
      
      m4Date: "2024 - 2026",
       m4Title: "Создание Honeygain.store & Сеть",
      m4Desc: "Запуск этого информационного сайта, чтобы делиться тактиками. Сеть выросла до 1,400+ активных партнеров, приносящих стабильный процент.",

      // Мои правила & Советы (My tips)
      tipsTitle: "3 главных совета для новичков",
      tipsSubtitle: "Если бы я начинал заново сегодня, я бы с первого дня делал именно это:",
      
      tip1Title: "Не держите приложение выключенным",
      tip1Desc: "Honeygain платит за стабильное присутствие в сети. Настройте автозапуск приложения при включении компьютера или телефона и забудьте о нем. Пусть оно работает тихо в фоне.",
      
      tip2Title: "Используйте разные IP-адреса",
      tip2Desc: "Honeygain разрешает только 1 активное устройство на 1 IP-адрес. Если подключить 3 телефона к одному домашнему Wi-Fi, они будут делить скорость и приносить меньше. Раскидайте их по разным сетям!",
      
      tip3Title: "Обязательно забирайте бонус $3",
      tip3Desc: "Новые пользователи часто регистрируются напрямую и теряют бесплатные стартовые $3. Используйте мою ссылку, чтобы получить этот бонус мгновенно на ваш баланс и начать путь не с нуля.",

      // Призыв к действию (CTA Section)
      ctaTitle: "Начните свою историю успеха прямо сейчас!",
      ctaDesc: "Зарегистрируйтесь по моей партнерской ссылке, получите приветственные $3.00 на счет и начните зарабатывать на полном пассиве уже через 5 минут.",
      ctaBtn: "Забрать $3.00 и начать заработок 🍯",
      footerVerified: "Официальный амбассадор Honeygain • 100% честные выплаты"
    },
    en: {
      badge: "👋 Let's get acquainted!",
      title: "About Me & My Journey",
      titleHighlight: "with Honeygain",
      subtitle: "A real story of a regular user: from complete skepticism and the first $20 payout to building a large referral network and steady passive income.",
      backBtn: "Back to Home",
      guideBtn: "Knowledge Base",
      
      // Stats Grid
      statsExperience: "Project Experience",
      statsExperienceVal: "3+ Years",
      statsDevices: "Active Devices",
      statsDevicesVal: "6 Devices",
      statsEarned: "Total Earned",
      statsEarnedVal: "$4,500+",
      statsNetwork: "Referral Network",
      statsNetworkVal: "1,450+ users",

      // Story
      storyTitle: "How It All Began: My Story",
      storyP1: "Hello! My name is Vadim. Like many of you, I spent a long time searching for genuine passive income methods online. Most sites offered tiny fractions of a cent for clicks, watching endless ads, or required huge time investments. Everything changed in late 2022 when I stumbled upon Honeygain.",
      storyP2: "To be honest: I was extremely skeptical at first. Sharing my internet bandwidth with strangers? 'It's probably a virus or a way to steal my passwords,' I thought. But after thoroughly researching their security practices and corporate structure, I felt reassured. I installed it on my old laptop and phone just to test it out.",
      storyP3: "After three weeks, I reached the first $20 and requested a payout via PayPal. When the money landed in my account the very next day, my eyes were opened! I realized I had found a gold mine — a fully passive way to monetize unused bandwidth that requires zero maintenance.",

      // Milestones
      milestonesTitle: "Key Milestones of My Success",
      m1Date: "December 2022",
      m1Title: "First Launch",
      m1Desc: "Installed the app on 1 PC and 1 smartphone. Started from absolute scratch with zero referrals. Checked the battery drain and safety protocols.",
      
      m2Date: "March 2023",
      m2Title: "First Payout & Scaling",
      m2Desc: "Successfully withdrew the first $20. Added my home PC, work laptop, and parents' mobile internet to accelerate daily accumulation.",
      
      m3Date: "October 2023",
      m3Title: "Enabled Content Delivery",
      m3Desc: "Activated the CD mode on Windows. Income quadrupled as my devices began participating in high-priority media stream distributions.",
      
      m4Date: "2024 - 2026",
      m4Title: "Honeygain.store Launch",
      m4Desc: "Created this portal to share tactics. Expanded the community to over 1,400 active partners, generating reliable compounding affiliate bonuses.",

      // Tips
      tipsTitle: "3 Ultimate Tips for Beginners",
      tipsSubtitle: "If I were starting over today, I would strictly follow these rules from Day 1:",
      
      tip1Title: "Keep the application active",
      tip1Desc: "Honeygain pays for stable presence. Set the app to autostart on system boot or phone startup, and let it do its magic silently in the background.",
      
      tip2Title: "Utilize distinct IP addresses",
      tip2Desc: "Honeygain allows only 1 active device per unique IP. If you connect 3 phones to the same home Wi-Fi, they will split the bandwidth. Distribute them across different networks!",
      
      tip3Title: "Always claim your starting $3 bonus",
      tip3Desc: "New users often register directly and miss out on the free starting $3. Use my affiliate link to get this bonus on your balance instantly.",

      // CTA
      ctaTitle: "Start Your Success Story Today!",
      ctaDesc: "Register via my exclusive partner link, grab your welcome $3.00 gift, and configure your fully passive digital asset in less than 5 minutes.",
      ctaBtn: "Claim $3.00 & Start Earnings 🍯",
      footerVerified: "Official Honeygain Ambassador • 100% Trusted Payouts"
    }
  };

  const curr = t[lang];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 relative z-10"
    >
      {/* Кнопка "Назад" */}
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={onBack}
          className="h-10 px-4 rounded-full glass-card flex items-center space-x-2 text-xs sm:text-sm font-semibold cursor-pointer hover:scale-105 active:scale-95 transition-all text-[var(--text-main)] hover:text-honey border border-[var(--card-border)]"
          style={{ fontFamily: 'Georgia' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{curr.backBtn}</span>
        </button>

        <button 
          onClick={onGuideClick}
          className="h-10 px-4 rounded-full glass-card flex items-center space-x-2 text-xs sm:text-sm font-semibold cursor-pointer hover:scale-105 active:scale-95 transition-all text-honey border border-honey/20"
          style={{ fontFamily: 'Georgia' }}
        >
          <BookOpen className="w-4 h-4 text-[#f6b026]" />
          <span>{curr.guideBtn}</span>
        </button>
      </div>

      {/* ГЕРОЙ-БЛОК СТРАНИЦЫ */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        {/* Бейдж */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#f6b026]/10 text-[#f6b026] text-xs font-semibold tracking-wider uppercase mb-6 border border-[#f6b026]/20 animate-float">
          <Sparkles className="w-3.5 h-3.5 text-[#f6b026] animate-pulse" />
          <span style={{ fontFamily: 'Georgia' }}>{curr.badge}</span>
        </div>

        {/* Заголовок */}
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight serif-title italic text-balance mb-6" style={{ color: 'var(--text-main)', fontFamily: 'Georgia' }}>
          {curr.title}{' '}
          <span className="text-honey">
            {curr.titleHighlight}
          </span>
        </h1>

        {/* Описание */}
        <p className="text-base sm:text-lg leading-relaxed font-light max-w-2xl mx-auto" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
          {curr.subtitle}
        </p>
      </div>

      {/* СЕТКА ПОКАЗАТЕЛЕЙ (STATS GRID) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
        {[
          { icon: History, label: curr.statsExperience, val: curr.statsExperienceVal },
          { icon: Award, label: curr.statsDevices, val: curr.statsDevicesVal },
          { icon: DollarSign, label: curr.statsEarned, val: curr.statsEarnedVal, highlight: true },
          { icon: TrendingUp, label: curr.statsNetwork, val: curr.statsNetworkVal }
        ].map((item, idx) => (
          <div 
            key={idx} 
            className={`glass-card p-5 sm:p-6 rounded-2xl border text-center relative overflow-hidden transition-all duration-300 hover:scale-[1.03] ${item.highlight ? 'border-[#f6b026]/40 shadow-lg shadow-amber-500/5' : 'border-[var(--card-border)]'}`}
            style={{ backgroundColor: 'var(--card-bg)' }}
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-bl-full pointer-events-none" />
            <div className={`mx-auto w-10 h-10 rounded-xl flex items-center justify-center mb-4 border ${item.highlight ? 'bg-[#f6b026]/20 border-[#f6b026]/30 text-[#f6b026]' : 'bg-white/5 border-white/10 text-[var(--text-muted)]'}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
              {item.label}
            </div>
            <div className={`text-xl sm:text-2xl font-black ${item.highlight ? 'text-honey' : 'text-white'}`} style={{ fontFamily: 'Georgia' }}>
              {item.val}
            </div>
          </div>
        ))}
      </div>

      {/* БЛОК ИСТОРИИ И ФОТО */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-20">
        {/* Слева: Текстовый рассказ */}
        <div className="lg:col-span-7 text-left space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold serif-title italic text-honey" style={{ fontFamily: 'Georgia' }}>
            {curr.storyTitle}
          </h2>
          <div className="text-sm sm:text-base leading-relaxed space-y-5 font-light" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
            <p>{curr.storyP1}</p>
            <p>{curr.storyP2}</p>
            <p>{curr.storyP3}</p>
          </div>
        </div>

        {/* Справа: Красивая визуализация личного бренда */}
        <div className="lg:col-span-5 relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#f6b026]/20 to-[#f28c28]/20 rounded-3xl blur-xl opacity-70 animate-pulse-glow" />
          <div className="relative glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/20 text-center" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#f6b026] to-[#f28c28] mx-auto flex items-center justify-center text-slate-950 text-4xl font-bold shadow-lg shadow-amber-500/20 mb-6">
              <User className="w-12 h-12 text-slate-950" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Georgia' }}>
              Vadim Martin
            </h3>
            <p className="text-xs text-honey font-semibold tracking-wider uppercase mb-6" style={{ fontFamily: 'Georgia' }}>
              Honeygain Ambassador
            </p>

            <div className="border-t border-b border-white/5 py-4 my-4 space-y-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)] flex items-center gap-1.5" style={{ fontFamily: 'Georgia' }}>
                  <CheckCircle className="w-4 h-4 text-[#f6b026]" />
                  <span>Статус аккаунта:</span>
                </span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Verified Partner
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)] flex items-center gap-1.5" style={{ fontFamily: 'Georgia' }}>
                  <ShieldCheck className="w-4 h-4 text-[#f6b026]" />
                  <span>Безопасность:</span>
                </span>
                <span className="font-bold text-white flex items-center gap-1" style={{ fontFamily: 'Georgia' }}>
                  100% SSL Secured
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)] flex items-center gap-1.5" style={{ fontFamily: 'Georgia' }}>
                  <MessageSquare className="w-4 h-4 text-[#f6b026]" />
                  <span>Связь со мной:</span>
                </span>
                <a href="https://t.me/vadimmartin" target="_blank" rel="noopener noreferrer" className="font-bold text-honey hover:underline flex items-center gap-1">
                  @vadimmartin <i className="fa-brands fa-telegram text-xs"></i>
                </a>
              </div>
            </div>

            <p className="text-[11px] sm:text-xs leading-relaxed italic" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
              {lang === 'ru' 
                ? '«Моя миссия — показать людям, что пассивный доход доступен каждому без риска и вложений. Присоединяйтесь к моей команде!»' 
                : '“My mission is to demonstrate that passive income is accessible to anyone without risk or investments. Welcome to the team!”'}
            </p>
          </div>
        </div>
      </div>

      {/* ЭТАПЫ РОСТА (GROWTH TIMELINE) */}
      <div className="mb-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold serif-title italic text-honey mb-4" style={{ fontFamily: 'Georgia' }}>
          {curr.milestonesTitle}
        </h2>
        <div className="max-w-4xl mx-auto mt-12 relative border-l border-white/5 pl-6 sm:pl-8 space-y-10 text-left">
          {[
            { date: curr.m1Date, title: curr.m1Title, desc: curr.m1Desc },
            { date: curr.m2Date, title: curr.m2Title, desc: curr.m2Desc },
            { date: curr.m3Date, title: curr.m3Title, desc: curr.m3Desc },
            { date: curr.m4Date, title: curr.m4Title, desc: curr.m4Desc }
          ].map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Хронологическая точка на линии */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-[#f6b026] border-4 border-slate-950 shadow-md group-hover:scale-125 transition-transform duration-300" />
              
              <div className="glass-card p-5 sm:p-6 rounded-2xl border border-[var(--card-border)] relative transition-all duration-300 hover:border-amber-500/20 hover:translate-x-1" style={{ backgroundColor: 'var(--card-bg)' }}>
                <div className="text-xs font-bold text-honey mb-1.5" style={{ fontFamily: 'Georgia' }}>
                  {item.date}
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white mb-2" style={{ fontFamily: 'Georgia' }}>
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* СОВЕТЫ ДЛЯ НОВИЧКОВ */}
      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-[var(--card-border)] mb-20 text-left" style={{ backgroundColor: 'var(--card-bg)' }}>
        <h3 className="text-xl sm:text-2xl font-bold text-honey serif-title italic mb-2" style={{ fontFamily: 'Georgia' }}>
          {curr.tipsTitle}
        </h3>
        <p className="text-xs sm:text-sm mb-8 font-light" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
          {curr.tipsSubtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            { title: curr.tip1Title, desc: curr.tip1Desc, num: "1" },
            { title: curr.tip2Title, desc: curr.tip2Desc, num: "2" },
            { title: curr.tip3Title, desc: curr.tip3Desc, num: "3" }
          ].map((tip, idx) => (
            <div key={idx} className="space-y-3 relative pl-12">
              <div className="absolute left-0 top-0 w-8 h-8 rounded-lg bg-[#f6b026]/10 border border-[#f6b026]/20 flex items-center justify-center font-black text-honey text-sm" style={{ fontFamily: 'Georgia' }}>
                {tip.num}
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white" style={{ fontFamily: 'Georgia' }}>
                {tip.title}
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
                {tip.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ФИНАЛЬНЫЙ ПРИЗЫВ (CTA SECTION) */}
      <div className="glass-card p-8 sm:p-16 rounded-[32px] border border-amber-500/20 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-[500px] sm:h-[500px] rounded-full bg-[#f6b026]/5 blur-[100px] -z-10 animate-pulse-glow" />
        
        {/* Парящий бейдж */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full honey-gradient text-slate-950 text-[10px] sm:text-xs font-bold tracking-wider uppercase animate-float flex items-center space-x-1.5 shadow-lg shadow-amber-500/10">
          <Award className="w-3.5 h-3.5 text-slate-950" />
          <span>START BONUS</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight mb-4 serif-title italic text-honey" style={{ fontFamily: 'Georgia' }}>
          {curr.ctaTitle}
        </h2>
        
        <p className="text-sm sm:text-lg max-w-xl mx-auto leading-relaxed font-light mb-8" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
          {curr.ctaDesc}
        </p>

        <a 
          href={referralLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex px-6 py-3.5 sm:px-12 sm:py-5 rounded-xl honey-gradient text-slate-950 text-xs sm:text-lg font-bold space-x-3 items-center justify-center shadow-xl shadow-amber-500/10 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer animate-pulse-glow"
          style={{ fontFamily: 'Georgia' }}
        >
          <span style={{ fontWeight: 'bold' }}>{curr.ctaBtn}</span>
        </a>

        <div className="mt-6 text-[10px] uppercase tracking-wider font-semibold opacity-60" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
          {curr.footerVerified}
        </div>
      </div>

    </motion.div>
  );
}
