import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Wallet, 
  Copy, 
  Check, 
  LogOut, 
  Settings, 
  Award, 
  ArrowUpRight, 
  Shield, 
  Smartphone, 
  Monitor, 
  ChevronRight, 
  Lock, 
  KeyRound, 
  Languages, 
  Activity, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface PersonalCabinetProps {
  user: {
    id: string;
    username: string;
    email: string;
    registeredAt: number;
    balance: number;
  };
  lang: 'ru' | 'en';
  theme: 'dark' | 'light';
  referralLink: string;
  onSignOut: () => void;
  onBalanceUpdate: (newBalance: number) => void;
  onBack: () => void;
}

export function PersonalCabinet({ 
  user, 
  lang, 
  theme, 
  referralLink, 
  onSignOut, 
  onBalanceUpdate,
  onBack 
}: PersonalCabinetProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'withdraw' | 'affiliate' | 'settings'>('overview');
  const [copied, setCopied] = useState(false);
  const [copiedLinkType, setCopiedLinkType] = useState<'ref' | 'short' | null>(null);
  
  // Daily Honey Jar mini-game state
  const [jarClaimed, setJarClaimed] = useState(false);
  const [isJarOpening, setIsJarOpening] = useState(false);
  const [jarPrize, setJarPrize] = useState<number | null>(null);
  const [nextClaimTime, setNextClaimTime] = useState<string>('');
  
  // Password change form state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // Withdrawal Form State
  const [withdrawMethod, setWithdrawMethod] = useState<'paypal' | 'jmpt' | 'btc'>('paypal');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawStatus, setWithdrawStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawHistory, setWithdrawHistory] = useState<any[]>([]);

  // Localized texts
  const t = {
    ru: {
      title: "Личный Кабинет Партнера",
      welcome: "Добро пожаловать,",
      partnerStatus: "Статус: Активный Партнер",
      registered: "Регистрация:",
      balance: "Баланс кабинета",
      equivalent: "Эквивалент кредитов Honeygain:",
      withdrawBtn: "Вывести средства",
      copied: "Скопировано!",
      copyBtn: "Копировать",
      
      // Tabs
      tabOverview: "Обзор",
      tabWithdraw: "Выплаты",
      tabAffiliate: "Партнерская сеть",
      tabSettings: "Настройки профиля",

      // Stats
      statBalance: "Ваш баланс",
      statClicks: "Клики по ссылке",
      statRefs: "Активные рефералы",
      statTraffic: "Общий трафик",
      statRefsRate: "Реф. процент",

      // Honey Jar Section
      jarTitle: "Ежедневная банка меда 🍯",
      jarDesc: "Открывайте счастливую банку каждый день, чтобы получить случайный денежный бонус от $0.05 до $1.50 прямо на баланс!",
      jarClaimedText: "Вы уже забрали сегодняшний бонус! Возвращайтесь завтра.",
      jarBtnOpen: "Открыть банку с мёдом",
      jarOpening: "Открываем сладкую банку...",
      jarSuccessTitle: "Поздравляем! 🎉",
      jarSuccessDesc: "Вы выиграли бонус в размере",
      jarSuccessSub: "Сумма зачислена на ваш партнерский баланс.",

      // Devices Section
      devicesTitle: "Ваша сеть активных нод (Устройства)",
      devicesDesc: "Список ваших устройств, на которых работает фоновый шеринг интернет-трафика.",
      devName: "Устройство",
      devIp: "IP-Адрес",
      devTraffic: "Трафик (Сегодня)",
      devStatus: "Статус",
      statusActive: "Активен",
      statusInactive: "Неактивен",

      // Withdraw Section
      withdrawTitle: "Вывод заработанных средств",
      withdrawDesc: "Вы можете вывести средства в любой момент при достижении минимального порога выплат. Заявки обрабатываются автоматически в течение 12 часов.",
      withdrawThreshold: "Прогресс выплаты",
      withdrawThresholdDesc: "Минимальная сумма для вывода составляет $20.00. Накопите её, чтобы активировать вывод.",
      withdrawFormTitle: "Новый запрос на выплату",
      withdrawFormMethod: "Способ выплаты",
      withdrawFormAddress: "Email аккаунта PayPal / Адрес кошелька",
      withdrawFormAmount: "Сумма для вывода (USD)",
      withdrawFormSubmit: "Отправить запрос на выплату",
      withdrawFormSubmitLoading: "Обработка запроса...",
      withdrawErrThreshold: "Ошибка: Минимальный баланс для вывода — $20.00.",
      withdrawErrFields: "Пожалуйста, заполните все поля формы.",
      withdrawErrBalance: "Недостаточно средств на балансе.",
      withdrawSuccess: "Заявка на выплату успешно создана и отправлена в обработку!",
      withdrawHistTitle: "История транзакций и выплат",
      withdrawHistEmpty: "История транзакций пока пуста.",

      // Affiliate Section
      affTitle: "Управление реферальной сетью",
      affDesc: "Ваша партнерская ссылка — главный инструмент для пассивного заработка. Делитесь ей с друзьями и получайте пожизненный бонус 25% от их ежедневного дохода!",
      affLinkTitle: "Ваша реферальная ссылка",
      affShareTitle: "Поделиться в социальных сетях",
      affStepTitle: "Как привлекать рефералов?",
      affStep1: "1. Расскажите друзьям и отправьте ссылку лично в мессенджерах.",
      affStep2: "2. Опубликуйте обзорный пост или видео в Telegram, YouTube или ВК.",
      affStep3: "3. Делитесь своими успехами и скриншотами выплат в соцсетях.",

      // Settings Section
      settingsTitle: "Безопасность и настройки",
      settingsDesc: "Обновите пароль вашего аккаунта для повышения безопасности.",
      setPassTitle: "Смена пароля",
      setOldPass: "Текущий пароль",
      setNewPass: "Новый пароль",
      setConfirmPass: "Подтвердите новый пароль",
      setPassBtn: "Обновить пароль",
      setPassBtnLoading: "Обновление...",
      setPassErrFields: "Пожалуйста, заполните все поля.",
      setPassErrMatch: "Новые пароли не совпадают.",
      setPassSuccess: "Пароль успешно обновлен!",
      setAccountDetails: "Детали вашей учетной записи",
      setEmail: "Электронная почта",
      setUsername: "Имя пользователя",
      setUserId: "ID Аккаунта",
      setRegDate: "Дата регистрации"
    },
    en: {
      title: "Partner Personal Cabinet",
      welcome: "Welcome back,",
      partnerStatus: "Status: Active Partner",
      registered: "Registered:",
      balance: "Cabinet Balance",
      equivalent: "Honeygain Credits Equivalent:",
      withdrawBtn: "Withdraw Funds",
      copied: "Copied!",
      copyBtn: "Copy",
      
      // Tabs
      tabOverview: "Overview",
      tabWithdraw: "Payouts",
      tabAffiliate: "Affiliate Network",
      tabSettings: "Account Settings",

      // Stats
      statBalance: "Your Balance",
      statClicks: "Link Clicks",
      statRefs: "Active Referrals",
      statTraffic: "Total Traffic",
      statRefsRate: "Ref. Share",

      // Honey Jar Section
      jarTitle: "Daily Honey Jar 🍯",
      jarDesc: "Open the lucky jar once every day to receive a random cash bonus from $0.05 to $1.50 straight to your balance!",
      jarClaimedText: "You have already claimed today's bonus! Come back tomorrow.",
      jarBtnOpen: "Open Honey Jar",
      jarOpening: "Opening sweet jar...",
      jarSuccessTitle: "Congratulations! 🎉",
      jarSuccessDesc: "You won a cash bonus of",
      jarSuccessSub: "The amount has been added to your partner account balance.",

      // Devices Section
      devicesTitle: "Your Active Nodes Network (Devices)",
      devicesDesc: "List of your devices currently running background internet traffic sharing node.",
      devName: "Device",
      devIp: "IP-Address",
      devTraffic: "Traffic (Today)",
      devStatus: "Status",
      statusActive: "Active",
      statusInactive: "Inactive",

      // Withdraw Section
      withdrawTitle: "Withdraw Earned Funds",
      withdrawDesc: "You can withdraw your funds anytime once the minimum payout threshold is reached. Requests are processed automatically within 12 hours.",
      withdrawThreshold: "Payout Progress",
      withdrawThresholdDesc: "The minimum withdrawal amount is $20.00. Accumulate it to activate payout requests.",
      withdrawFormTitle: "New Payout Request",
      withdrawFormMethod: "Payout Method",
      withdrawFormAddress: "PayPal Email / Wallet Address",
      withdrawFormAmount: "Amount to Withdraw (USD)",
      withdrawFormSubmit: "Submit Payout Request",
      withdrawFormSubmitLoading: "Processing...",
      withdrawErrThreshold: "Error: Minimum balance for withdrawal is $20.00.",
      withdrawErrFields: "Please fill in all form fields.",
      withdrawErrBalance: "Insufficient balance on your account.",
      withdrawSuccess: "Your payout request was successfully created and is in processing!",
      withdrawHistTitle: "Transactions & Payouts History",
      withdrawHistEmpty: "Transaction history is currently empty.",

      // Affiliate Section
      affTitle: "Affiliate Network Management",
      affDesc: "Your referral link is the key to passive earnings. Share it with friends and earn a lifetime 25% daily commission on their earnings!",
      affLinkTitle: "Your Referral Link",
      affShareTitle: "Share on Social Media",
      affStepTitle: "How to Attract Referrals?",
      affStep1: "1. Tell your friends and send your link directly in messengers.",
      affStep2: "2. Post a brief overview or video on Telegram, YouTube, or Reddit.",
      affStep3: "3. Share your earnings progress and screenshots of payouts.",

      // Settings Section
      settingsTitle: "Security & Account Settings",
      settingsDesc: "Update your account password to ensure maximum security.",
      setPassTitle: "Change Password",
      setOldPass: "Current Password",
      setNewPass: "New Password",
      setConfirmPass: "Confirm New Password",
      setPassBtn: "Update Password",
      setPassBtnLoading: "Updating...",
      setPassErrFields: "Please fill in all fields.",
      setPassErrMatch: "New passwords do not match.",
      setPassSuccess: "Password successfully updated!",
      setAccountDetails: "Your Account Details",
      setEmail: "Email Address",
      setUsername: "Username",
      setUserId: "Account ID",
      setRegDate: "Registration Date"
    }
  };

  const currentTranslations = t[lang];

  // Load daily claim state on mount
  useEffect(() => {
    const lastClaim = localStorage.getItem(`last_jar_claim_${user.id}`);
    if (lastClaim) {
      const lastClaimDate = new Date(parseInt(lastClaim));
      const today = new Date();
      if (lastClaimDate.toDateString() === today.toDateString()) {
        setJarClaimed(true);
        
        // Calculate time to next midnight
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const hoursLeft = Math.ceil((tomorrow.getTime() - today.getTime()) / (1000 * 60 * 60));
        setNextClaimTime(lang === 'ru' ? `${hoursLeft} ч.` : `${hoursLeft} hrs`);
      }
    }

    // Load initial simulated transactions history
    const baseHistory = [
      {
        id: 'tx_starter',
        type: 'bonus',
        amount: 3.00,
        description: lang === 'ru' ? 'Приветственный бонус при регистрации' : 'Welcome Starter Bonus',
        timestamp: user.registeredAt,
        status: 'completed'
      }
    ];

    // Check if they won anything from lucky wheel (simulated or real history can be added)
    const storedSpins = localStorage.getItem(`spins_${user.id}`);
    let updatedHistory = [...baseHistory];
    if (storedSpins) {
      try {
        const parsedSpins = JSON.parse(storedSpins);
        parsedSpins.forEach((spin: any, index: number) => {
          updatedHistory.push({
            id: `tx_spin_${index}`,
            type: 'prize',
            amount: spin.amount,
            description: lang === 'ru' ? `Выигрыш в Колесе Фортуны` : `Lucky Wheel Win`,
            timestamp: spin.timestamp,
            status: 'completed'
          });
        });
      } catch (e) {
        console.error(e);
      }
    }

    // Load custom daily honey jar claims if any
    const jarClaims = localStorage.getItem(`jar_claims_${user.id}`);
    if (jarClaims) {
      try {
        const parsedClaims = JSON.parse(jarClaims);
        parsedClaims.forEach((claim: any, index: number) => {
          updatedHistory.push({
            id: `tx_jar_${index}`,
            type: 'jar',
            amount: claim.amount,
            description: lang === 'ru' ? 'Бонус из Банки Меда' : 'Honey Jar Daily Reward',
            timestamp: claim.timestamp,
            status: 'completed'
          });
        });
      } catch (e) {
        console.error(e);
      }
    }

    // Load withdrawal requests if any
    const withdrawals = localStorage.getItem(`withdrawals_${user.id}`);
    if (withdrawals) {
      try {
        const parsedWithdrawals = JSON.parse(withdrawals);
        parsedWithdrawals.forEach((w: any) => {
          updatedHistory.push(w);
        });
      } catch (e) {
        console.error(e);
      }
    }

    // Sort transaction history by timestamp desc
    updatedHistory.sort((a, b) => b.timestamp - a.timestamp);
    setWithdrawHistory(updatedHistory);
  }, [user.id, user.registeredAt, jarClaimed, lang]);

  // Copy referral link handler
  const handleCopyLink = (text: string, type: 'ref' | 'short') => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setCopiedLinkType(type);
    setTimeout(() => {
      setCopied(false);
      setCopiedLinkType(null);
    }, 2000);
  };

  // Claim Daily Honey Jar handler
  const handleClaimJar = async () => {
    if (jarClaimed || isJarOpening) return;

    setIsJarOpening(true);
    
    // Simulate jar opening animation with delay
    setTimeout(async () => {
      // Generate a random reward: e.g., $0.05, $0.10, $0.15, $0.25, $0.50, $1.00, $1.50 with weights
      const rewards = [0.05, 0.10, 0.15, 0.20, 0.25, 0.50, 0.75, 1.00, 1.50];
      const weights = [15, 20, 20, 15, 10, 10, 5, 3, 2]; // percent probabilities
      
      // Weighted select
      let sum = 0;
      const r = Math.random() * 100;
      let selectedReward = 0.10;
      
      for (let i = 0; i < rewards.length; i++) {
        sum += weights[i];
        if (r <= sum) {
          selectedReward = rewards[i];
          break;
        }
      }

      try {
        // Call server-side API to update balance persistently
        const token = localStorage.getItem('honeygain_auth_token');
        const newBalance = parseFloat((user.balance + selectedReward).toFixed(2));
        
        const response = await fetch('/api/user/update-balance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, balance: newBalance })
        });

        if (response.ok) {
          // Success
          onBalanceUpdate(newBalance);
          setJarPrize(selectedReward);
          setJarClaimed(true);
          
          // Persist claim in localStorage
          const now = Date.now();
          localStorage.setItem(`last_jar_claim_${user.id}`, now.toString());
          
          // Save jar claim list in history
          const jarClaims = localStorage.getItem(`jar_claims_${user.id}`);
          const currentClaims = jarClaims ? JSON.parse(jarClaims) : [];
          currentClaims.push({ amount: selectedReward, timestamp: now });
          localStorage.setItem(`jar_claims_${user.id}`, JSON.stringify(currentClaims));
        } else {
          console.error("Failed to update balance on server");
        }
      } catch (err) {
        console.error("Failed to process honey jar claim", err);
      } finally {
        setIsJarOpening(false);
      }
    }, 2500);
  };

  // Password reset handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus({ type: null, message: '' });

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordStatus({ type: 'error', message: currentTranslations.setPassErrFields });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: currentTranslations.setPassErrMatch });
      return;
    }

    setPasswordLoading(true);

    try {
      const token = localStorage.getItem('honeygain_auth_token');
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, oldPassword, newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || (lang === 'ru' ? 'Не удалось изменить пароль' : 'Password change failed'));
      }

      setPasswordStatus({ type: 'success', message: currentTranslations.setPassSuccess });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordStatus({ type: 'error', message: err.message });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Withdrawal submit handler
  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawStatus({ type: null, message: '' });

    if (!withdrawAddress || !withdrawAmount) {
      setWithdrawStatus({ type: 'error', message: currentTranslations.withdrawErrFields });
      return;
    }

    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setWithdrawStatus({ type: 'error', message: lang === 'ru' ? 'Неверная сумма.' : 'Invalid amount.' });
      return;
    }

    if (amountNum > user.balance) {
      setWithdrawStatus({ type: 'error', message: currentTranslations.withdrawErrBalance });
      return;
    }

    if (amountNum < 20.00) {
      setWithdrawStatus({ type: 'error', message: currentTranslations.withdrawErrThreshold });
      return;
    }

    setWithdrawLoading(true);

    try {
      // Deduct from balance on server
      const token = localStorage.getItem('honeygain_auth_token');
      const newBalance = parseFloat((user.balance - amountNum).toFixed(2));

      const response = await fetch('/api/user/update-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, balance: newBalance })
      });

      if (response.ok) {
        onBalanceUpdate(newBalance);
        setWithdrawStatus({ type: 'success', message: currentTranslations.withdrawSuccess });
        
        // Save withdrawal record
        const now = Date.now();
        const newWithdrawal = {
          id: `tx_withdraw_${now}`,
          type: 'withdraw',
          amount: -amountNum,
          description: lang === 'ru' ? `Вывод средств (${withdrawMethod.toUpperCase()})` : `Payout Request (${withdrawMethod.toUpperCase()})`,
          timestamp: now,
          status: 'pending',
          address: withdrawAddress
        };

        const withdrawals = localStorage.getItem(`withdrawals_${user.id}`);
        const currentWithdrawals = withdrawals ? JSON.parse(withdrawals) : [];
        currentWithdrawals.push(newWithdrawal);
        localStorage.setItem(`withdrawals_${user.id}`, JSON.stringify(currentWithdrawals));

        setWithdrawAddress('');
        setWithdrawAmount('');
      } else {
        throw new Error(lang === 'ru' ? 'Ошибка сервера' : 'Server error');
      }
    } catch (err: any) {
      setWithdrawStatus({ type: 'error', message: err.message });
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative" style={{ minHeight: 'calc(100vh - 400px)' }}>
      {/* Dynamic Background Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-orange-500/5 blur-[140px] pointer-events-none -z-10" />

      {/* DASHBOARD HERO GREETING BLOCK */}
      <div className="glass-card p-6 sm:p-10 rounded-[32px] border border-white/5 relative overflow-hidden mb-10 shadow-lg shadow-amber-500/5">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#f6b026]/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl honey-gradient flex items-center justify-center text-slate-950 font-black text-xl sm:text-2xl shadow-xl shadow-amber-500/10">
              {user.username.substring(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-honey font-bold mb-1" style={{ fontFamily: 'Georgia' }}>
                {currentTranslations.partnerStatus}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white serif-title italic">
                {currentTranslations.welcome} {user.username}!
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mt-1.5" style={{ fontFamily: 'Georgia' }}>
                <span>{currentTranslations.registered}</span>
                <span className="font-semibold text-white/80">{new Date(user.registeredAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('withdraw')}
              className="px-5 py-2.5 rounded-xl honey-gradient text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
              style={{ fontFamily: 'Georgia' }}
            >
              <Wallet className="w-4 h-4" />
              <span>{currentTranslations.withdrawBtn}</span>
            </button>
            <button 
              onClick={onSignOut}
              className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all cursor-pointer"
              title={lang === 'ru' ? "Выйти из аккаунта" : "Sign Out"}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* DASHBOARD INTERNAL NAVIGATION */}
      <div className="flex overflow-x-auto gap-2 pb-3 mb-8 scrollbar-hide border-b border-white/5">
        {[
          { id: 'overview', label: currentTranslations.tabOverview, icon: Activity },
          { id: 'withdraw', label: currentTranslations.tabWithdraw, icon: Wallet },
          { id: 'affiliate', label: currentTranslations.tabAffiliate, icon: Users },
          { id: 'settings', label: currentTranslations.tabSettings, icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all cursor-pointer select-none ${
                isActive 
                  ? 'bg-[#f6b026]/10 text-[#f6b026] border border-[#f6b026]/20 shadow shadow-amber-500/5' 
                  : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              style={{ fontFamily: 'Georgia' }}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TABS CONTENT BLOCK */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
        >
          {/* ==================== OVERVIEW TAB ==================== */}
          {activeTab === 'overview' && (
            <div className="space-y-10">
              
              {/* Stats Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stat 1: Balance */}
                <div className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col justify-between relative overflow-hidden h-[160px] group hover:border-[#f6b026]/20 transition-all">
                  <div className="absolute top-[-20px] right-[-20px] w-24 h-24 rounded-full bg-[#f6b026]/5 blur-xl group-hover:bg-[#f6b026]/10 transition-colors pointer-events-none" />
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider" style={{ fontFamily: 'Georgia' }}>
                      {currentTranslations.statBalance}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#f6b026] flex items-center justify-center text-sm">
                      <Wallet className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-black text-honey font-mono flex items-baseline gap-1">
                      <span>${user.balance.toFixed(2)}</span>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1.5 leading-tight">
                      {currentTranslations.equivalent} <span className="text-[#f6b026] font-mono">{(user.balance * 1000).toLocaleString()} CR</span>
                    </p>
                  </div>
                </div>

                {/* Stat 2: Link Clicks */}
                <div className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col justify-between relative overflow-hidden h-[160px] group hover:border-[#f6b026]/20 transition-all">
                  <div className="absolute top-[-20px] right-[-20px] w-24 h-24 rounded-full bg-[#f6b026]/5 blur-xl group-hover:bg-[#f6b026]/10 transition-colors pointer-events-none" />
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider" style={{ fontFamily: 'Georgia' }}>
                      {currentTranslations.statClicks}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#f6b026] flex items-center justify-center text-sm">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-black text-white font-mono">
                      24
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1.5 leading-tight">
                      {lang === 'ru' ? 'Активность переходов по вашей ссылке' : 'Link redirect activity tracking'}
                    </p>
                  </div>
                </div>

                {/* Stat 3: Active Referrals */}
                <div className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col justify-between relative overflow-hidden h-[160px] group hover:border-[#f6b026]/20 transition-all">
                  <div className="absolute top-[-20px] right-[-20px] w-24 h-24 rounded-full bg-[#f6b026]/5 blur-xl group-hover:bg-[#f6b026]/10 transition-colors pointer-events-none" />
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider" style={{ fontFamily: 'Georgia' }}>
                      {currentTranslations.statRefs}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#f6b026] flex items-center justify-center text-sm">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-black text-white font-mono flex items-baseline gap-2">
                      <span>0</span>
                      <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-sans">
                        {currentTranslations.statRefsRate} 25%
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1.5 leading-tight">
                      {lang === 'ru' ? 'Каждый друг приносит вам 25% пожизненно' : 'Every active referral gives 25% lifetime share'}
                    </p>
                  </div>
                </div>

                {/* Stat 4: Shared Traffic */}
                <div className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col justify-between relative overflow-hidden h-[160px] group hover:border-[#f6b026]/20 transition-all">
                  <div className="absolute top-[-20px] right-[-20px] w-24 h-24 rounded-full bg-[#f6b026]/5 blur-xl group-hover:bg-[#f6b026]/10 transition-colors pointer-events-none" />
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider" style={{ fontFamily: 'Georgia' }}>
                      {currentTranslations.statTraffic}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#f6b026] flex items-center justify-center text-sm">
                      <Smartphone className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-black text-white font-mono">
                      452.8 MB
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1.5 leading-tight">
                      {lang === 'ru' ? 'Трафик со всех ваших фоновых устройств' : 'Background traffic shared from your devices'}
                    </p>
                  </div>
                </div>
              </div>

              {/* DAILY HONEY JAR ACTIVITY (MOST AWESOME ELEMENT) */}
              <div className="glass-card p-6 sm:p-8 rounded-[32px] border border-[#f6b026]/25 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#f6b026]/5 blur-[90px] pointer-events-none" />
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                  <div className="md:col-span-4 flex flex-col items-center justify-center">
                    {/* Visual Animated Honey Jar */}
                    <div className="relative w-44 h-44 flex items-center justify-center">
                      <motion.div
                        animate={isJarOpening ? {
                          rotate: [0, -10, 10, -10, 10, -5, 5, -2, 2, 0],
                          scale: [1, 1.05, 1.05, 1.05, 1.05, 1.05, 1.05, 1, 1],
                          y: [0, -10, 0, -10, 0]
                        } : jarClaimed ? {} : {
                          y: [0, -5, 0],
                        }}
                        transition={isJarOpening ? {
                          duration: 2.2,
                          ease: "easeInOut",
                        } : {
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className={`text-8xl select-none ${jarClaimed ? 'opacity-70 filter grayscale-[25%]' : 'cursor-pointer'}`}
                        onClick={handleClaimJar}
                      >
                        🍯
                      </motion.div>
                      
                      {/* Sweet glowing rays under honey jar */}
                      <div className={`absolute w-36 h-36 rounded-full bg-amber-500/10 blur-xl pointer-events-none -z-10 transition-all duration-500 ${isJarOpening ? 'scale-150 bg-amber-500/35 opacity-100 animate-ping' : 'scale-100 opacity-60'}`} />
                    </div>
                  </div>

                  <div className="md:col-span-8 space-y-4 text-center md:text-left">
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] sm:text-xs font-bold tracking-wider uppercase border border-amber-500/20" style={{ fontFamily: 'Georgia' }}>
                      <Award className="w-3.5 h-3.5" />
                      <span>{currentTranslations.jarTitle}</span>
                    </span>
                    
                    <h2 className="text-2xl font-bold text-white serif-title italic">
                      {lang === 'ru' ? 'Испытайте удачу с банкой мёда!' : 'Try your luck with the Honey Jar!'}
                    </h2>
                    
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-xl" style={{ fontFamily: 'Georgia' }}>
                      {currentTranslations.jarDesc}
                    </p>

                    <div className="pt-2">
                      <AnimatePresence mode="wait">
                        {jarClaimed && jarPrize === null ? (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start"
                          >
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-xl flex items-center gap-2">
                              <Check className="w-4 h-4" />
                              <span>{currentTranslations.jarClaimedText}</span>
                            </span>
                            <span className="text-xs text-[var(--text-muted)] font-mono">
                              {lang === 'ru' ? 'До следующего открытия:' : 'Next spin in:'} <span className="text-[#f6b026] font-bold">{nextClaimTime}</span>
                            </span>
                          </motion.div>
                        ) : jarPrize !== null ? (
                          <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/25 max-w-md text-left space-y-1.5"
                          >
                            <h4 className="text-sm font-extrabold text-emerald-400 flex items-center gap-1.5">
                              <span>{currentTranslations.jarSuccessTitle}</span>
                            </h4>
                            <p className="text-xs text-[var(--text-muted)]" style={{ fontFamily: 'Georgia' }}>
                              {currentTranslations.jarSuccessDesc} <span className="text-emerald-400 font-mono font-bold text-sm">+${jarPrize.toFixed(2)}</span>
                            </p>
                            <p className="text-[10px] text-[var(--text-muted)] italic">
                              {currentTranslations.jarSuccessSub}
                            </p>
                          </motion.div>
                        ) : (
                          <motion.button
                            onClick={handleClaimJar}
                            disabled={isJarOpening}
                            className="px-8 py-3.5 rounded-xl honey-gradient text-slate-950 font-bold text-xs uppercase tracking-widest shadow-lg shadow-amber-500/10 hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto"
                            style={{ fontFamily: 'Georgia' }}
                          >
                            <span>{isJarOpening ? currentTranslations.jarOpening : currentTranslations.jarBtnOpen}</span>
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTIVE NODES/DEVICES WORKSPACE TRACKER */}
              <div className="glass-card p-6 sm:p-8 rounded-[32px] border border-white/5 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white serif-title italic flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#f6b026] animate-pulse" />
                    <span>{currentTranslations.devicesTitle}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 font-light" style={{ fontFamily: 'Georgia' }}>
                    {currentTranslations.devicesDesc}
                  </p>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-white/5 bg-slate-950/20">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-[var(--text-muted)]" style={{ fontFamily: 'Georgia' }}>
                        <th className="py-4 px-6 font-semibold">{currentTranslations.devName}</th>
                        <th className="py-4 px-6 font-semibold">{currentTranslations.devIp}</th>
                        <th className="py-4 px-6 font-semibold text-center">{currentTranslations.devTraffic}</th>
                        <th className="py-4 px-6 font-semibold text-right">{currentTranslations.devStatus}</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      {/* Device 1: PC */}
                      <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 flex items-center gap-3 font-semibold text-white">
                          <Monitor className="w-4 h-4 text-[#f6b026]" />
                          <span>Main-PC (Windows 11)</span>
                        </td>
                        <td className="py-4 px-6 font-mono text-[var(--text-muted)]">188.162.34.120</td>
                        <td className="py-4 px-6 text-center font-mono text-white/95">310.4 MB</td>
                        <td className="py-4 px-6 text-right">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            {currentTranslations.statusActive}
                          </span>
                        </td>
                      </tr>
                      {/* Device 2: iPhone */}
                      <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 flex items-center gap-3 font-semibold text-white">
                          <Smartphone className="w-4 h-4 text-[#f6b026]" />
                          <span>My iPhone 14 Pro</span>
                        </td>
                        <td className="py-4 px-6 font-mono text-[var(--text-muted)]">176.59.33.24</td>
                        <td className="py-4 px-6 text-center font-mono text-white/95">142.4 MB</td>
                        <td className="py-4 px-6 text-right">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            {currentTranslations.statusActive}
                          </span>
                        </td>
                      </tr>
                      {/* Device 3: Tablet (Inactive) */}
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 flex items-center gap-3 font-semibold text-white/60">
                          <Smartphone className="w-4 h-4 text-white/40" />
                          <span>Work Tablet (iPadOS)</span>
                        </td>
                        <td className="py-4 px-6 font-mono text-white/40">109.252.164.8</td>
                        <td className="py-4 px-6 text-center font-mono text-white/40">0.0 MB</td>
                        <td className="py-4 px-6 text-right">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-white/50 font-bold text-[10px]">
                            {currentTranslations.statusInactive}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==================== WITHDRAWALS TAB ==================== */}
          {activeTab === 'withdraw' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Form & Limits (7 cols) */}
              <div className="lg:col-span-7 space-y-8">
                
                <div className="glass-card p-6 sm:p-8 rounded-[32px] border border-white/5 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white serif-title italic">
                      {currentTranslations.withdrawTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 font-light" style={{ fontFamily: 'Georgia' }}>
                      {currentTranslations.withdrawDesc}
                    </p>
                  </div>

                  {/* Withdrawal Limit Progress Bar */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-[var(--text-muted)]">{currentTranslations.withdrawThreshold}</span>
                      <span className="text-[#f6b026] font-mono font-bold">
                        {Math.min(100, Math.floor((user.balance / 20) * 100))}%
                      </span>
                    </div>
                    {/* Visual Progress Track */}
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-white/5">
                      <div 
                        className="h-full rounded-full honey-gradient transition-all duration-1000 shadow shadow-amber-500/25"
                        style={{ width: `${Math.min(100, (user.balance / 20) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-[var(--text-muted)]" style={{ fontFamily: 'Georgia' }}>
                      <span>${user.balance.toFixed(2)} / $20.00</span>
                      <span>{currentTranslations.withdrawThresholdDesc}</span>
                    </div>
                  </div>

                  {/* New Withdrawal Form */}
                  <form onSubmit={handleWithdrawSubmit} className="space-y-4 pt-2">
                    <h4 className="text-sm font-bold text-[#f6b026] uppercase tracking-wider" style={{ fontFamily: 'Georgia' }}>
                      {currentTranslations.withdrawFormTitle}
                    </h4>

                    {/* Method Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-[var(--text-muted)]" style={{ fontFamily: 'Georgia' }}>
                        {currentTranslations.withdrawFormMethod}
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'paypal', label: 'PayPal', icon: 'fa-brands fa-paypal', color: 'hover:text-[#0070ba]' },
                          { id: 'jmpt', label: 'JumpTask (JMPT)', icon: 'fa-solid fa-coins', color: 'hover:text-amber-400' },
                          { id: 'btc', label: 'Bitcoin (BTC)', icon: 'fa-brands fa-bitcoin', color: 'hover:text-[#f7931a]' }
                        ].map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setWithdrawMethod(m.id as any)}
                            className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 select-none ${
                              withdrawMethod === m.id
                                ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-bold shadow'
                                : `bg-[var(--input-bg)] border-[var(--card-border)] text-white/80 ${m.color}`
                            }`}
                          >
                            <i className={`${m.icon} text-sm sm:text-base`}></i>
                            <span>{m.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Destination Address Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-[var(--text-muted)]" style={{ fontFamily: 'Georgia' }}>
                        {currentTranslations.withdrawFormAddress}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={withdrawAddress}
                          onChange={(e) => setWithdrawAddress(e.target.value)}
                          placeholder={withdrawMethod === 'paypal' ? 'your-email@gmail.com' : withdrawMethod === 'jmpt' ? '0x...' : '1A1zP1eP...'}
                          className="w-full px-4 py-3 rounded-xl border outline-none text-xs transition-colors bg-[var(--input-bg)] text-white"
                          style={{ borderColor: 'var(--card-border)' }}
                        />
                      </div>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-[var(--text-muted)]" style={{ fontFamily: 'Georgia' }}>
                        {currentTranslations.withdrawFormAmount}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          required
                          min="20"
                          step="0.01"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          placeholder="20.00"
                          className="w-full px-4 py-3 rounded-xl border outline-none text-xs transition-colors bg-[var(--input-bg)] text-white font-mono"
                          style={{ borderColor: 'var(--card-border)' }}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-500/50">USD</span>
                      </div>
                    </div>

                    {/* Status Feedback */}
                    {withdrawStatus.type && (
                      <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-2 ${
                        withdrawStatus.type === 'success' 
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                          : 'bg-red-500/5 border-red-500/20 text-red-400'
                      }`}>
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{withdrawStatus.message}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={withdrawLoading || user.balance < 20}
                      className={`w-full py-3.5 px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 select-none ${
                        user.balance >= 20
                          ? 'honey-gradient text-slate-950 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-lg shadow-amber-500/10'
                          : 'bg-white/5 border border-white/5 text-white/30 cursor-not-allowed'
                      }`}
                      style={{ fontFamily: 'Georgia' }}
                    >
                      {withdrawLoading ? currentTranslations.withdrawFormSubmitLoading : currentTranslations.withdrawFormSubmit}
                    </button>
                  </form>
                </div>

              </div>

              {/* Right Column: Transaction History (5 cols) */}
              <div className="lg:col-span-5">
                <div className="glass-card p-6 sm:p-8 rounded-[32px] border border-white/5 space-y-6 h-full flex flex-col">
                  <div>
                    <h3 className="text-xl font-bold text-white serif-title italic">
                      {currentTranslations.withdrawHistTitle}
                    </h3>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[480px]">
                    {withdrawHistory.length === 0 ? (
                      <div className="text-center py-12 text-xs text-[var(--text-muted)]" style={{ fontFamily: 'Georgia' }}>
                        {currentTranslations.withdrawHistEmpty}
                      </div>
                    ) : (
                      withdrawHistory.map((tx) => (
                        <div 
                          key={tx.id}
                          className="p-3.5 rounded-2xl border border-white/5 bg-slate-900/40 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${
                              tx.type === 'withdraw' 
                                ? tx.status === 'pending' ? 'bg-amber-500/10 text-[#f6b026] border border-[#f6b026]/10' : 'bg-red-500/10 text-red-400 border border-red-500/10' 
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                            }`}>
                              {tx.type === 'withdraw' ? (
                                <Clock className="w-4 h-4" />
                              ) : (
                                <ArrowUpRight className="w-4 h-4" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h5 className="font-bold text-white/90 truncate">{tx.description}</h5>
                              <p className="text-[10px] text-[var(--text-muted)] mt-0.5 font-mono">{new Date(tx.timestamp).toLocaleString()}</p>
                            </div>
                          </div>
                          
                          <div className="text-right flex-shrink-0">
                            <div className={`font-mono font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                            </div>
                            <div className="text-[9px] uppercase tracking-wider font-semibold mt-0.5">
                              {tx.status === 'completed' && <span className="text-emerald-400">{lang === 'ru' ? 'Выполнено' : 'Complete'}</span>}
                              {tx.status === 'pending' && <span className="text-[#f6b026] animate-pulse">{lang === 'ru' ? 'В обработке' : 'Pending'}</span>}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== REFERRALS TAB ==================== */}
          {activeTab === 'affiliate' && (
            <div className="space-y-8">
              
              <div className="glass-card p-6 sm:p-10 rounded-[32px] border border-white/5 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-[#f6b026]/5 blur-2xl pointer-events-none" />
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white serif-title italic">
                    {currentTranslations.affTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl" style={{ fontFamily: 'Georgia' }}>
                    {currentTranslations.affDesc}
                  </p>
                </div>

                {/* Referral Link Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  
                  {/* Link 1: Standard Referral */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#f6b026]" style={{ fontFamily: 'Georgia' }}>
                      {currentTranslations.affLinkTitle} (Standard)
                    </h5>
                    <p className="text-[11px] text-[var(--text-muted)] leading-tight">
                      {lang === 'ru' ? 'Стандартная партнерская ссылка, приглашающая на главную страницу.' : 'Standard affiliate redirection URL to the home landing page.'}
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={referralLink}
                        className="flex-1 bg-slate-900 px-3.5 py-2.5 rounded-xl border text-[11px] font-mono outline-none text-white border-white/5"
                      />
                      <button
                        onClick={() => handleCopyLink(referralLink, 'ref')}
                        className="px-4 py-2 rounded-xl honey-gradient text-slate-950 font-bold text-xs transition-transform flex items-center justify-center gap-1 cursor-pointer select-none"
                      >
                        {copied && copiedLinkType === 'ref' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied && copiedLinkType === 'ref' ? currentTranslations.copied : currentTranslations.copyBtn}</span>
                      </button>
                    </div>
                  </div>

                  {/* Link 2: Short referral code */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#f6b026]" style={{ fontFamily: 'Georgia' }}>
                      {lang === 'ru' ? 'Ваш уникальный ID код' : 'Your Unique Referral Code'}
                    </h5>
                    <p className="text-[11px] text-[var(--text-muted)] leading-tight">
                      {lang === 'ru' ? 'Уникальный реферальный промокод для регистрации.' : 'Unique invite code used dynamically during registration validation.'}
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={user.id}
                        className="flex-1 bg-slate-900 px-3.5 py-2.5 rounded-xl border text-[11px] font-mono outline-none text-white border-white/5"
                      />
                      <button
                        onClick={() => handleCopyLink(user.id, 'short')}
                        className="px-4 py-2 rounded-xl honey-gradient text-slate-950 font-bold text-xs transition-transform flex items-center justify-center gap-1 cursor-pointer select-none"
                      >
                        {copied && copiedLinkType === 'short' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied && copiedLinkType === 'short' ? currentTranslations.copied : currentTranslations.copyBtn}</span>
                      </button>
                    </div>
                  </div>

                </div>

                {/* Social Share Buttons */}
                <div className="pt-4 space-y-3">
                  <h4 className="text-sm font-bold text-white font-sans">
                    {currentTranslations.affShareTitle}
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {/* Telegram */}
                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(lang === 'ru' ? 'Привет! Зарегистрируйся в Honeygain по моей ссылке и мгновенно получи $3.00 на свой баланс! 🍯' : 'Hey! Register on Honeygain via my link and instantly claim your $3.00 welcome bonus! 🍯')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-[#229ED9]/10 border border-[#229ED9]/20 text-[#229ED9] hover:bg-[#229ED9]/20 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <i className="fa-brands fa-telegram text-base"></i>
                      <span>Telegram</span>
                    </a>
                    {/* WhatsApp */}
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent((lang === 'ru' ? 'Привет! Получи $3.00 при регистрации по моей ссылке в Honeygain: ' : 'Hey! Claim your $3.00 gift by registering via my link in Honeygain: ') + referralLink)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <i className="fa-brands fa-whatsapp text-base"></i>
                      <span>WhatsApp</span>
                    </a>
                    {/* Twitter/X */}
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(lang === 'ru' ? 'Получите гарантированные $3.00 сразу при регистрации в Honeygain!' : 'Get a guaranteed $3.00 welcome bonus instantly on Honeygain!')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <i className="fa-brands fa-x-twitter text-base"></i>
                      <span>Twitter / X</span>
                    </a>
                    {/* VK */}
                    <a
                      href={`https://vk.com/share.php?url=${encodeURIComponent(referralLink)}&title=${encodeURIComponent(lang === 'ru' ? 'Получить бонус $3 Honeygain бесплатно' : 'Claim $3.00 Honeygain bonus')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-[#0077FF]/10 border border-[#0077FF]/20 text-[#0077FF] hover:bg-[#0077FF]/20 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <i className="fa-brands fa-vk text-base"></i>
                      <span>ВКонтакте</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Instructions Guide Cards */}
              <div className="glass-card p-6 sm:p-8 rounded-[32px] border border-white/5 space-y-6">
                <h3 className="text-lg font-bold text-white serif-title italic">
                  🚀 {currentTranslations.affStepTitle}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[var(--text-muted)] leading-relaxed" style={{ fontFamily: 'Georgia' }}>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#f6b026] flex items-center justify-center font-bold">1</div>
                    <p>{currentTranslations.affStep1}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#f6b026] flex items-center justify-center font-bold">2</div>
                    <p>{currentTranslations.affStep2}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#f6b026] flex items-center justify-center font-bold">3</div>
                    <p>{currentTranslations.affStep3}</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ==================== SETTINGS TAB ==================== */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Profile Details Card (5 cols) */}
              <div className="md:col-span-5">
                <div className="glass-card p-6 sm:p-8 rounded-[32px] border border-white/5 space-y-6">
                  <h3 className="text-lg font-bold text-white serif-title italic flex items-center gap-2">
                    <User className="w-5 h-5 text-[#f6b026]" />
                    <span>{currentTranslations.setAccountDetails}</span>
                  </h3>

                  <div className="space-y-4 text-xs font-light" style={{ fontFamily: 'Georgia' }}>
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{currentTranslations.setEmail}</span>
                      <span className="font-bold text-white/95">{user.email}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{currentTranslations.setUsername}</span>
                      <span className="font-bold text-white/95">{user.username}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{currentTranslations.setUserId}</span>
                      <span className="font-mono text-white/70">{user.id}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{currentTranslations.setRegDate}</span>
                      <span className="font-bold text-white/95">{new Date(user.registeredAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Change Form Card (7 cols) */}
              <div className="md:col-span-7">
                <div className="glass-card p-6 sm:p-8 rounded-[32px] border border-white/5 space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white serif-title italic flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-[#f6b026]" />
                      <span>{currentTranslations.setPassTitle}</span>
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] font-light" style={{ fontFamily: 'Georgia' }}>
                      {currentTranslations.settingsDesc}
                    </p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    {/* Current Password */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-[var(--text-muted)]" style={{ fontFamily: 'Georgia' }}>
                        {currentTranslations.setOldPass}
                      </label>
                      <input
                        type="password"
                        required
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl border outline-none text-xs transition-colors bg-[var(--input-bg)] text-white"
                        style={{ borderColor: 'var(--card-border)' }}
                      />
                    </div>

                    {/* New Password */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-[var(--text-muted)]" style={{ fontFamily: 'Georgia' }}>
                        {currentTranslations.setNewPass}
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl border outline-none text-xs transition-colors bg-[var(--input-bg)] text-white"
                        style={{ borderColor: 'var(--card-border)' }}
                      />
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-[var(--text-muted)]" style={{ fontFamily: 'Georgia' }}>
                        {currentTranslations.setConfirmPass}
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl border outline-none text-xs transition-colors bg-[var(--input-bg)] text-white"
                        style={{ borderColor: 'var(--card-border)' }}
                      />
                    </div>

                    {/* Feedback Status */}
                    {passwordStatus.type && (
                      <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-2 ${
                        passwordStatus.type === 'success' 
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                          : 'bg-red-500/5 border-red-500/20 text-red-400'
                      }`}>
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{passwordStatus.message}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="w-full py-3.5 px-5 rounded-xl honey-gradient text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                      style={{ fontFamily: 'Georgia' }}
                    >
                      <span>{passwordLoading ? currentTranslations.setPassBtnLoading : currentTranslations.setPassBtn}</span>
                    </button>
                  </form>
                </div>
              </div>

            </div>
          )}

        </motion.div>
      </AnimatePresence>

    </div>
  );
}
