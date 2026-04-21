import React, { useMemo } from 'react';
import { WidgetCard } from './WidgetCard';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { translations } from '@/i18n/translations';

export function HeatmapWidget({ id }: { id: string }) {
  const { language } = useStore();
  const t = translations[language].dashboard;

  const rows = 12;
  const cols = 24; // 24 hours

  const data = useMemo(() => {
    const arr = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Generate values mostly higher in middle hours
        const hourFactor = 1 - Math.abs(c - 12) / 12; 
        const val = Math.random() * hourFactor * 100;
        arr.push({ r, c, val });
      }
    }
    return arr;
  }, []);

  const getColor = (val: number) => {
    if (val < 10) return 'bg-white/5';
    if (val < 30) return 'bg-indigo-500/20';
    if (val < 60) return 'bg-indigo-500/50';
    if (val < 85) return 'bg-indigo-400/80';
    return 'bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.8)]';
  };

  const getDelay = (c: number, r: number) => {
    const centerC = cols / 2;
    const centerR = rows / 2;
    const dist = Math.sqrt(Math.pow(c - centerC, 2) + Math.pow(r - centerR, 2));
    return dist * 0.05;
  };

  return (
    <WidgetCard id={id} title={t.activityHeatmap}>
      <div className="w-full h-full flex flex-col mt-2">
        <div 
          className="flex-1 grid gap-1"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {data.map((cell, i) => (
            <motion.div 
              key={i} 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: getDelay(cell.c, cell.r), duration: 0.5, type: 'spring', bounce: 0.3 }}
              className={`rounded-sm ${getColor(cell.val)} transition-colors duration-300 hover:!scale-150 hover:z-10 hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] cursor-crosshair`}
              title={`Value: ${cell.val.toFixed(1)}`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-3 text-xs text-muted-foreground px-1">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>23:59</span>
        </div>
      </div>
    </WidgetCard>
  );
}
