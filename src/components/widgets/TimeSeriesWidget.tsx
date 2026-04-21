import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { WidgetCard } from './WidgetCard';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/store/useStore';
import { translations } from '@/i18n/translations';

const generateData = () => {
  const data = [];
  let currentVal = 1000;
  for (let i = 0; i < 60; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (60 - i));
    currentVal = currentVal + (Math.random() - 0.4) * 200;
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(100, currentVal),
      baseline: currentVal * 0.8
    });
  }
  return data;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const baselineVal = payload.find((p: any) => p.dataKey === 'baseline')?.value;
    const value = payload.find((p: any) => p.dataKey === 'value')?.value;
    // @ts-ignore
    const t = translations[window.__APP_LANG__ || 'en'].dashboard;

    return (
      <motion.div
        initial={{ opacity: 0, y: 5, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300, duration: 0.2 }}
        className="px-3 py-2.5 rounded-xl border border-white/10 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.5)] bg-black/60 backdrop-blur-xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 pointer-events-none" />
        <p className="text-white/60 text-xs mb-1.5 font-medium relative z-10">{label}</p>
        <div className="flex items-end gap-3 relative z-10">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">{t.revenue}</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))] animate-pulse" />
              <p className="text-white font-bold tracking-tight text-sm">
                ${(value / 1000).toFixed(2)}k
              </p>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">{t.baseline}</span>
            <div className="flex items-center gap-1.5 opacity-80">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <p className="text-white/80 text-xs font-medium">
                ${(baselineVal / 1000).toFixed(2)}k
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  return null;
};

export function TimeSeriesWidget({ id }: { id: string }) {
  const { language } = useStore();
  const t = translations[language].dashboard;

  // Hack for custom tooltip to read current language outside component scope easily
  // In a real app we would pass it via context or props directly to the tooltip
  if (typeof window !== 'undefined') {
    (window as any).__APP_LANG__ = language;
  }

  const { data, isLoading } = useQuery({
    queryKey: ['timeSeries', id],
    queryFn: async () => {
      // Simulate network request
      await new Promise(r => setTimeout(r, 1000));
      return generateData();
    },
    refetchInterval: 5000, // Real-time update simulation
  });

  return (
    <WidgetCard id={id} title={t.realTimeAnalytics}>
      {isLoading ? (
        <div className="w-full h-full flex flex-col gap-2 justify-end pb-4 pt-8">
          {Array.from({ length: 15 }).map((_, i) => (
             <div key={i} className="flex-1 bg-white/5 animate-pulse rounded-t-sm" style={{ height: `${Math.random() * 100}%` }} />
          ))}
        </div>
      ) : (
        <div className="w-full h-full pt-4 -ml-4 min-h-[250px] flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(280, 80%, 60%)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="hsl(280, 80%, 60%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 11}} 
                tickFormatter={(val) => val.split('-').slice(1).join('/')}
                axisLine={false}
                tickLine={false}
                minTickGap={20}
              />
              <YAxis 
                tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 11}} 
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `$${(val/1000).toFixed(1)}k`}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="baseline" 
                stroke="hsl(280, 80%, 60%)" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorBaseline)" 
                animationDuration={2000}
                animationEasing="ease-out"
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                animationDuration={2000}
                animationEasing="ease-out"
                activeDot={{ r: 6, strokeWidth: 0, fill: 'hsl(var(--primary))', className: 'drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </WidgetCard>
  );
}
