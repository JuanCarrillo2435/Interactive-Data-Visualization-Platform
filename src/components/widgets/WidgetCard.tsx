import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { GripHorizontal, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

interface WidgetCardProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function WidgetCard({ id, title, children, className }: WidgetCardProps) {
  const { removeWidget } = useStore();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative flex flex-col bg-card/60 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors shadow-lg cursor-default h-full w-full",
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.05),
              transparent 80%
            )
          `,
        }}
      />
      
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 relative z-10 transition-colors group-hover:bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary/80 shadow-[0_0_5px_rgba(59,130,246,0.6)]" />
          <h3 className="text-sm font-medium tracking-wide text-white/90">{title}</h3>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 text-muted-foreground hover:text-white rounded-md hover:bg-white/10 transition-colors cursor-grab active:cursor-grabbing handle">
            <GripHorizontal size={14} />
          </button>
          <button 
            onClick={() => removeWidget(id)}
            className="p-1.5 text-muted-foreground hover:text-destructive rounded-md hover:bg-destructive/20 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-4 relative z-10 overflow-hidden h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}
