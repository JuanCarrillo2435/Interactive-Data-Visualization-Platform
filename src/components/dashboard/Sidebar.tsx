import React from 'react';
import { Home, BarChart2, Layers, Settings, LogOut, Hexagon } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { translations } from '@/i18n/translations';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { language } = useStore();
  const t = translations[language].sidebar;

  const menuItems = [
    { icon: <Home size={20} />, label: t.dashboard, active: true },
    { icon: <BarChart2 size={20} />, label: t.analytics },
    { icon: <Layers size={20} />, label: t.integrations },
    { icon: <Settings size={20} />, label: t.settings },
  ];

  return (
    <aside className="w-64 h-screen border-r border-border bg-card/40 backdrop-blur-3xl flex flex-col pt-6 pb-6 shadow-2xl relative z-10 flex-shrink-0">
      <div className="px-6 flex items-center gap-3 mb-10 group cursor-pointer">
        <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          <Hexagon size={24} className="fill-current" />
        </div>
        <span className="font-bold text-xl tracking-tight text-white/90">Apex Data</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 group relative overflow-hidden",
              item.active ? "text-primary bg-primary/10 font-medium" : "text-muted-foreground hover:bg-white/5 hover:text-white"
            )}
          >
            {item.active && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(59,130,246,1)] rounded-r-full" />
            )}
            <div className={cn("transition-transform duration-200 group-hover:scale-110", item.active && "drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]")}>
              {item.icon}
            </div>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="px-4 mt-auto">
        <div className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer transition-colors duration-200">
          <LogOut size={20} />
          <span>{t.signOut}</span>
        </div>
      </div>
    </aside>
  );
}
