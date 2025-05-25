// TODO: Support more languages

import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = ((await cookieStore).get('NEXT_LOCALE')?.value || 'en') === 'zh-CN' ? 'zh-CN' : 'en';

  return {
    locale: locale,
    messages: (await import(`./${locale}.json`)).default
  };
});