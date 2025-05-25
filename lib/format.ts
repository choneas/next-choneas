import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import calendar from 'dayjs/plugin/calendar';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(isToday);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(calendar);
dayjs.extend(localizedFormat);

export function loadLocale(locale: string): void {
    try {
        require(`dayjs/locale/${locale.toLowerCase()}`);
    } catch (e) {
        console.warn(`Failed to load locale: ${locale}, falling back to en`);
        require('dayjs/locale/en');
        locale = 'en';
    }
    dayjs.locale(locale.toLowerCase());
}

export function formatDate(date: Date, locale: string, showTime?: boolean, alias: boolean = true): string {
    const d = dayjs(date);
    loadLocale(locale);

    if (!alias) {
        return d.format(showTime ? 'L LT' : 'L');
    }

    const calendarConfig = {
        sameDay: '[Today]',
        lastDay: '[Yesterday]',
        sameWeek: 'dddd',
        lastWeek: 'L',
        sameElse: d.year() === dayjs().year() ? 'MMM D' : 'L'
    };

    let result = d.calendar(null, calendarConfig);
    
    if (showTime) {
        result += ' ' + d.format('HH:mm');
    }

    return result;
}
