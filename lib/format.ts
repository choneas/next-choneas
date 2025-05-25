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

export async function loadLocale(locale: string): Promise<void> {
    const localeName = locale.toLowerCase();
    try {
        await import(`dayjs/locale/${localeName}.js`);
    } catch {
        console.warn(`Failed to load locale: ${localeName}, falling back to en`);
        await import('dayjs/locale/en.js');
        dayjs.locale('en');
        return;
    }
    dayjs.locale(localeName);
}

export async function formatDate(date: Date, locale: string, showTime?: boolean, alias: boolean = true): Promise<string> {
    // const d = dayjs(date);
    // await loadLocale(locale);

    // if (!alias) {
    //     return d.format(showTime ? 'L LT' : 'L');
    // }

    // const calendarConfig = {
    //     sameDay: '[Today]',
    //     lastDay: '[Yesterday]',
    //     sameWeek: 'dddd',
    //     lastWeek: 'L',
    //     sameElse: d.year() === dayjs().year() ? 'MMM D' : 'L'
    // };

    // let result = d.calendar(null, calendarConfig);
    
    // if (showTime) {
    //     result += ' ' + d.format('HH:mm');
    // }
    date
    locale
    showTime
    alias

    return "TIME";
}
