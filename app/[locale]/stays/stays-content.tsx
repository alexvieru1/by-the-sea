'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView, AnimatePresence } from 'motion/react';
import PageHero from '@/components/layout/page-hero';

type Stay = { start: Date; end: Date; id: number; track: 'wed' | 'thu' };

// Generate all 38 stays
function generateStays(): Stay[] {
  const all: Stay[] = [];

  // Wednesday track: starts Apr 1, 2026, 14-day stays, 19 stays
  let wedStart = new Date(2026, 3, 1);
  for (let i = 0; i < 19; i++) {
    const end = new Date(wedStart);
    end.setDate(end.getDate() + 14);
    all.push({ start: new Date(wedStart), end: new Date(end), id: i + 1, track: 'wed' });
    wedStart = new Date(end);
  }

  // Thursday track: starts Apr 2, 2026, 14-day stays, 19 stays
  // Exception: stay #19 ends Dec 23 instead of Dec 24
  let thuStart = new Date(2026, 3, 2);
  for (let i = 0; i < 19; i++) {
    const end = new Date(thuStart);
    end.setDate(end.getDate() + 14);
    if (i === 18) end.setDate(end.getDate() - 1);
    all.push({ start: new Date(thuStart), end: new Date(end), id: i + 1, track: 'thu' });
    thuStart = new Date(end);
  }

  return all;
}

const allStays = generateStays();

