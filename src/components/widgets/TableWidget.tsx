import React, { useRef, useState, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { WidgetCard } from './WidgetCard';
import { Search } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { translations } from '@/i18n/translations';

const MOCK_DATA = Array.from({ length: 10000 }, (_, i) => ({
  id: `trx-${i.toString().padStart(6, '0')}`,
  amount: (Math.random() * 5000).toFixed(2),
  status: Math.random() > 0.8 ? 'Failed' : Math.random() > 0.3 ? 'Completed' : 'Pending',
  date: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
  user: `User ${(Math.random() * 1000).toFixed(0)}`,
}));

export function TableWidget({ id }: { id: string }) {
  const { language } = useStore();
  const t = translations[language].dashboard;
  const [filter, setFilter] = useState('');
  
  const filteredData = useMemo(() => {
    if (!filter) return MOCK_DATA;
    const lower = filter.toLowerCase();
    return MOCK_DATA.filter(row => 
      row.id.toLowerCase().includes(lower) || 
      row.user.toLowerCase().includes(lower) ||
      row.status.toLowerCase().includes(lower)
    );
  }, [filter]);

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: filteredData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 10,
  });

  return (
    <WidgetCard id={id} title={t.transactionsHub}>
      <div className="flex items-center mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
        <input 
          type="text" 
          placeholder={t.filterPlaceholder}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder:text-muted-foreground transition-all"
        />
      </div>

      <div className="flex-1 w-full border border-white/10 rounded-lg overflow-hidden bg-black/20 flex flex-col">
        <div className="grid grid-cols-5 bg-white/5 p-3 text-xs font-semibold text-muted-foreground tracking-wider border-b border-white/10">
          <div>{t.transactionId}</div>
          <div>{t.user}</div>
          <div>{t.amount}</div>
          <div>{t.date}</div>
          <div>{t.status}</div>
        </div>
        
        <div 
          ref={parentRef} 
          className="flex-1 overflow-auto overflow-x-hidden custom-scrollbar"
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = filteredData[virtualRow.index];
              return (
                <div
                  key={virtualRow.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="grid grid-cols-5 p-3 text-sm border-b border-white/5 text-white/80 hover:bg-white/5 transition-colors items-center"
                >
                  <div className="font-mono text-xs">{row.id}</div>
                  <div>{row.user}</div>
                  <div className="font-medium">${Number(row.amount).toLocaleString()}</div>
                  <div className="text-muted-foreground">{row.date}</div>
                  <div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      row.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      row.status === 'Failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {row.status === 'Completed' ? t.statusCompleted : row.status === 'Failed' ? t.statusFailed : t.statusPending}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}
