import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

export default function BreakModal({ isOpen, onEndBreak, isPunching, breakStartTime, workingHours }) {
  const [elapsed, setElapsed] = useState('00:00:00');

  useEffect(() => {
    if (!isOpen) return;
    const tick = () => {
      if (breakStartTime) {
        // breakStartTime can be ISO "2026-02-23T17:31:29.417Z" or time-only "11:21:22"
        let start;
        if (breakStartTime.includes('T') || breakStartTime.includes('-')) {
          start = dayjs(breakStartTime); // full ISO string
        } else {
          start = dayjs(`${dayjs().format('YYYY-MM-DD')} ${breakStartTime}`); // time-only
        }
        const now  = dayjs();
        const diff = now.diff(start, 'second');
        if (diff >= 0) {
          const h = String(Math.floor(diff / 3600)).padStart(2, '0');
          const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
          const s = String(diff % 60).padStart(2, '0');
          setElapsed(`${h}:${m}:${s}`);
        }
      }
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [isOpen, breakStartTime]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-yellow-50">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f59e0b 0, #f59e0b 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 p-10 text-center max-w-md w-full">

        {/* Coffee icon */}
        <div className="w-24 h-24 rounded-full bg-yellow-100 border-4 border-yellow-400 flex items-center justify-center text-5xl shadow-lg">
          ☕
        </div>

        <div>
          <h1 className="text-3xl font-bold text-yellow-700 mb-1">You're on Break</h1>
          <p className="text-yellow-600 text-sm">Take a rest, you've earned it!</p>
        </div>

        {/* Break timer */}
        <div className="bg-white rounded-2xl shadow-md px-10 py-5 border border-yellow-200 w-full">
          <p className="text-xs text-gray-400 mb-1 uppercase tracking-widest">Break Duration</p>
          <p className="text-4xl font-mono font-bold text-yellow-600">{elapsed}</p>
        </div>

        {/* Working hours today */}
        {workingHours && (
          <div className="bg-white rounded-xl shadow-sm px-8 py-3 border border-gray-100 w-full">
            <p className="text-xs text-gray-400 mb-0.5">Working Hours Today</p>
            <p className="text-lg font-semibold text-gray-700">{workingHours}</p>
          </div>
        )}

        {/* End Break button */}
        <button
          onClick={onEndBreak}
          disabled={isPunching}
          className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 text-white text-lg font-bold py-4 rounded-xl shadow-md transition-colors"
        >
          {isPunching ? 'Please wait...' : 'End Break'}
        </button>

      </div>
    </div>
  );
}
