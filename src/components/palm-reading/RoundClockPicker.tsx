"use client";
import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoundClockPickerProps {
  value: string; // "HH:mm:ss" or "HH:mm"
  onChange: (val: string) => void;
  disabled?: boolean;
}

export function RoundClockPicker({ value, onChange, disabled }: RoundClockPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'hours' | 'minutes' | 'seconds'>('hours');
  const [hours, setHours] = useState('12');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  useEffect(() => {
    if (value && value !== 'Not specified') {
      const parts = value.split(':');
      if (parts.length >= 2) {
        let h = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const s = parts.length > 2 ? parseInt(parts[2], 10) : 0;
        
        if (!isNaN(h)) {
          setPeriod(h >= 12 ? 'PM' : 'AM');
          h = h % 12;
          if (h === 0) h = 12;
          setHours(h.toString().padStart(2, '0'));
        }
        if (!isNaN(m)) setMinutes(m.toString().padStart(2, '0'));
        if (!isNaN(s)) setSeconds(s.toString().padStart(2, '0'));
      }
    }
  }, [value, isOpen]);

  const handleUpdate = (h: string, m: string, s: string, p: 'AM'|'PM') => {
    let hh = parseInt(h, 10);
    if (p === 'PM' && hh < 12) hh += 12;
    if (p === 'AM' && hh === 12) hh = 0;
    
    onChange(`${hh.toString().padStart(2, '0')}:${m}:${s}`);
  };

  const selectValue = (val: number, forceViewChange = true) => {
    if (view === 'hours') {
      const newH = val.toString().padStart(2, '0');
      setHours(newH);
      handleUpdate(newH, minutes, seconds, period);
      if(forceViewChange) setView('minutes');
    } else if (view === 'minutes') {
      const newM = val.toString().padStart(2, '0');
      setMinutes(newM);
      handleUpdate(hours, newM, seconds, period);
      if(forceViewChange) setView('seconds');
    } else {
      const newS = val.toString().padStart(2, '0');
      setSeconds(newS);
      handleUpdate(hours, minutes, newS, period);
      if(forceViewChange) setTimeout(() => setIsOpen(false), 300);
    }
  };

  const getItems = () => {
    if (view === 'hours') return Array.from({length: 12}, (_, i) => i === 0 ? 12 : i);
    return Array.from({length: 12}, (_, i) => i * 5); // 0, 5, 10... 55
  };

  const radius = 95;
  const center = 120; // 240x240 box

  const handleCircleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - center;
      const y = e.clientY - rect.top - center;
      let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
      if (angle < 0) angle += 360;
      
      if (view === 'hours') {
        let h = Math.round(angle / 30);
        if (h === 0) h = 12;
        selectValue(h);
      } else {
        let m = Math.round(angle / 6);
        if (m === 60) m = 0;
        selectValue(m);
      }
  };

  return (
    <Popover open={isOpen} onOpenChange={(open) => { setIsOpen(open); if(open) setView('hours'); }}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-full justify-start text-left font-normal px-3", !value && "text-muted-foreground")} disabled={disabled}>
          <Clock className="mr-2 h-5 w-5 text-primary" />
          {value && value !== 'Not specified' ? `${hours}:${minutes}:${seconds} ${period}` : "Select Time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 bg-card border-primary/20 shadow-xl rounded-2xl">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-1 text-3xl font-light font-headline tracking-wider">
            <span className={cn("cursor-pointer px-1 rounded transition-colors", view==='hours' && "bg-primary/20 text-primary font-medium")} onClick={()=>setView('hours')}>{hours}</span>:
            <span className={cn("cursor-pointer px-1 rounded transition-colors", view==='minutes' && "bg-primary/20 text-primary font-medium")} onClick={()=>setView('minutes')}>{minutes}</span>:
            <span className={cn("cursor-pointer px-1 rounded transition-colors", view==='seconds' && "bg-primary/20 text-primary font-medium")} onClick={()=>setView('seconds')}>{seconds}</span>
            <div className="flex flex-col text-xs justify-center ml-2 space-y-1 font-sans">
              <button className={cn("px-2 py-0.5 rounded transition-colors", period==='AM' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")} onClick={() => { setPeriod('AM'); handleUpdate(hours, minutes, seconds, 'AM'); }}>AM</button>
              <button className={cn("px-2 py-0.5 rounded transition-colors", period==='PM' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")} onClick={() => { setPeriod('PM'); handleUpdate(hours, minutes, seconds, 'PM'); }}>PM</button>
            </div>
          </div>
          
          <div 
            className="relative w-[240px] h-[240px] bg-muted/20 rounded-full border border-primary/10 flex items-center justify-center shadow-inner cursor-pointer"
            onMouseDown={handleCircleClick}
          >
            <div className="absolute w-2.5 h-2.5 bg-primary rounded-full z-10 shadow-sm" />
            {getItems().map((num) => {
              // Calculate position for labels
              const labelAngle = (view === 'hours' ? (num === 12 ? 0 : num) * 30 : num * 6) - 90;
              const angleRad = labelAngle * (Math.PI / 180);
              const x = center + radius * Math.cos(angleRad);
              const y = center + radius * Math.sin(angleRad);
              
              const isSelected = 
                (view === 'hours' && parseInt(hours) === num) ||
                (view === 'minutes' && parseInt(minutes) === num) ||
                (view === 'seconds' && parseInt(seconds) === num);
                
              return (
                <div
                  key={num}
                  className={cn(
                    "absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 pointer-events-none",
                    isSelected ? "bg-primary text-primary-foreground shadow-md scale-110" : "text-foreground/80"
                  )}
                  style={{ left: `${x}px`, top: `${y}px` }}
                >
                  {view === 'hours' ? num : num.toString().padStart(2, '0')}
                </div>
              );
            })}
            
            {/* Draw exact position dot for minutes/seconds if not on a 5-increment */}
            {(() => {
                if (view === 'hours') return null;
                const activeNum = view === 'minutes' ? parseInt(minutes) : parseInt(seconds);
                if (activeNum % 5 === 0) return null; // Already highlighted by the label

                const exactAngle = (activeNum * 6 - 90) * (Math.PI / 180);
                const ex = center + radius * Math.cos(exactAngle);
                const ey = center + radius * Math.sin(exactAngle);
                return (
                    <div className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground shadow-md pointer-events-none" style={{ left: `${ex}px`, top: `${ey}px` }}>
                        {activeNum.toString().padStart(2, '0')}
                    </div>
                )
            })()}

            {/* Draw clock hand */}
            <svg className="absolute inset-0 pointer-events-none opacity-60 drop-shadow-sm" width="240" height="240">
                {(() => {
                    let activeNum = view === 'hours' ? parseInt(hours) : view === 'minutes' ? parseInt(minutes) : parseInt(seconds);
                    const angle = (view === 'hours' ? (activeNum * 30) : (activeNum * 6)) - 90;
                    const angleRad = angle * (Math.PI / 180);
                    const x = center + (radius - 12) * Math.cos(angleRad);
                    const y = center + (radius - 12) * Math.sin(angleRad);
                    return (
                        <line x1={center} y1={center} x2={x} y2={y} stroke="currentColor" strokeWidth="2.5" className="text-primary" strokeLinecap="round" />
                    );
                })()}
            </svg>
          </div>
          <p className="text-xs text-muted-foreground w-full text-center">
            {view === 'hours' ? "Select Hour" : view === 'minutes' ? "Select Minute" : "Select Second"} (Click anywhere on the circle)
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
