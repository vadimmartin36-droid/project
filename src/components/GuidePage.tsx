import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Smartphone, 
  Cpu, 
  Users, 
  Sparkles, 
  HelpCircle, 
  ChevronDown, 
  ArrowLeft, 
  Coins, 
  ShieldCheck, 
  Zap, 
  Globe, 
  TrendingUp 
} from 'lucide-react';

interface GuidePageProps {
  lang: 'ru' | 'en';
  theme: 'dark' | 'light';
  referralLink: string;
  onSpinClick: () => void;
  onBack: () => void;
}

export function GuidePage({ lang, theme, referralLink, onSpinClick, onBack }: GuidePageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const t = {
    ru: {
      badge: "📚 Руководство по заработку",
      title: "База знаний и секреты",
      titleHighlight: "максимального дохода",
      subtitle: "Практические шаги, секретные тактики и подробная инструкция по увеличению вашего пассивного заработка с Honeygain до $50–$100 в месяц без вложений.",
      backBtn: "Вернуться на главную",
      tacticsTitle: "4 Секретные тактики разгона баланса",
      tacticsSubtitle: "Используйте эти проверенные методы, чтобы зарабатывать в 5-10 раз больше обычных пользователей.",
      
      t1Title: "1. Мульти-девайс масштабирование",
      t1Desc: "Установите приложение на все доступные устройства: домашний ПК, рабочий ноутбук, личный смартфон и планшет. Чем больше активных устройств в сети, тем выше начисления. Обратите внимание: для максимальной эффективности подключайте устройства к разным IP-адресам (например, ПК к домашнему Wi-Fi, а смартфон — к мобильному 4G/5G).",
      
      t2Title: "2. Content Delivery (Доставка контента)",
      t2Desc: "Включите функцию Content Delivery в настройках приложения на Windows и macOS. Это особый приоритетный режим обмена трафиком для потокового видео и тяжелых веб-ресурсов. Оплата за трафик в этом режиме увеличивается до 10 раз за каждый час активности по сравнению с обычным фоновым шерингом!",
      
      t3Title: "3. Многоуровневая реферальная сеть",
      t3Desc: "Приглашайте друзей, знакомых и делитесь своей партнерской ссылкой в соцсетях. Вы будете пожизненно получать 25% от ежедневного заработка каждого приглашенного пользователя. Создайте свою пассивную команду, которая будет приносить вам доход круглосуточно, пока вы отдыхаете.",
      
      t4Title: "4. Счастливое Колесо & Бонусы",
      t4Desc: "Заходите на сайт каждый день и обязательно крутите наше Колесо Удачи. Это дает вам гарантированные ежедневные начисления на партнерский баланс от $0.10 до $10.00. Не пропускайте ни одного дня, чтобы максимизировать шансы на супер-призы и поддерживать высокую активность.",

      faqTitle: "Часто задаваемые вопросы (FAQ)",
      faqSubtitle: "Все, что вам нужно знать о безопасности, выплатах и стабильности работы системы.",
      
      faqQ1: "Безопасно ли использовать приложение Honeygain?",
      faqA1: "Абсолютно безопасно. Приложение функционирует как защищенный шлюз. Трафик используют только проверенные компании из списка Fortune 500 для сертифицированных маркетинговых исследований, сравнения цен и SEO-мониторинга. Приложение не имеет доступа к вашей личной информации, паролям, галерее или контактам.",
      
      faqQ2: "Сколько устройств я могу подключить к одному аккаунту?",
      faqA2: "Вы можете привязать неограниченное количество устройств к своей учетной записи. Однако Honeygain позволяет использовать максимум 1 активное устройство на один уникальный IP-адрес. Чтобы обойти это ограничение, подключите одно устройство к домашней сети, другое — к мобильной сети, третье — к рабочей или соседской Wi-Fi.",
      
      faqQ3: "Каков минимальный порог для вывода денег?",
      faqA3: "Минимальный порог вывода составляет $20.00. Регистрируясь по нашей партнерской ссылке, вы мгновенно получаете стартовый бонус $3.00, что значительно сокращает время до вашей первой выплаты.",
      
      faqQ4: "Как выводить заработанные средства?",
      faqA4: "Вы можете заказать выплату на свой кошелек PayPal или воспользоваться выводом без комиссии в криптовалюте JumpToken (JMPT). Выплаты обрабатываются в течение 24-48 часов.",

      statsTitle: "Ваш сетевой потенциал",
      statsDesc: "Примерный расчет при внедрении всех 4 тактик из нашего руководства:",
      statsPoint1: "1 устройство (24/7): ~$15 - $20/мес",
      statsPoint2: "3 устройства + Content Delivery: ~$45 - $60/мес",
      statsPoint3: "5 устройств + 10 рефералов: ~$120+/мес",
      
      ctaTitle: "Готовы начать зарабатывать по максимуму?",
      ctaDesc: "Заберите приветственные $3.00 прямо сейчас и испытайте свою удачу на Счастливом Колесе!",
      ctaSpinBtn: "Испытать удачу 🎡",
      ctaRegisterBtn: "Зарегистрироваться с бонусом $3 🍯",
      securityLabel: "Сертификация SSL-3000 • Безопасное партнерство"
    },
    en: {
      badge: "📚 Earnings Guide & Manual",
      title: "Knowledge Base & Secrets of",
      titleHighlight: "Maximum Revenue",
      subtitle: "Practical steps, secret tactics, and detailed instructions to boost your Honeygain passive income up to $50–$100 per month with zero investments.",
      backBtn: "Back to Home Page",
      tacticsTitle: "4 Secret Tactics to Speed Up Balance",
      tacticsSubtitle: "Use these verified methods to earn 5-10 times more than average users.",
      
      t1Title: "1. Multi-device scaling",
      t1Desc: "Install the app on all available hardware: home PC, work laptop, personal smartphone, and tablet. The more active devices connected, the higher the share volume. Pro tip: connect devices to different IP networks (e.g., PC to home Wi-Fi, phone to 4G/5G cellular) for extreme payouts.",
      
      t2Title: "2. Content Delivery (CD)",
      t2Desc: "Enable the 'Content Delivery' mode in your app settings on Windows and macOS. This is a specialized, priority data-sharing tier for video streaming and data-heavy websites. Bandwidth shares in this mode yield up to 10x higher rewards per hour compared to default sharing!",
      
      t3Title: "3. Multi-tier Referral Engine",
      t3Desc: "Share your unique invite link with friends, family, and on social media platforms. You will receive a lifetime 25% commission from the daily earnings of every user who signs up through your link. Build an automated digital team earning for you 24/7.",
      
      t4Title: "4. Lucky Wheel & Daily Rewards",
      t4Desc: "Visit our site daily to spin the built-in Lucky Wheel. It grants guaranteed daily rewards from $0.10 to $10.00 directly to your partner balance. Don't skip a single day to maximize super-prizes and maintain supreme account activity.",

      faqTitle: "Frequently Asked Questions (FAQ)",
      faqSubtitle: "Everything you need to know about safety, withdrawals, and stability.",
      
      faqQ1: "Is it safe to run the Honeygain application?",
      faqA1: "Absolutely. The application functions as a highly secure proxy tunnel. Traffic is encrypted and only routed to trusted, vetted Fortune 500 companies for certified SEO auditing, price comparisons, and market data compilation. It never accesses your private files, gallery, passwords, or contacts.",
      
      faqQ2: "How many devices can I link to my account?",
      faqA2: "You can link as many devices as you wish. However, Honeygain limits active sharing to 1 device per unique IP network. To scale, run one device on home Wi-Fi, another on cellular LTE/5G, and a third on work/school network.",
      
      faqQ3: "What is the minimum cashout threshold?",
      faqA3: "The minimum payout is $20.00. By signing up via our exclusive link, you get a starting gift of $3.00, pushing you much closer to your first bank or crypto transfer.",
      
      faqQ4: "How do I withdraw my earnings?",
      faqA4: "You can request direct payouts to PayPal or use the fast, zero-fee option via JumpToken (JMPT) cryptocurrency. Payouts are safely processed within 24-48 business hours.",

      statsTitle: "Your Network Potential",
      statsDesc: "Estimated monthly income when implementing all 4 core tactics:",
      statsPoint1: "1 device online (24/7): ~$15 - $20/mo",
      statsPoint2: "3 devices + Content Delivery: ~$45 - $60/mo",
      statsPoint3: "5 devices + 10 active referrals: ~$120+/mo",
      
      ctaTitle: "Ready to maximize your passive income?",
      ctaDesc: "Claim your guaranteed starting $3.00 gift and test your fortunes on the Lucky Wheel today!",
      ctaSpinBtn: "Spin the Wheel 🎡",
      ctaRegisterBtn: "Claim $3.00 Bonus & Register 🍯",
      securityLabel: "SSL-3000 Certified • Encrypted Partner Network"
    }
  }[lang];

  const faqList = [
    { q: t.faqQ1, a: t.faqA1 },
    { q: t.faqQ2, a: t.faqA2 },
    { q: t.faqQ3, a: t.faqA3 },
    { q: t.faqQ4, a: t.faqA4 }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10"
    >
      {/* Кнопка Вернуться на главную */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <button 
          onClick={onBack}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card text-xs font-semibold hover:scale-105 active:scale-95 text-[var(--text-main)] transition-all cursor-pointer border border-[var(--card-border)] hover:bg-white/5"
          style={{ fontFamily: 'Georgia' }}
        >
          <ArrowLeft size={14} className="text-[#f6b026]" />
          <span>{t.backBtn}</span>
        </button>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-8 pb-16 sm:pb-24 overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-1/4 left-1/12 w-64 h-64 rounded-full bg-[#f6b026]/5 blur-3xl -z-10 animate-float" />
        <div className="absolute bottom-1/4 right-1/12 w-64 h-64 rounded-full bg-orange-500/4 blur-3xl -z-10 animate-float" style={{ animationDelay: '2.5s' }} />

        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* Floating guide badge */}
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#f6b026]/10 text-[#f6b026] text-xs font-semibold tracking-wider uppercase mb-8 border border-[#f6b026]/20 animate-float">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f6b026] animate-pulse" />
            <span style={{ fontFamily: 'Georgia' }}>{t.badge}</span>
          </div>

          {/* Main heading */}
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight serif-title italic text-balance mb-4" style={{ color: 'var(--text-main)' }}>
            {t.title} <span className="text-honey font-bold">{t.titleHighlight}</span>
          </h1>

          {/* Subtitle description */}
          <p className="text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-light mb-8" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
            {t.subtitle}
          </p>

          <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#f6b026]/60 to-transparent mx-auto" />
        </div>
      </section>

      {/* TACTICS BENTO GRID */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold serif-title italic text-honey mb-3">{t.tacticsTitle}</h2>
          <p className="text-xs sm:text-sm font-light max-w-xl mx-auto" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
            {t.tacticsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Tactic 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6 sm:p-8 rounded-[32px] border border-[var(--card-border)] relative overflow-hidden group hover:border-[#f6b026]/30 transition-all duration-300 shadow-lg"
          >
            <div className="absolute right-0 top-0 w-36 h-36 rounded-full bg-[#f6b026]/3 blur-2xl group-hover:bg-[#f6b026]/8 transition-all duration-500" />
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#f6b026]/10 border border-[#f6b026]/20 flex items-center justify-center text-[#f6b026] shadow-inner group-hover:scale-110 transition-transform">
                <Smartphone size={22} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold serif-title italic" style={{ color: 'var(--text-main)' }}>
                {t.t1Title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed font-light" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
              {t.t1Desc}
            </p>
          </motion.div>

          {/* Tactic 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-6 sm:p-8 rounded-[32px] border border-[var(--card-border)] relative overflow-hidden group hover:border-[#f6b026]/30 transition-all duration-300 shadow-lg"
          >
            <div className="absolute right-0 top-0 w-36 h-36 rounded-full bg-orange-500/3 blur-2xl group-hover:bg-orange-500/8 transition-all duration-500" />
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shadow-inner group-hover:scale-110 transition-transform">
                <Cpu size={22} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold serif-title italic" style={{ color: 'var(--text-main)' }}>
                {t.t2Title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed font-light" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
              {t.t2Desc}
            </p>
          </motion.div>

          {/* Tactic 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-6 sm:p-8 rounded-[32px] border border-[var(--card-border)] relative overflow-hidden group hover:border-[#f6b026]/30 transition-all duration-300 shadow-lg"
          >
            <div className="absolute right-0 top-0 w-36 h-36 rounded-full bg-amber-500/3 blur-2xl group-hover:bg-amber-500/8 transition-all duration-500" />
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner group-hover:scale-110 transition-transform">
                <Users size={22} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold serif-title italic" style={{ color: 'var(--text-main)' }}>
                {t.t3Title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed font-light" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
              {t.t3Desc}
            </p>
          </motion.div>

          {/* Tactic 4 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card p-6 sm:p-8 rounded-[32px] border border-[var(--card-border)] relative overflow-hidden group hover:border-[#f6b026]/30 transition-all duration-300 shadow-lg"
          >
            <div className="absolute right-0 top-0 w-36 h-36 rounded-full bg-yellow-500/3 blur-2xl group-hover:bg-yellow-500/8 transition-all duration-500" />
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 shadow-inner group-hover:scale-110 transition-transform">
                <Sparkles size={22} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold serif-title italic" style={{ color: 'var(--text-main)' }}>
                {t.t4Title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed font-light" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
              {t.t4Desc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* STATS & POTENTIAL */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="glass-card p-6 sm:p-8 rounded-[32px] border border-[#f6b026]/20 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#f6b026]/5 blur-2xl" />
          
          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#f6b026]/10 border border-[#f6b026]/35 flex items-center justify-center text-[#f6b026] flex-shrink-0 animate-pulse">
              <TrendingUp size={28} />
            </div>
            <div className="text-center sm:text-left flex-grow">
              <h3 className="text-lg sm:text-xl font-bold serif-title italic text-honey mb-1">
                {t.statsTitle}
              </h3>
              <p className="text-xs font-light mb-4" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
                {t.statsDesc}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-black/10 border border-[var(--card-border)] flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="font-semibold text-[var(--text-main)]" style={{ fontFamily: 'Georgia' }}>{t.statsPoint1}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/10 border border-[var(--card-border)] flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-[#f6b026]" />
                  <span className="font-semibold text-[var(--text-main)]" style={{ fontFamily: 'Georgia' }}>{t.statsPoint2}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/15 border border-[#f6b026]/30 flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-[#f28c28] animate-ping" />
                  <span className="font-bold text-honey" style={{ fontFamily: 'Georgia' }}>{t.statsPoint3}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION (INTERACTIVE ACCORDIONS) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold serif-title italic text-honey mb-3">
            {t.faqTitle}
          </h2>
          <p className="text-xs sm:text-sm font-light max-w-xl mx-auto" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
            {t.faqSubtitle}
          </p>
        </div>

        <div className="space-y-4">
          {faqList.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index}
                className="glass-card rounded-2xl border transition-all duration-300"
                style={{ borderColor: isOpen ? '#f6b026/30' : 'var(--card-border)' }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-5 py-4 sm:py-5 flex items-center justify-between gap-4 text-left font-bold text-sm sm:text-base select-none transition-colors cursor-pointer"
                  style={{ color: 'var(--text-main)', fontFamily: 'Georgia' }}
                >
                  <div className="flex items-center space-x-3">
                    <HelpCircle size={18} className="text-[#f6b026] flex-shrink-0" />
                    <span className="italic">{faq.q}</span>
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`text-[var(--text-muted)] transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-honey' : ''}`} 
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm leading-relaxed font-light border-t border-[var(--card-border)]/50" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* CALL TO ACTION GRID */}
      <section className="py-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="glass-card p-8 sm:p-12 rounded-[36px] border border-amber-500/10 text-center relative overflow-hidden shadow-2xl">
          {/* Internal lights */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-20 bg-gradient-to-b from-[#f6b026]/15 via-transparent to-transparent blur-xl pointer-events-none rounded-full" />
          
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold serif-title italic text-honey mb-4">
              {t.ctaTitle}
            </h2>
            
            <p className="text-xs sm:text-sm leading-relaxed max-w-lg mx-auto font-light mb-8" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
              {t.ctaDesc}
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button 
                onClick={() => {
                  onSpinClick();
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-full glass-card border border-[#f6b026]/35 text-white font-bold text-sm tracking-wide hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer hover:bg-white/5"
                style={{ fontFamily: 'Georgia' }}
              >
                <span>{t.ctaSpinBtn}</span>
              </button>
              
              <a 
                href={referralLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-full honey-gradient text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                style={{ fontFamily: 'Georgia' }}
              >
                <span>{t.ctaRegisterBtn}</span>
              </a>
            </div>

            <div className="mt-8 flex items-center justify-center gap-1.5 text-[10px]" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
              <ShieldCheck size={12} className="text-emerald-500" />
              <span>{t.securityLabel}</span>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
