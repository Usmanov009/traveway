import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { UserProfile, Language, ThemeMode } from '../../types';

interface EditProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Partial<UserProfile>) => void;
  language: Language;
  theme: ThemeMode;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
  language,
  theme
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [telegram, setTelegram] = useState(user.telegram);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name, phone, telegram });
    onClose();
  };

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className={`w-full max-w-md rounded-t-[32px] sm:rounded-3xl p-5 space-y-4 shadow-2xl border transition-colors ${
        isDark ? 'bg-[#121c2e] border-[#263756] text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between pb-2 border-b border-slate-700/50">
          <h3 className="text-sm font-bold">
            {language === 'uz' ? "Profil Ma'lumotlarini Tahrirlash" : (language === 'ru' ? "Редактировать Профиль" : "Edit Profile Details")}
          </h3>
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
          <div>
            <label className="text-[11px] text-slate-400 block mb-1 font-medium">
              {language === 'uz' ? "Ism va Familiya" : (language === 'ru' ? "Имя и Фамилия" : "Full Name")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ff6600] border ${
                isDark ? 'bg-[#172338] border-[#273854] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1 font-medium">
              {language === 'uz' ? "Telefon raqam" : (language === 'ru' ? "Номер телефона" : "Phone Number")}
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ff6600] border ${
                isDark ? 'bg-[#172338] border-[#273854] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1 font-medium">
              Telegram Username
            </label>
            <input
              type="text"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              className={`w-full rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ff6600] border ${
                isDark ? 'bg-[#172338] border-[#273854] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#ff6600] hover:bg-[#e65c00] active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
          >
            <Check size={16} />
            <span>{language === 'uz' ? "Saqlash" : (language === 'ru' ? "Сохранить" : "Save Changes")}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
