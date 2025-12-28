"use client";

import { useState, useEffect } from "react";

interface LiveCounterProps {
    /** Birth date in format YYYY-MM-DD */
    birthDate: string;
    /** Locale for formatting */
    locale: string;
    /** Title label */
    title: string;
}

interface TimeElapsed {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

/**
 * Convert locale code to BCP 47 format for Intl API
 */
function toBCP47(locale: string): string {
    const mapping: Record<string, string> = {
        "zh-cn": "zh-CN",
        "zh-tw": "zh-TW",
        "en": "en-US",
        "es": "es-ES",
    };
    return mapping[locale.toLowerCase()] || locale;
}

/**
 * Format unit label only (without number) using Intl.NumberFormat
 */
function formatUnitLabel(value: number, unit: "day" | "hour" | "minute" | "second", locale: string): string {
    const bcp47 = toBCP47(locale);
    try {
        // Get full formatted string then extract unit part
        const full = new Intl.NumberFormat(bcp47, {
            style: "unit",
            unit,
            unitDisplay: "long",
        }).format(value);
        // Remove the number part to get only the unit label
        const numStr = new Intl.NumberFormat(bcp47).format(value);
        return full.replace(numStr, "").trim();
    } catch {
        // Fallback for older browsers
        return `${unit}${value !== 1 ? "s" : ""}`;
    }
}

/** Calculate elapsed time from birth date */
function calculateElapsed(birthDate: Date): TimeElapsed {
    const now = new Date();
    const diff = now.getTime() - birthDate.getTime();

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor(diff / (1000 * 60 * 60)) % 24,
        minutes: Math.floor(diff / (1000 * 60)) % 60,
        seconds: Math.floor(diff / 1000) % 60,
    };
}

export function LiveCounter({ birthDate, locale, title }: LiveCounterProps) {
    const birth = new Date(birthDate);
    const [elapsed, setElapsed] = useState<TimeElapsed | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setElapsed(calculateElapsed(birth));

        const timer = setInterval(() => {
            setElapsed(calculateElapsed(birth));
        }, 1000);

        return () => clearInterval(timer);
    }, [birthDate]);

    if (!mounted || !elapsed) {
        return (
            <div className="text-left">
                <p className="text-xs md:text-sm text-accent/60 font-medium tracking-widest uppercase md:mb-2">
                    {title}
                </p>
                <p className="text-sm md:text-lg text-accent/90 font-serif opacity-60">...</p>
            </div>
        );
    }

    // Format number with locale-specific separators
    const fmt = (n: number) => new Intl.NumberFormat(toBCP47(locale)).format(n);

    return (
        <div className="text-left">
            {/* Title */}
            <p className="text-xs md:text-sm text-accent/60 font-medium tracking-widest uppercase mb-2">
                {title}
            </p>
            {/* Counter - bold numbers with different color */}
            <p className="text-sm md:text-lg text-accent/90 font-serif">
                <span className="font-bold text-accent">{fmt(elapsed.days)}</span>
                <span className="text-accent/70"> {formatUnitLabel(elapsed.days, "day", locale)}, </span>
                <span className="font-bold text-accent">{elapsed.hours}</span>
                <span className="text-accent/70"> {formatUnitLabel(elapsed.hours, "hour", locale)}, </span>
                <span className="font-bold text-accent">{elapsed.minutes}</span>
                <span className="text-accent/70"> {formatUnitLabel(elapsed.minutes, "minute", locale)}, </span>
                <span className="font-bold text-accent">{elapsed.seconds}</span>
                <span className="text-accent/70"> {formatUnitLabel(elapsed.seconds, "second", locale)}</span>
            </p>
        </div>
    );
}