const MONTHS = [3, 4, 5, 6, 7, 8, 9, 10, 11]; // Apr–Dec
const YEAR = 2026;

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(month: number, year: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function isInRange(date: Date, start: Date, end: Date) {
  return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
}

// Get stays that overlap with a given month
function getStaysForMonth(month: number): Stay[] {
  const monthStart = new Date(YEAR, month, 1);
  const monthEnd = new Date(YEAR, month + 1, 0, 23, 59, 59);
  return allStays.filter((s) => s.start <= monthEnd && s.end > monthStart);
}

function formatDateFull(d: Date) {
  return d.getDate() + ' ' + d.toLocaleDateString('ro-RO', { month: 'long' });
}

function MonthCalendar({
  month,
  year,
  selectedStay,
}: {
  month: number;
  year: number;
  selectedStay: Stay | null;
}) {
  const t = useTranslations('stays');
  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfWeek(month, year);
  const dayNames = [
    t('days.mon'), t('days.tue'), t('days.wed'), t('days.thu'),
    t('days.fri'), t('days.sat'), t('days.sun'),
  ];

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthStays = useMemo(() => getStaysForMonth(month), [month]);

  return (
    <div>
      <div className="grid grid-cols-7">
        {dayNames.map((name) => (
          <div key={name} className="pb-2 text-center text-[10px] font-medium uppercase tracking-wider text-gray-400 sm:text-xs">
            {name}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="aspect-square" />;
          }

          const date = new Date(year, month, day);

          // Find which stays this day belongs to
          const dayStays = monthStays.filter((s) => isInRange(date, s.start, s.end));
          const wedStay = dayStays.find((s) => s.track === 'wed') || null;
          const thuStay = dayStays.find((s) => s.track === 'thu') || null;

          const isSelectedDay = selectedStay && isInRange(date, selectedStay.start, selectedStay.end);
          const hasSelection = !!selectedStay;

          let bgClass = '';
          let textClass = 'text-gray-600';

          if (hasSelection) {
            if (isSelectedDay) {
              bgClass = selectedStay.track === 'wed' ? 'bg-[#002343]' : 'bg-[#CF9C7C]';
              textClass = selectedStay.track === 'wed' ? 'text-white font-medium' : 'text-gray-900 font-medium';
            } else {
              textClass = 'text-gray-300';
            }
          }

          return (
            <div
              key={day}
              className={`relative flex aspect-square items-center justify-center text-xs transition-all duration-300 sm:text-sm ${bgClass}`}
            >
              <span className={`relative z-10 ${textClass}`}>{day}</span>
              {/* Track dots — only when no stay is selected */}
              {!hasSelection && (wedStay || thuStay) && (
                <div className="absolute bottom-0.5 left-1/2 flex -translate-x-1/2 gap-0.5 sm:bottom-1 sm:gap-1">
                  {wedStay && <div className="h-1 w-1 bg-[#002343] sm:h-1.5 sm:w-1.5" />}
                  {thuStay && <div className="h-1 w-1 bg-[#CF9C7C] sm:h-1.5 sm:w-1.5" />}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StayCard({
  stay,
  isActive,
  onClick,
}: {
  stay: Stay;
  isActive: boolean;
  onClick: () => void;
}) {
  const t = useTranslations('stays');
  const isWed = stay.track === 'wed';
  const trackColor = isWed ? '#002343' : '#CF9C7C';
  const trackLabel = isWed ? t('wedTrack') : t('thuTrack');

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full cursor-pointer items-center gap-4 border bg-white p-4 text-left transition-all duration-200 sm:p-5 ${
        isActive
          ? 'border-transparent shadow-md'
          : 'border-gray-100 hover:border-gray-300 hover:shadow-sm'
      }`}
      style={isActive ? { borderLeftWidth: 4, borderLeftColor: trackColor } : { borderLeftWidth: 4, borderLeftColor: trackColor + '30' }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 shrink-0" style={{ backgroundColor: trackColor }} />
          <span className="text-xs text-gray-400">{trackLabel}</span>
        </div>
        <p className="mt-1 text-sm font-medium text-gray-900 sm:text-base">
          {formatDateFull(stay.start)} – {formatDateFull(stay.end)}
        </p>
        <p className="mt-0.5 text-xs text-gray-400">
          {t('duration')}
        </p>
      </div>
    </button>
  );
}

export default function StaysContent() {
  const t = useTranslations('pages.stays');
  const tStays = useTranslations('stays');
  const [activeMonth, setActiveMonth] = useState(MONTHS[0]);
  const [selectedStay, setSelectedStay] = useState<Stay | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const monthTabsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const monthStays = useMemo(() => getStaysForMonth(activeMonth), [activeMonth]);

  const scrollToCalendar = useCallback(() => {
    if (!calendarRef.current) return;
    const main = document.querySelector('main');
    if (!main) return;
    const rect = calendarRef.current.getBoundingClientRect();
    const mainRect = main.getBoundingClientRect();
    const offset = rect.top - mainRect.top + main.scrollTop - 100;
    main.scrollTo({ top: offset, behavior: 'smooth' });
  }, []);

  const handleMonthClick = (month: number) => {
    setActiveMonth(month);
    setSelectedStay(null);
  };

  const handleStayClick = (stay: Stay) => {
    if (selectedStay?.track === stay.track && selectedStay?.id === stay.id) {
      setSelectedStay(null);
    } else {
      setSelectedStay(stay);
      // Scroll to calendar on mobile
      setTimeout(scrollToCalendar, 100);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
      />

      <section ref={sectionRef} className="bg-gray-50 px-6 py-16 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-5xl">
          {/* Month tabs */}
          <motion.div
            ref={monthTabsRef}
            className="mb-10 sm:mb-14"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-400 sm:text-sm">
              {tStays('selectMonth')}
            </p>
            <div className="flex gap-1 overflow-x-auto pb-2 sm:flex-wrap sm:gap-2 sm:overflow-visible">
              {MONTHS.map((month) => {
                const monthName = new Date(YEAR, month, 1).toLocaleDateString('ro-RO', { month: 'short' });
                const isActive = activeMonth === month;
                return (
                  <button
                    key={month}
                    type="button"
                    onClick={() => handleMonthClick(month)}
                    className={`relative shrink-0 cursor-pointer px-4 py-2.5 text-sm font-medium capitalize transition-all duration-200 sm:px-5 sm:py-3 ${
                      isActive
                        ? 'bg-[#002343] text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {monthName}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Content: stays list + calendar */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMonth}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid gap-8 lg:grid-cols-5 lg:gap-12"
            >
              {/* Stays list */}
              <div className="space-y-3 lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-(family-name:--font-quicksand) text-xl font-thin capitalize text-gray-900 sm:text-2xl">
                    {new Date(YEAR, activeMonth, 1).toLocaleDateString('ro-RO', { month: 'long' })} {YEAR}
                  </h3>
                </div>
                {monthStays.map((stay) => (
                  <StayCard
                    key={`${stay.track}-${stay.id}`}
                    stay={stay}
                    isActive={selectedStay?.track === stay.track && selectedStay?.id === stay.id}
                    onClick={() => handleStayClick(stay)}
                  />
                ))}

                {/* Legend */}
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 bg-[#002343]" />
                    <span className="text-xs text-gray-400">{tStays('wedTrack')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 bg-[#CF9C7C]" />
                    <span className="text-xs text-gray-400">{tStays('thuTrack')}</span>
                  </div>
                </div>
              </div>

              {/* Calendar */}
              <div ref={calendarRef} className="lg:col-span-3">
                <div className="sticky top-24">
                  <MonthCalendar
                    month={activeMonth}
                    year={YEAR}
                    selectedStay={selectedStay}
                  />
                  {selectedStay && (
                    <button
                      type="button"
                      onClick={() => setSelectedStay(null)}
                      className="mt-4 cursor-pointer text-xs text-gray-400 underline underline-offset-2 transition-colors hover:text-gray-700"
                    >
                      {tStays('clearSelection')}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Info note */}
          <motion.p
            className="mt-14 text-xs text-gray-400 sm:text-sm"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {tStays('infoNote')}
          </motion.p>
        </div>
      </section>
    </div>
  );
}
