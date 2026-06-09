import React, { useState } from 'react';
import { Sparkles, CalendarDays, Check, Flame } from 'lucide-react';

interface DayData {
  dayName: string;
  dateNum: number;
  availableCount: number;
}

export default function Availability() {
  const days: DayData[] = [
    { dayName: 'Lun', dateNum: 12, availableCount: 5 },
    { dayName: 'Mar', dateNum: 13, availableCount: 3 },
    { dayName: 'Mié', dateNum: 14, availableCount: 6 },
    { dayName: 'Jue', dateNum: 15, availableCount: 8 }, // selected by default
    { dayName: 'Vie', dateNum: 16, availableCount: 4 },
    { dayName: 'Sáb', dateNum: 17, availableCount: 1 },
    { dayName: 'Dom', dateNum: 18, availableCount: 0 }, // sold out/closed
  ];

  const timeSlotsByDay: Record<number, { time: string; status: 'available' | 'booked' | 'highlighted' }[]> = {
    12: [
      { time: '12:30', status: 'available' },
      { time: '13:00', status: 'booked' },
      { time: '14:00', status: 'available' },
      { time: '20:00', status: 'available' },
      { time: '21:00', status: 'booked' },
      { time: '22:00', status: 'available' },
    ],
    13: [
      { time: '12:30', status: 'booked' },
      { time: '13:00', status: 'booked' },
      { time: '14:00', status: 'available' },
      { time: '20:00', status: 'available' },
      { time: '21:00', status: 'booked' },
      { time: '22:00', status: 'available' },
    ],
    14: [
      { time: '12:30', status: 'available' },
      { time: '13:00', status: 'available' },
      { time: '14:00', status: 'available' },
      { time: '20:00', status: 'booked' },
      { time: '21:00', status: 'available' },
      { time: '22:00', status: 'available' },
    ],
    15: [
      { time: '12:30', status: 'available' },
      { time: '13:00', status: 'booked' },
      { time: '14:00', status: 'available' },
      { time: '20:00', status: 'highlighted' }, // default active highlighted
      { time: '21:00', status: 'available' },
      { time: '22:00', status: 'available' },
    ],
    16: [
      { time: '12:30', status: 'booked' },
      { time: '13:00', status: 'booked' },
      { time: '14:00', status: 'available' },
      { time: '20:00', status: 'available' },
      { time: '21:00', status: 'available' },
      { time: '22:00', status: 'booked' },
    ],
    17: [
      { time: '12:30', status: 'booked' },
      { time: '13:00', status: 'booked' },
      { time: '14:00', status: 'booked' },
      { time: '20:00', status: 'available' },
      { time: '21:00', status: 'booked' },
      { time: '22:00', status: 'booked' },
    ],
    18: [
      { time: '12:30', status: 'booked' },
      { time: '13:00', status: 'booked' },
      { time: '14:00', status: 'booked' },
      { time: '20:00', status: 'booked' },
      { time: '21:00', status: 'booked' },
      { time: '22:00', status: 'booked' },
    ],
  };

  const [selectedDay, setSelectedDay] = useState(15);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>('20:00');

  const activeDayObj = days.find((d) => d.dateNum === selectedDay);
  const currentSlots = timeSlotsByDay[selectedDay] || [];

  const handleSlotClick = (time: string, status: string) => {
    if (status === 'booked') return;
    setSelectedTimeSlot(time);
    
    // Smooth scroll to quick-booking widget to make final booking easier!
    const quickBookEl = document.getElementById('quick-book-form');
    if (quickBookEl) {
      quickBookEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="reservas" className="py-20 px-6 md:px-12 bg-background border-t border-outline-variant/10">
      <div className="max-w-7xl mx-auto">
        {/* Header Title */}
        <div className="text-center mb-12 space-y-2">
          <span className="text-primary font-sans text-xs font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-2">
            Disponibilidad Inteligente
          </span>
          <h2 className="font-serif text-3xl md:text-4xl italic text-on-surface">
            Disponibilidad en tiempo real
          </h2>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto">
            Haga clic en un día para explorar los horarios de mesa vacantes. Los turnos de cena se cubren rápidamente.
          </p>
        </div>

        {/* Calendar Day Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 border-b border-outline-variant/20 pb-8">
          {days.map((day) => {
            const isSelected = selectedDay === day.dateNum;
            const isSoldOut = day.availableCount === 0;

            return (
              <div
                key={day.dateNum}
                onClick={() => {
                  setSelectedDay(day.dateNum);
                  // Default select first available slot
                  const firstAvail = timeSlotsByDay[day.dateNum]?.find((s) => s.status !== 'booked');
                  setSelectedTimeSlot(firstAvail ? firstAvail.time : null);
                }}
                className={`text-center p-4 rounded-sm border cursor-pointer transition-all duration-300 relative group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-primary/10 border-primary shadow-md'
                    : isSoldOut
                    ? 'border-outline-variant/10 opacity-40 hover:opacity-60 bg-transparent'
                    : 'border-outline-variant/10 bg-surface-container-low hover:bg-surface-container-high'
                }`}
              >
                {/* Available Badge dots */}
                {!isSoldOut && (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}

                <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider mb-2">
                  {day.dayName}
                </p>
                <p
                  className={`font-serif text-2xl font-bold ${
                    isSelected ? 'text-primary' : 'text-on-surface'
                  } group-hover:text-primary transition-colors`}
                >
                  {day.dateNum}
                </p>

                <p className="text-[9px] font-mono mt-3 uppercase tracking-tight text-on-surface-variant/80">
                  {isSoldOut ? (
                    <span className="text-rose-400">Completo</span>
                  ) : (
                    <span>{day.availableCount} Libres</span>
                  )}
                </p>
              </div>
            );
          })}
        </div>

        {/* Hours Slot selector Area */}
        <div className="mt-12 p-6 md:p-8 bg-surface-container rounded-lg border border-outline-variant/15">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <p className="text-[10px] text-primary uppercase font-bold tracking-widest font-sans flex items-center gap-1.5">
                <CalendarDays size={12} /> Horarios disponibles
              </p>
              <h4 className="font-serif text-xl italic text-on-surface mt-1">
                Para el {activeDayObj?.dayName === 'Jue' ? 'Jueves' : activeDayObj?.dayName === 'Vie' ? 'Viernes' : activeDayObj?.dayName === 'Sáb' ? 'Sábado' : activeDayObj?.dayName === 'Dom' ? 'Domingo' : activeDayObj?.dayName === 'Lun' ? 'Lunes' : activeDayObj?.dayName === 'Mar' ? 'Martes' : 'Miércoles'} {selectedDay} de Junio
              </h4>
            </div>

            {selectedTimeSlot && (
              <div className="bg-primary/10 border border-primary/20 rounded px-3 py-1.5 text-xs text-primary font-bold flex items-center gap-1">
                <Flame size={12} className="animate-pulse" /> ¡Alta demanda estimada!
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {currentSlots.map((slot) => {
              const isSelected = selectedTimeSlot === slot.time;
              const isBooked = slot.status === 'booked';
              
              if (isBooked) {
                return (
                  <button
                    key={slot.time}
                    disabled
                    className="border border-outline-variant/10 text-on-surface-variant/30 py-3 rounded-sm font-sans text-xs font-bold line-through opacity-30 cursor-not-allowed bg-surface-container-low"
                  >
                    {slot.time}
                  </button>
                );
              }

              return (
                <button
                  key={slot.time}
                  onClick={() => handleSlotClick(slot.time, slot.status)}
                  className={`py-3 rounded-sm font-sans text-xs font-bold transition-all duration-200 uppercase tracking-wider relative cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-on-primary border border-primary shadow-lg'
                      : slot.status === 'highlighted'
                      ? 'border border-primary text-primary hover:bg-primary/10 bg-primary/5'
                      : 'border border-outline-variant/30 text-primary hover:bg-primary/5 hover:border-primary/50'
                  }`}
                >
                  {slot.time}
                  {isSelected && (
                    <span className="absolute -top-1.5 -right-1.5 bg-primary-container text-on-primary text-[8px] p-0.5 rounded-full">
                      <Check size={8} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-6 justify-center text-xs text-on-surface-variant font-sans border-t border-outline-variant/10 pt-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-primary rounded-sm"></span>
              <span>Seleccionado</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 border border-primary bg-primary/5 rounded-sm"></span>
              <span>Recomendado</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 border border-outline-variant/30 rounded-sm"></span>
              <span>Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 border border-outline-variant/10 opacity-30 line-through rounded-sm"></span>
              <span>Agotado</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
