import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Lock, LogIn, UserPlus, X, Coins, ShieldCheck, HelpCircle, Gift, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ru' | 'en';
  onLoginSuccess: (user: any) => void;
}

export function AuthModal({ isOpen, onClose, lang, onLoginSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register fields
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDevPopup, setShowDevPopup] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<any | null>(null);

  const resetForm = () => {
    setLoginIdentifier('');
    setLoginPassword('');
    setRegUsername('');
    setRegEmail('');
    setRegPassword('');
    setError(null);
    setSuccess(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loginIdentifier,
          password: loginPassword
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || (lang === 'ru' ? 'Ошибка входа' : 'Login failed'));
      }
      
      localStorage.setItem('honeygain_auth_token', data.user.token);
      onLoginSuccess(data.user);
      resetForm();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: regUsername,
          email: regEmail,
          password: regPassword
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || (lang === 'ru' ? 'Ошибка регистрации' : 'Registration failed'));
      }

      localStorage.setItem('honeygain_auth_token', data.user.token);
      setRegisteredUser(data.user);
      setShowSuccessModal(true);
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal content card */}
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md glass-card rounded-3xl border p-6 sm:p-8 overflow-hidden shadow-2xl z-10"
            style={{ 
              backgroundColor: 'var(--header-bg)', 
              borderColor: 'var(--card-border)',
              boxShadow: '0 25px 50px -12px rgba(246, 176, 38, 0.08)'
            }}
          >
            {/* Animated decorative glow blobs inside modal */}
            <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-[#f6b026]/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-orange-500/10 blur-2xl pointer-events-none" />

            {/* Close button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header & Logo */}
            <div className="text-center mb-6">
              <div className="inline-flex w-12 h-12 rounded-2xl honey-gradient items-center justify-center text-slate-950 font-black mb-3 shadow-lg shadow-amber-500/20">
                <span className="text-lg">H</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight serif-title italic" style={{ color: 'var(--text-main)' }}>
                {lang === 'ru' ? 'Добро пожаловать' : 'Welcome to HoneyGain'}
              </h3>
              <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
                {tab === 'login' 
                  ? (lang === 'ru' ? 'Войдите в личный кабинет партнера' : 'Access your affiliate personal panel')
                  : (lang === 'ru' ? 'Создайте профиль и заберите приветственные $3.00' : 'Create a profile & claim guaranteed $3.00')
                }
              </p>
            </div>

            {/* Tabs switcher */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-black/10 dark:bg-black/20 border border-[var(--card-border)] mb-6">
              <button
                onClick={() => { setTab('login'); setError(null); }}
                className={`py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  tab === 'login' 
                    ? 'bg-[#f6b026] text-slate-950 shadow-md shadow-amber-500/10' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
                style={{ fontFamily: 'Georgia' }}
              >
                <LogIn size={13} />
                {lang === 'ru' ? 'Вход' : 'Login'}
              </button>
              <button
                onClick={() => { setTab('register'); setError(null); }}
                className={`py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  tab === 'register' 
                    ? 'bg-[#f6b026] text-slate-950 shadow-md shadow-amber-500/10' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
                style={{ fontFamily: 'Georgia' }}
              >
                <UserPlus size={13} />
                {lang === 'ru' ? 'Регистрация' : 'Register'}
              </button>
            </div>

            {/* Status alerts */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2"
                  style={{ fontFamily: 'Georgia' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2"
                  style={{ fontFamily: 'Georgia' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* LOGIN FORM */}
            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
                    {lang === 'ru' ? 'Имя пользователя или Email' : 'Username or Email'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder={lang === 'ru' ? 'Например: vadim@mail.ru' : 'e.g. alex_honey'}
                      className="block w-full pl-10 pr-4 py-3 rounded-xl bg-black/10 dark:bg-black/20 border border-[var(--card-border)] focus:outline-none focus:border-[#f6b026] text-sm font-medium transition-colors"
                      style={{ color: 'var(--text-main)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
                    {lang === 'ru' ? 'Пароль' : 'Password'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-4 py-3 rounded-xl bg-black/10 dark:bg-black/20 border border-[var(--card-border)] focus:outline-none focus:border-[#f6b026] text-sm font-medium transition-colors"
                      style={{ color: 'var(--text-main)' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 rounded-xl honey-gradient text-slate-950 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                  style={{ fontFamily: 'Georgia' }}
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn size={15} />
                      <span>{lang === 'ru' ? 'Войти' : 'Sign In'}</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
                    {lang === 'ru' ? 'Имя пользователя (Логин)' : 'Username'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder={lang === 'ru' ? 'Введите никнейм' : 'Choose a unique username'}
                      className="block w-full pl-10 pr-4 py-3 rounded-xl bg-black/10 dark:bg-black/20 border border-[var(--card-border)] focus:outline-none focus:border-[#f6b026] text-sm font-medium transition-colors"
                      style={{ color: 'var(--text-main)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
                    {lang === 'ru' ? 'Электронная почта' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="example@mail.com"
                      className="block w-full pl-10 pr-4 py-3 rounded-xl bg-black/10 dark:bg-black/20 border border-[var(--card-border)] focus:outline-none focus:border-[#f6b026] text-sm font-medium transition-colors"
                      style={{ color: 'var(--text-main)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
                    {lang === 'ru' ? 'Пароль (не менее 6 символов)' : 'Password (min 6 chars)'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-4 py-3 rounded-xl bg-black/10 dark:bg-black/20 border border-[var(--card-border)] focus:outline-none focus:border-[#f6b026] text-sm font-medium transition-colors"
                      style={{ color: 'var(--text-main)' }}
                    />
                  </div>
                </div>

                {/* Special starting bonus teaser */}
                <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-2.5">
                  <Coins className="text-[#f6b026] mt-0.5 flex-shrink-0" size={16} />
                  <div>
                    <div className="text-xs font-bold text-honey" style={{ fontFamily: 'Georgia' }}>
                      {lang === 'ru' ? 'Подарок при регистрации' : 'Signup Gift Activated'}
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
                      {lang === 'ru' ? 'Вы гарантированно получите $3.00 на свой партнерский баланс сразу после регистрации.' : 'You will receive a guaranteed $3.00 added directly to your profile balance.'}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 rounded-xl honey-gradient text-slate-950 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                  style={{ fontFamily: 'Georgia' }}
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <UserPlus size={15} />
                      <span>{lang === 'ru' ? 'Создать аккаунт' : 'Create Account'}</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Safe security footer badge */}
            <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px]" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
              <ShieldCheck size={12} className="text-emerald-500" />
              <span>{lang === 'ru' ? 'Шифрование SSL защищает ваши учетные данные' : 'SSL grade security protects your credentials'}</span>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* In Development Announcement Modal Popup */}
      <AnimatePresence>
        {showDevPopup && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowDevPopup(false);
                onClose();
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />
            
            {/* Modal content card */}
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-sm glass-card rounded-3xl border p-6 sm:p-8 overflow-hidden shadow-2xl z-10 text-center"
              style={{ 
                backgroundColor: 'var(--header-bg)', 
                borderColor: 'var(--card-border)',
                boxShadow: '0 25px 50px -12px rgba(246, 176, 38, 0.15)'
              }}
            >
              {/* Animated decorative glow blobs inside modal */}
              <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-[#f6b026]/10 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-orange-500/10 blur-2xl pointer-events-none" />

              {/* Icon / Illustration */}
              <div className="mx-auto w-16 h-16 rounded-full bg-[#f6b026]/10 border border-[#f6b026]/20 flex items-center justify-center text-2xl text-[#f6b026] mb-5 shadow-inner">
                <i className="fa-solid fa-screwdriver-wrench animate-pulse"></i>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-3 tracking-tight serif-title italic" style={{ color: 'var(--text-main)' }}>
                {lang === 'ru' ? 'В разработке' : 'Under Development'}
              </h3>

              {/* Body message */}
              <p className="text-sm leading-relaxed mb-6 text-balance" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
                {lang === 'ru' 
                  ? 'Эта функция в разработке, скоро всё заработает!' 
                  : 'This feature is under development, everything will work soon!'}
              </p>

              {/* Close Button */}
              <button 
                onClick={() => {
                  setShowDevPopup(false);
                  onClose();
                }}
                className="w-full py-3 px-5 rounded-xl honey-gradient text-slate-950 font-bold text-sm tracking-wide uppercase shadow-lg shadow-amber-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                style={{ fontFamily: 'Georgia' }}
              >
                {lang === 'ru' ? 'Хорошо, буду ждать' : 'Great, I\'ll stay tuned'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Registration Success Modal Popup */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowSuccessModal(false);
                if (registeredUser) onLoginSuccess(registeredUser);
                onClose();
              }}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />
            
            {/* Modal content card */}
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md glass-card rounded-3xl border p-6 sm:p-8 overflow-hidden shadow-2xl z-10 text-center"
              style={{ 
                backgroundColor: 'var(--header-bg)', 
                borderColor: 'var(--card-border)',
                boxShadow: '0 25px 50px -12px rgba(246, 176, 38, 0.25)'
              }}
            >
              {/* Animated decorative glow blobs inside modal */}
              <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-36 h-36 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

              {/* Close Button */}
              <button 
                onClick={() => {
                  setShowSuccessModal(false);
                  if (registeredUser) onLoginSuccess(registeredUser);
                  onClose();
                }}
                className="absolute top-4 right-4 p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Icon / Illustration */}
              <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl text-emerald-400 mb-6 shadow-inner animate-bounce">
                <Gift className="w-10 h-10" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold mb-2 tracking-tight text-white font-sans">
                {lang === 'ru' ? 'Регистрация успешна!' : 'Registration Successful!'}
              </h3>
              
              {/* Body Message */}
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
                {lang === 'ru' 
                  ? 'Поздравляем! Ваш аккаунт успешно создан. В знак благодарности мы начислили приветственный бонус на ваш баланс.'
                  : 'Congratulations! Your account has been successfully created. As a welcome gift, we have credited a starting bonus to your account balance.'}
              </p>

              {/* Reward Badge */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-6 flex flex-col items-center justify-center gap-1.5 shadow-md">
                <span className="text-[10px] uppercase tracking-widest text-[#f6b026] font-bold" style={{ fontFamily: 'Georgia' }}>
                  {lang === 'ru' ? 'Приветственный бонус' : 'Welcome Starter Bonus'}
                </span>
                <span className="text-3xl sm:text-4xl font-black text-honey font-mono flex items-center justify-center gap-1">
                  <Coins className="w-8 h-8 text-[#f6b026]" />
                  +$3.00
                </span>
                <span className="text-[11px]" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia' }}>
                  {lang === 'ru' ? 'Сразу доступны для работы и колеса фортуны!' : 'Instantly available for tasks and lucky wheel!'}
                </span>
              </div>

              {/* Unlocked Features list */}
              <div className="space-y-2 mb-6 text-left max-w-xs mx-auto">
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{lang === 'ru' ? 'Баланс зачислен' : 'Bonus balance credited'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{lang === 'ru' ? 'Колесо фортуны активировано' : 'Lucky wheel activated'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{lang === 'ru' ? 'Личный кабинет готов к работе' : 'Affiliate workspace ready'}</span>
                </div>
              </div>

              {/* Submit / Proceed Button */}
              <button 
                onClick={() => {
                  setShowSuccessModal(false);
                  if (registeredUser) onLoginSuccess(registeredUser);
                  onClose();
                }}
                className="w-full py-3.5 px-5 rounded-xl honey-gradient text-slate-950 font-bold text-sm tracking-wide uppercase shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                style={{ fontFamily: 'Georgia' }}
              >
                <span>{lang === 'ru' ? 'Войти в личный кабинет' : 'Enter My Dashboard'}</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
