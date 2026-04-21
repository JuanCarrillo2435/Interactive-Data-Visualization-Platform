import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import type { WidgetLayout } from '@/store/useStore';
import { MetricWidget } from '@/components/widgets/MetricWidget';
import { TimeSeriesWidget } from '@/components/widgets/TimeSeriesWidget';
import { HeatmapWidget } from '@/components/widgets/HeatmapWidget';
import { TableWidget } from '@/components/widgets/TableWidget';
import { translations } from '@/i18n/translations';

export function GridDashboard() {
  const { widgets, reorderWidgets, language } = useStore();
  const t = translations[language].dashboard;
  const [internalWidgets, setInternalWidgets] = useState([...widgets]);

  React.useEffect(() => {
    setInternalWidgets(widgets);
  }, [widgets]);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Transparent or custom drag image could go here
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newWidgets = [...internalWidgets];
    const [removed] = newWidgets.splice(draggedIndex, 1);
    newWidgets.splice(dropIndex, 0, removed);
    
    setInternalWidgets(newWidgets);
    reorderWidgets(draggedIndex, dropIndex);
    setDraggedIndex(null);
  };

  const renderWidget = (widget: WidgetLayout) => {
    switch (widget.type) {
      case 'metric':
        return <MetricWidget id={widget.i} title={t.totalRevenue} value={425000} trend={12.5} prefix="$" />;
      case 'time-series':
        return <TimeSeriesWidget id={widget.i} />;
      case 'heatmap':
        return <HeatmapWidget id={widget.i} />;
      case 'table':
        return <TableWidget id={widget.i} />;
      default:
        return <div>{t.unknownWidget}</div>;
    }
  };

  const getColSpan = (w: number) => {
    switch (w) {
      case 1: return 'col-span-1';
      case 2: return 'col-span-2 md:col-span-2';
      case 3: return 'col-span-1 md:col-span-3';
      case 4: return 'col-span-1 md:col-span-2 xl:col-span-4';
      default: return 'col-span-1';
    }
  };

  const getRowSpan = (h: number) => {
    switch (h) {
      case 1: return 'h-40';
      case 2: return 'h-80';
      case 3: return 'h-[36rem]'; 
      default: return 'h-64';
    }
  };

  return (
    <div className="p-8 pb-20 w-full min-h-screen">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">{t.platformOverview}</h1>
          <p className="text-muted-foreground text-sm">{t.analyzeMetrics}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 auto-rows-max">
        {internalWidgets.map((widget, index) => (
          <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            key={widget.i} 
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, index)}
            className={`${getColSpan(widget.w)} ${getRowSpan(widget.h)} relative cursor-grab active:cursor-grabbing hover:z-50 transition-shadow`}
          >
            {renderWidget(widget)}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
