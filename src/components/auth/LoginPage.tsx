import React, { useState, useEffect, useRef } from 'react';
import { 
  Plane, 
  Phone, 
  Send, 
  Sparkles, 
  Globe, 
  Moon, 
  Sun, 
  ArrowLeft, 
  RotateCw, 
  ShieldCheck, 
  CheckCircle2, 
  User,
  Check
} from 'lucide-react';
import { Language, ThemeMode, UserProfile } from '../../types';
import { translations } from '../../data/translations';

interface LoginPageProps {
  language: Language;
  onSetLanguage: (lang: Language) => void;
  theme: ThemeMode;
  onSetTheme: (mode: ThemeMode) => void;
  onLoginSuccess: (user: Partial<UserProfile>, isGuest?: boolean) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  language,
  onSetLanguage,
  theme,
  onSetTheme,
  onLoginSuccess,
  onShowToast
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  const [authMethod, setAuthMethod] = useState<'phone' | 'telegram'>('phone');
  
  // Phone Form State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  // OTP inputs refs
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isOtpStep && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOtpStep, resendTimer]);

  // Format raw digits to +998 (XX) XXX-XX-XX display
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneError('');
    let val = e.target.value.replace(/\D/g, '');
    
    // Auto strip leading 998 if typed
    if (val.startsWith('998')) {
      val = val.substring(3);
    }
    // Limit to 9 digits (Uzbek mobile length)
    val = val.substring(0, 9);
    setPhoneNumber(val);
  };

  const getFormattedPhone = () => {
    if (!phoneNumber) return '';
    let res = '';
    if (phoneNumber.length > 0) res += phoneNumber.substring(0, 2);
    if (phoneNumber.length >= 3) res += ' ' + phoneNumber.substring(2, 5);
    if (phoneNumber.length >= 6) res += ' ' + phoneNumber.substring(5, 7);
    if (phoneNumber.length >= 8) res += ' ' + phoneNumber.substring(7, 9);
    return res;
  };

  // Submit phone -> Go to OTP step
  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (phoneNumber.length < 9) {
      setPhoneError(t.invalidPhone);
      return;
    }

    setIsLoading(true);
    setPhoneError('');

    setTimeout(() => {
      setIsLoading(false);
      setIsOtpStep(true);
      setResendTimer(60);
      setOtpCode(['', '', '', '']);
      onShowToast(
        language === 'uz' ? "SMS kod yuborildi (sinov uchun: 1234)" : (language === 'ru' ? "SMS код отправлен (для теста: 1234)" : "SMS code sent (test: 1234)"), 
        'info'
      );
      // Focus first OTP field
      setTimeout(() => {
        otpInputs.current[0]?.focus();
      }, 100);
    }, 600);
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newCode = [...otpCode];
    newCode[index] = digit;
    setOtpCode(newCode);

    if (digit && index < 3) {
      otpInputs.current[index + 1]?.focus();
    }

    // If filled 4 digits, auto verify
    if (digit && index === 3 && newCode.every(d => d !== '')) {
      verifyCode(newCode.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  // Verify code
  const verifyCode = (codeStr: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const fullPhone = `+998 ${getFormattedPhone()}`;
      onShowToast(t.loginSuccess, 'success');
      onLoginSuccess({
        phone: fullPhone,
        name: language === 'uz' ? "Sayohatchi" : (language === 'ru' ? "Путешественник" : "Traveler"),
        telegram: `@user_${phoneNumber.slice(-4)}`
      });
    }, 700);
  };

  // Fast Telegram Login
  const handleTelegramLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onShowToast(t.loginSuccess, 'success');
      onLoginSuccess({
        name: "Jasur Rahimov",
        phone: "+998 90 123 45 67",
        telegram: "@jasur_traveler",
        cashback: 148.5
      });
    }, 600);
  };

  // Quick Demo Login
  const handleDemoLogin = () => {
    onShowToast(language === 'uz' ? "Demo profil bilan ulandi" : "Вход выполнен с демо-профилем", 'success');
    onLoginSuccess({
      name: "Jasur Rahimov",
      phone: "+998 90 123 45 67",
      telegram: "@jasur_traveler",
      cashback: 148.5
    });
  };

  // Guest Mode
  const handleGuestLogin = () => {
    onShowToast(t.guestSuccess, 'info');
    onLoginSuccess({
      name: language === 'uz' ? "Mehmon" : (language === 'ru' ? "Гость" : "Guest"),
      phone: "",
      telegram: ""
    }, true);
  };

  // Autofill test phone
  const handleFillDemoPhone = () => {
    setPhoneNumber('901234567');
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between p-4 transition-colors ${
      isDark ? 'bg-[#0b1325] text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Top Bar: Brand & Quick Settings */}
      <header className="flex items-center justify-between pt-2 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#ff6600] to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
            <Plane size={18} className="-rotate-45" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight leading-tight flex items-center gap-1.5">
              <span>TripCraft</span>
              <span className="text-[10px] bg-[#ff6600]/20 text-[#ff6600] px-1.5 py-0.5 rounded-full font-bold">
                TMA
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">
              Aviasales Precision
            </p>
          </div>
        </div>

        {/* Controls: Language and Theme */}
        <div className="flex items-center gap-1.5">
          {/* Language selector */}
          <div className={`flex items-center p-1 rounded-xl border text-[11px] font-bold ${
            isDark ? 'bg-[#152238] border-[#22334f]' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            {(['uz', 'ru', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onSetLanguage(lang)}
                className={`px-2 py-1 rounded-lg uppercase transition ${
                  language === lang 
                    ? 'bg-[#ff6600] text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Theme switcher */}
          <button
            onClick={() => onSetTheme(isDark ? 'light' : 'dark')}
            className={`p-2 rounded-xl border transition active:scale-95 ${
              isDark ? 'bg-[#152238] border-[#22334f] text-amber-400' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
            }`}
            title="Mavzuni almashtirish"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Main Center Card */}
      <main className="w-full max-w-md mx-auto my-auto py-4">
        
        {/* Decorative Glow Background */}
        <div className="relative">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#ff6600]/15 rounded-full blur-3xl pointer-events-none"></div>

          {/* Card Container */}
          <div className={`relative rounded-3xl border p-6 shadow-2xl backdrop-blur-xl ${
            isDark ? 'bg-[#131f37]/90 border-[#223555]' : 'bg-white border-slate-200'
          }`}>
            
            {/* Header in Card */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-tr from-[#ff6600] to-amber-500 text-white shadow-xl shadow-orange-500/25 mb-3">
                <Plane size={26} className="-rotate-45" />
              </div>
              <h2 className="text-xl font-black tracking-tight">
                {t.loginTitle}
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                {t.loginSub}
              </p>
            </div>

            {/* Auth Method Switcher Tabs */}
            <div className={`grid grid-cols-2 p-1.5 rounded-2xl border mb-6 ${
              isDark ? 'bg-[#0d1628] border-[#1f304e]' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('phone');
                  setIsOtpStep(false);
                }}
                className={`py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition active:scale-95 ${
                  authMethod === 'phone'
                    ? 'bg-[#ff6600] text-white shadow-md shadow-orange-500/30'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Phone size={14} />
                <span>{t.phoneTab}</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthMethod('telegram')}
                className={`py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition active:scale-95 ${
                  authMethod === 'telegram'
                    ? 'bg-[#0088cc] text-white shadow-md shadow-blue-500/30'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Send size={14} className="fill-current" />
                <span>{t.telegramTab}</span>
              </button>
            </div>

            {/* METHOD 1: PHONE AUTH */}
            {authMethod === 'phone' && (
              <div>
                {!isOtpStep ? (
                  /* Step 1: Phone input */
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        {t.phoneNumber}
                      </label>
                      
                      <div className={`flex items-center gap-2 px-3.5 py-3 rounded-2xl border transition focus-within:ring-2 focus-within:ring-[#ff6600] ${
                        isDark ? 'bg-[#0c1527] border-[#223554]' : 'bg-slate-50 border-slate-300'
                      }`}>
                        <div className="flex items-center gap-1.5 font-black text-sm shrink-0 border-r pr-2.5 border-slate-600/30">
                          <span className="text-base">🇺🇿</span>
                          <span>+998</span>
                        </div>
                        <input
                          type="tel"
                          value={getFormattedPhone()}
                          onChange={handlePhoneChange}
                          placeholder="90 123 45 67"
                          autoFocus
                          className={`w-full bg-transparent text-base font-bold tracking-wider focus:outline-none placeholder:text-slate-500 ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}
                        />
                      </div>

                      {phoneError ? (
                        <p className="text-[11px] text-red-500 font-semibold mt-1.5">
                          {phoneError}
                        </p>
                      ) : (
                        <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
                          <span>{t.enterPhoneDesc}</span>
                          <button
                            type="button"
                            onClick={handleFillDemoPhone}
                            className="text-[#ff6600] font-bold hover:underline"
                          >
                            Demo: 90 123 45 67
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || phoneNumber.length < 9}
                      className={`w-full py-3.5 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2 transition active:scale-95 ${
                        phoneNumber.length >= 9 && !isLoading
                          ? 'bg-[#ff6600] hover:bg-[#e65c00] text-white shadow-orange-500/30'
                          : 'bg-slate-700/50 text-slate-400 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      {isLoading ? (
                        <RotateCw size={18} className="animate-spin text-white" />
                      ) : (
                        <>
                          <Sparkles size={16} className="text-amber-200" />
                          <span>{t.btnSendCode}</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Step 2: OTP Code input */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setIsOtpStep(false)}
                        className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition"
                      >
                        <ArrowLeft size={14} />
                        <span>{t.changePhone}</span>
                      </button>
                      <span className="text-xs font-black text-[#ff6600]">
                        +998 {getFormattedPhone()}
                      </span>
                    </div>

                    <div className="text-center py-1">
                      <h3 className="text-base font-black">
                        {t.otpTitle}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {t.otpSubtitle}: <span className="font-bold text-white">+998 {getFormattedPhone()}</span>
                      </p>
                    </div>

                    {/* 4 Digit Boxes */}
                    <div className="flex justify-center gap-3 my-3">
                      {otpCode.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => { otpInputs.current[index] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className={`w-14 h-14 text-center text-2xl font-black rounded-2xl border transition focus:outline-none focus:ring-2 focus:ring-[#ff6600] ${
                            digit 
                              ? 'border-[#ff6600] bg-orange-500/10 text-[#ff6600]' 
                              : isDark ? 'bg-[#0c1527] border-[#223554] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Resend code timer */}
                    <div className="text-center text-xs">
                      {resendTimer > 0 ? (
                        <p className="text-slate-400">
                          {t.resendIn}{' '}
                          <span className="font-black text-[#ff6600]">
                            00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}
                          </span>
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setResendTimer(60);
                            onShowToast(language === 'uz' ? "SMS kod qayta yuborildi" : "Код отправлен повторно", 'info');
                          }}
                          className="text-[#ff6600] font-black hover:underline inline-flex items-center gap-1"
                        >
                          <RotateCw size={12} />
                          <span>{t.resendCode}</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={isLoading || otpCode.some(d => !d)}
                      onClick={() => verifyCode(otpCode.join(''))}
                      className={`w-full py-3.5 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2 transition active:scale-95 ${
                        !otpCode.some(d => !d) && !isLoading
                          ? 'bg-[#ff6600] hover:bg-[#e65c00] text-white shadow-orange-500/30'
                          : 'bg-slate-700/50 text-slate-400 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      {isLoading ? (
                        <RotateCw size={18} className="animate-spin text-white" />
                      ) : (
                        <>
                          <CheckCircle2 size={16} />
                          <span>{t.btnVerify}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* METHOD 2: TELEGRAM AUTH */}
            {authMethod === 'telegram' && (
              <div className="space-y-4 text-center py-2">
                <div className="p-4 rounded-2xl border bg-[#0088cc]/10 border-[#0088cc]/30 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0088cc] flex items-center justify-center text-white shrink-0 shadow-md">
                      <Send size={20} className="fill-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">
                        Telegram Mini App Auth
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        {t.telegramLoginDesc}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTelegramLogin}
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[#0088cc] hover:bg-[#007ab8] text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2.5 transition active:scale-95"
                >
                  {isLoading ? (
                    <RotateCw size={18} className="animate-spin text-white" />
                  ) : (
                    <>
                      <Send size={18} className="fill-white" />
                      <span>{t.telegramLoginBtn}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5 justify-center text-[11px] text-slate-400">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>End-to-end encrypted Telegram WebApp login</span>
                </div>
              </div>
            )}

            {/* DIVIDER & GUEST / DEMO BUTTONS */}
            <div className="mt-6 pt-5 border-t border-slate-700/40 space-y-2.5">
              
              {/* Quick Demo Fill Login */}
              <button
                type="button"
                onClick={handleDemoLogin}
                className={`w-full py-2.5 px-3 rounded-xl border text-xs font-black flex items-center justify-center gap-2 transition active:scale-95 ${
                  isDark 
                    ? 'bg-[#162540] border-[#293f66] text-amber-300 hover:bg-[#1c3052]' 
                    : 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100'
                }`}
              >
                <Sparkles size={14} className="text-amber-400" />
                <span>{t.demoLoginBtn}</span>
              </button>

              {/* Continue as Guest */}
              <button
                type="button"
                onClick={handleGuestLogin}
                className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition active:scale-95 flex items-center justify-center gap-1.5 ${
                  isDark 
                    ? 'bg-transparent border-[#233552] text-slate-300 hover:bg-[#16233a]' 
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <User size={13} className="text-slate-400" />
                <span>{t.guestBtn}</span>
              </button>

              <p className="text-[10px] text-center text-slate-400">
                {t.guestNote}
              </p>
            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="text-center py-2 text-[11px] text-slate-500 font-medium">
        <span>TripCraft TMA • Aviasales Experience v2.4</span>
      </footer>

    </div>
  );
};
