"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

type CountdownProps = {
  expiresAt: string;
  onExpire?: () => void;
};

export function Countdown({ expiresAt, onExpire }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const targetDate = new Date(expiresAt).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        if (onExpire) {
          onExpire();
        }
        return;
      }

      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown(); // Call immediately
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  if (!timeLeft) return null;

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 text-red-500 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 text-xs font-bold uppercase tracking-wider">
        <Clock className="w-4 h-4" />
        <span>Expirado</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
      <Clock className="w-4 h-4 animate-pulse" />
      <span>
        Expira em: {timeLeft.hours.toString().padStart(2, "0")}h{" "}
        {timeLeft.minutes.toString().padStart(2, "0")}m{" "}
        {timeLeft.seconds.toString().padStart(2, "0")}s
      </span>
    </div>
  );
}
