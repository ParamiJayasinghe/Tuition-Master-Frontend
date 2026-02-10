import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
  label?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  label = "Date Range"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateClick = (date: Date) => {
    const dateStr = formatDate(date);
    if (!startDate || (startDate && endDate)) {
      onChange(dateStr, "");
    } else {
      if (new Date(dateStr) < new Date(startDate)) {
        onChange(dateStr, startDate);
      } else {
        onChange(startDate, dateStr);
        setIsOpen(false);
      }
    }
  };

  const clearRange = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("", "");
  };

  const renderCalendar = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDateObj = monthStart.getDay();
    const daysInMonth = monthEnd.getDate();

    const days = [];
    for (let i = 0; i < startDateObj; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
      const dateStr = formatDate(date);
      const isSelected = dateStr === startDate || dateStr === endDate;
      const isInRange = startDate && endDate && new Date(dateStr) > new Date(startDate) && new Date(dateStr) < new Date(endDate);
      const isToday = formatDate(new Date()) === dateStr;

      days.push(
        <button
          key={d}
          onClick={() => handleDateClick(date)}
          className={`h-10 w-full flex items-center justify-center rounded-lg text-sm transition-all relative
            ${isSelected ? 'bg-primary text-white font-bold shadow-lg scale-110 z-10' : ''}
            ${isInRange ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-700'}
            ${isToday && !isSelected ? 'border border-primary/30 text-primary font-semibold' : ''}
          `}
        >
          {d}
        </button>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-primary/50 cursor-pointer transition-all group"
      >
        <CalendarIcon className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
        <span className="flex-1 text-sm text-slate-600">
          {startDate ? (
             <>
               {new Date(startDate).toLocaleDateString()}
               {endDate && ` - ${new Date(endDate).toLocaleDateString()}`}
             </>
          ) : (
            "Select date range"
          )}
        </span>
        {(startDate || endDate) && (
          <button onClick={clearRange} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-3.5 h-3.5 text-slate-400" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-slate-100 rounded-2xl shadow-2xl p-4 w-[300px] animate-fade-in origin-top-left">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-800">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h4>
            <div className="flex gap-1">
              <button 
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                type="button"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <button 
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                type="button"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
          {renderCalendar()}
          <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
            <button 
              onClick={() => setCurrentMonth(new Date())}
              className="text-xs font-semibold text-primary hover:underline"
              type="button"
            >
              Go to Today
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
              type="button"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
