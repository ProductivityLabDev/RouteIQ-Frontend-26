import React, { useEffect, useState } from 'react';

export default function AnalogClock({ size = 180 }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours   = time.getHours() % 12;

  const secDeg  = seconds * 6;
  const minDeg  = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;

  const cx = size / 2;
  const r  = size / 2 - 4;

  // Hour markers
  const markers = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const isMajor = i % 3 === 0;
    const inner = r - (isMajor ? 12 : 7);
    const outer = r - 2;
    return {
      x1: cx + inner * Math.cos(angle),
      y1: cx + inner * Math.sin(angle),
      x2: cx + outer * Math.cos(angle),
      y2: cx + outer * Math.sin(angle),
      isMajor,
    };
  });

  const hand = (deg, length, width, color) => {
    const angle = (deg - 90) * (Math.PI / 180);
    return {
      x2: cx + length * Math.cos(angle),
      y2: cx + length * Math.sin(angle),
      width,
      color,
    };
  };

  const hourHand   = hand(hourDeg, r * 0.5,  5,  '#1a1a2e');
  const minuteHand = hand(minDeg,  r * 0.7,  3,  '#1a1a2e');
  const secHand    = hand(secDeg,  r * 0.8,  1.5,'#C01824');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Outer ring */}
      <circle cx={cx} cy={cx} r={r} fill="#fff5f5" stroke="#e5e7eb" strokeWidth="2" />

      {/* Inner soft ring */}
      <circle cx={cx} cy={cx} r={r - 6} fill="white" stroke="#fca5a5" strokeWidth="1" />

      {/* Hour markers */}
      {markers.map((m, i) => (
        <line
          key={i}
          x1={m.x1} y1={m.y1}
          x2={m.x2} y2={m.y2}
          stroke={m.isMajor ? '#C01824' : '#d1d5db'}
          strokeWidth={m.isMajor ? 2.5 : 1.5}
          strokeLinecap="round"
        />
      ))}

      {/* Hour hand */}
      <line
        x1={cx} y1={cx}
        x2={hourHand.x2} y2={hourHand.y2}
        stroke={hourHand.color}
        strokeWidth={hourHand.width}
        strokeLinecap="round"
      />

      {/* Minute hand */}
      <line
        x1={cx} y1={cx}
        x2={minuteHand.x2} y2={minuteHand.y2}
        stroke={minuteHand.color}
        strokeWidth={minuteHand.width}
        strokeLinecap="round"
      />

      {/* Second hand */}
      <line
        x1={cx} y1={cx}
        x2={secHand.x2} y2={secHand.y2}
        stroke={secHand.color}
        strokeWidth={secHand.width}
        strokeLinecap="round"
      />

      {/* Center dot */}
      <circle cx={cx} cy={cx} r={4} fill="#C01824" />
      <circle cx={cx} cy={cx} r={2} fill="white" />
    </svg>
  );
}
