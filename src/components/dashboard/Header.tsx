import React from 'react';
import { Search, Bell, WifiOff, Wifi, Globe } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { translations } from '@/i18n/translations';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const { isOffline, toggleOffline, searchQuery, setSearchQuery, language, toggleLanguage } = useStore();
  const t = translations[language].header;

  return (
    <header className="h-20 border-b border-border/50 bg-background/60 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-20">
      <div className="flex items-center w-full max-w-xl">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-white placeholder:text-muted-foreground shadow-inner"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={toggleOffline}
          className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-white/10 bg-black/40 transition-all hover:bg-white/5"
        >
          <AnimatePresence mode="wait">
            {isOffline ? (
              <motion.div key="offline" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2 text-destructive">
                <WifiOff size={14} className="animate-pulse" />
                <span>{t.offlineSync}</span>
              </motion.div>
            ) : (
              <motion.div key="online" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2 text-green-400">
                <Wifi size={14} />
                <span>{t.liveMode}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 bg-black/40 transition-all hover:bg-white/5 text-muted-foreground hover:text-white uppercase tracking-wider"
        >
          <Globe size={14} />
          {language}
        </button>

        <button className="relative text-muted-foreground hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border border-background shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse"></span>
        </button>

        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-white/10 shadow-[0_0_15px_rgba(99,102,241,0.4)] cursor-pointer hover:scale-105 transition-transform" />
      </div>
    </header>
  );
}
