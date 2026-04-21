import React, { useEffect, useState } from 'react';
import { WidgetCard } from './WidgetCard';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { translations } from '@/i18n/translations';

interface MetricWidgetProps {
  id: string;
  title: string;
  value: number;
  trend: number;
  prefix?: string;
  suffix?: string;
}

export function MetricWidget({ id, title, value, trend, prefix = '', suffix = '' }: MetricWidgetProps) {
  const { language } = useStore();
  const t = translations[language].dashboard;
  const [displayValue, setDisplayValue] = useState(0);
  const count = useMotionValue(0);

  useEffect(() => {
    const animation = animate(count, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (latest) => {
        setDisplayValue(Math.floor(latest));
      }
    });

    return animation.stop;
  }, [value, count]);

  const isPositive = trend >= 0;

  return (
    <WidgetCard id={id} title={title}>
      <div className="flex flex-col h-full justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-light tracking-tight text-white flex items-baseline gap-1"
        >
          {prefix && <span className="text-2xl text-muted-foreground">{prefix}</span>}
          <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            {displayValue.toLocaleString()}
          </span>
          {suffix && <span className="text-xl text-muted-foreground">{suffix}</span>}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4 flex items-center gap-2 text-sm"
        >
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${isPositive ? 'text-green-400 bg-green-400/10' : 'text-destructive bg-destructive/10'}`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span className="font-medium">{Math.abs(trend)}%</span>
          </div>
          <span className="text-muted-foreground">{t.vsLast30Days}</span>
        </motion.div>
        
        {/* Decorative background chart line */}
        <svg className="absolute bottom-0 left-0 w-full h-1/2 opacity-20 pointer-events-none" viewBox="0 0 100 50" preserveAspectRatio="none">
          <path 
            d={isPositive ? "M0 50 C20 40, 40 45, 60 20 S80 10, 100 0 L100 50 Z" : "M0 0 C20 10, 40 5, 60 30 S80 40, 100 50 L0 50 Z"} 
            fill={`currentColor`} 
            className={isPositive ? 'text-green-500' : 'text-red-500'}
          />
        </svg>
      </div>
    </WidgetCard>
  );
}
