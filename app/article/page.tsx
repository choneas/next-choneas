import { getTranslations } from "next-intl/server";

export default async function Article() {
    const t = await getTranslations("Article");

    return (
        <>
            <h1>{t('title')}</h1>
            <p>{t('description')}</p>

            <iframe 
                src="/notion/1719bcd309be80799b8ed6e873491b57"
                style={{
                    width: '100%',
                    height: '800px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: 'white'
                }}
            />
        </>
    )
}