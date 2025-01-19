import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(relativeTime);
dayjs.extend(isToday);

function isSameWeek(date1: dayjs.Dayjs, date2: dayjs.Dayjs): boolean {
    const monday1 = date1.startOf('day').subtract(date1.day() === 0 ? 6 : date1.day() - 1, 'day');
    const monday2 = date2.startOf('day').subtract(date2.day() === 0 ? 6 : date2.day() - 1, 'day');
    return monday1.isSame(monday2, 'day');
}

export function formatDate(date: Date, locale: string, showTime: boolean = false): string {
    const d = dayjs(date);
    const now = dayjs();
    dayjs.locale(locale);

    if (d.isToday()) {
        return locale === 'zh-CN' ? '今天' : 'Today';
    }

    if (d.isSame(now.subtract(1, 'day'), 'day')) {
        return locale === 'zh-CN' ? '昨天' : 'Yesterday';
    }

    if (isSameWeek(d, now)) {
        const weekday = locale === 'zh-CN' 
            ? `星期${['日', '一', '二', '三', '四', '五', '六'][d.day()]}`
            : d.format('dddd');
        return weekday;
    }

    const isSameYear = d.year() === now.year();
    const format = locale === 'zh-CN'
        ? (isSameYear ? 'M月D日' : 'YYYY年M月D日')
        : (isSameYear ? 'MMM D' : 'MMM D, YYYY');

    let result = d.format(format);
    if (showTime) {
        result += ' ' + d.format('HH:mm');
    }
    
    return result;
}
