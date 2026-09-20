import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck } from 'lucide-react';
import { PaymentCard, Language, ThemeMode } from '../../types';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (card: Omit<PaymentCard, 'id'>) => void;
  language: Language;
  theme: ThemeMode;
}

export const AddCardModal: React.FC<AddCardModalProps> = ({
  isOpen,
  onClose,
  onAddCard,
  language,
  theme
}) => {
  if (!isOpen) return null;

  const [type, setType] = useState<'HUMO' | 'UZCARD' | 'VISA'>('HUMO');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [bank, setBank] = useState('');

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join(' ') : digits;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 2) {
      setExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2)}`);
    } else {
      setExpiry(cleaned);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawNum = cardNumber.replace(/\s+/g, '');
    if (rawNum.length < 4) return;

    const last4 = rawNum.slice(-4);
    const bankName = bank.trim() || (type === 'HUMO' ? "O'zbekiston banki (UZS)" : (type === 'VISA' ? "Xalqaro bank (USD)" : "Milliy bank (UZS)"));

    onAddCard({
      type,
      last4,
      bank: bankName,
      isPrimary: false,
      expiry: expiry || '12/28'
    });

    onClose();
  };

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className={`w-full max-w-md rounded-t-[32px] sm:rounded-3xl p-5 space-y-4 shadow-2xl border transition-colors ${
        isDark ? 'bg-[#121c2e] border-[#263756] text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between pb-2 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <CreditCard size={18} className="text-[#ff6600]" />
            <h3 className="text-sm font-bold">
              {language === 'uz' ? "Yangi Karta Qo'shish" : (language === 'ru' ? "Добавить новую карту" : "Add Payment Card")}
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
              isDark ? 'bg-[#1c2942] text-slate-300' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Card Type Selector */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1.5 font-medium">
              {language === 'uz' ? "Karta tizimi" : (language === 'ru' ? "Платежная система" : "Card Type")}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['HUMO', 'UZCARD', 'VISA'] as const).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-2 text-xs font-black rounded-xl border transition active:scale-95 ${
                    type === t
                      ? 'border-[#ff6600] bg-[#ff6600]/20 text-[#ff6600]'
                      : isDark
                      ? 'border-[#253755] bg-[#162339] text-slate-300 hover:border-slate-500'
                      : 'border-slate-300 bg-slate-100 text-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1 font-medium">
              {language === 'uz' ? "Karta raqami (16 xonali)" : (language === 'ru' ? "Номер карты (16 цифр)" : "Card Number")}
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder={type === 'VISA' ? "4000 1234 5678 9010" : (type === 'HUMO' ? "9860 1234 5678 4892" : "8600 1234 5678 1234")}
              className={`w-full rounded-xl px-3 py-2.5 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#ff6600] border ${
                isDark ? 'bg-[#172338] border-[#273854] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1 font-medium">
                {language === 'uz' ? "Muddati (MM/YY)" : (language === 'ru' ? "Срок действия" : "Expiry")}
              </label>
              <input
                type="text"
                value={expiry}
                onChange={handleExpiryChange}
                placeholder="10/28"
                maxLength={5}
                className={`w-full rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#ff6600] border ${
                  isDark ? 'bg-[#172338] border-[#273854] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1 font-medium">
                {language === 'uz' ? "Bank nomi" : (language === 'ru' ? "Банк" : "Bank Name")}
              </label>
              <input
                type="text"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                placeholder="Ipak Yo'li, Kapital..."
                className={`w-full rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#ff6600] border ${
                  isDark ? 'bg-[#172338] border-[#273854] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 mt-2"
          >
            <ShieldCheck size={16} />
            <span>{language === 'uz' ? "Kartani Bog'lash (Xavfsiz)" : (language === 'ru' ? "Привязать карту (Безопасно)" : "Link Card Securely")}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
