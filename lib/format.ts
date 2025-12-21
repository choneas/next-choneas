export interface FormatConfig {
    today: string;
    yesterday: string;
    weekdays: string[];
}

// Config cache for locale-specific strings
const configCache = new Map<string, FormatConfig>();

/**
 * Load locale-specific format config synchronously
 */
function getFormatConfig(locale: string): FormatConfig {
    if (configCache.has(locale)) {
        return configCache.get(locale)!;
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const messages = require(`@/locales/${locale}.json`);
        const config: FormatConfig = messages.Format;
        configCache.set(locale, config);
        return config;
    } catch {
        console.warn(`Failed to load format config for locale "${locale}", falling back to English`);
        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const fallback = require('@/locales/en.json');
            const config: FormatConfig = fallback.Format;
            return config;
        } catch {
            return {
                today: 'Today',
                yesterday: 'Yesterday',
                weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            };
        }
    }
}

/**
 * Convert locale code to BCP 47 format for Intl API
 */
function toBCP47(locale: string): string {
    // Handle common locale mappings
    const mapping: Record<string, string> = {
        'zh-cn': 'zh-CN',
        'zh-tw': 'zh-TW',
        'en': 'en-US',
        'es': 'es-ES'
    };
    return mapping[locale.toLowerCase()] || locale;
}

/**
 * Check if date is today
 */
function isToday(date: Date): boolean {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate();
}

/**
 * Check if date is yesterday
 */
function isYesterday(date: Date): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.getFullYear() === yesterday.getFullYear() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getDate() === yesterday.getDate();
}

/**
 * Check if two dates are in the same week (Monday as start)
 */
function isSameWeek(date1: Date, date2: Date): boolean {
    const getMonday = (d: Date): Date => {
        const day = d.getDay();
        const diff = day === 0 ? 6 : day - 1; // Adjust for Monday start
        const monday = new Date(d);
        monday.setDate(d.getDate() - diff);
        monday.setHours(0, 0, 0, 0);
        return monday;
    };
    return getMonday(date1).getTime() === getMonday(date2).getTime();
}

/**
 * Format date using Intl.DateTimeFormat
 * @param date - Date to format
 * @param locale - Locale code (e.g., 'en', 'zh-CN', 'es')
 * @param showTime - Whether to show time
 * @param alias - Whether to use friendly aliases (Today, Yesterday, weekday names)
 * @returns Formatted date string
 */
export function formatDate(
    date: Date,
    locale: string,
    showTime?: boolean,
    alias: boolean = true
): string {
    const config = getFormatConfig(locale);
    const bcp47Locale = toBCP47(locale);
    const now = new Date();

    // Friendly aliases
    if (alias) {
        if (isToday(date)) {
            return config.today;
        }

        if (isYesterday(date)) {
            return config.yesterday;
        }

        if (isSameWeek(date, now)) {
            return config.weekdays[date.getDay()];
        }
    }

    // Date formatting options based on same year or not
    const isSameYear = date.getFullYear() === now.getFullYear();
    const dateOptions: Intl.DateTimeFormatOptions = isSameYear && alias
        ? { month: 'short', day: 'numeric' }
        : { year: 'numeric', month: 'short', day: 'numeric' };

    let result = new Intl.DateTimeFormat(bcp47Locale, dateOptions).format(date);

    if (showTime) {
        const timeStr = new Intl.DateTimeFormat(bcp47Locale, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date);
        result += ' ' + timeStr;
    }

    return result;
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 * Uses Intl.RelativeTimeFormat for localized output
 */
export function formatRelativeTime(date: Date, locale: string): string {
    const bcp47Locale = toBCP47(locale);
    const rtf = new Intl.RelativeTimeFormat(bcp47Locale, { numeric: 'auto' });

    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffAbs = Math.abs(diffMs);

    // Time unit constants in milliseconds
    const SECOND = 1000;
    const MINUTE = 60 * SECOND;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const WEEK = 7 * DAY;
    const MONTH = 30 * DAY;
    const YEAR = 365 * DAY;

    // Determine appropriate unit and value
    let value: number;
    let unit: Intl.RelativeTimeFormatUnit;

    if (diffAbs < MINUTE) {
        value = Math.round(diffMs / SECOND);
        unit = 'second';
    } else if (diffAbs < HOUR) {
        value = Math.round(diffMs / MINUTE);
        unit = 'minute';
    } else if (diffAbs < DAY) {
        value = Math.round(diffMs / HOUR);
        unit = 'hour';
    } else if (diffAbs < WEEK) {
        value = Math.round(diffMs / DAY);
        unit = 'day';
    } else if (diffAbs < MONTH) {
        value = Math.round(diffMs / WEEK);
        unit = 'week';
    } else if (diffAbs < YEAR) {
        value = Math.round(diffMs / MONTH);
        unit = 'month';
    } else {
        value = Math.round(diffMs / YEAR);
        unit = 'year';
    }

    return rtf.format(value, unit);
}

/**
 * Format reading time duration
 * @param minutes - Reading time in minutes
 * @param locale - Locale code
 * @returns Formatted reading time string (e.g., "5 minutes", "5 分钟")
 */
export function formatReadingTime(minutes: number, locale: string): string {
    const bcp47Locale = toBCP47(locale);

    // Use Intl.NumberFormat with unit for localized output
    try {
        const formatter = new Intl.NumberFormat(bcp47Locale, {
            style: 'unit',
            unit: 'minute',
            unitDisplay: 'long'
        });
        return formatter.format(minutes);
    } catch {
        // Fallback for older browsers
        return `${minutes} min`;
    }
}
