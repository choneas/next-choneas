import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { GoogleAnalytics } from "@next/third-parties/google";
import { Noto_Serif_SC, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";

const notoSerif = Noto_Serif_SC({
    variable: "--font-serif",
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
});

const sourceCode = Source_Code_Pro({
    variable: "--font-code",
    display: "swap",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Choneas's Blog",
    description: "代码、随笔、思考、分享以及生活",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html suppressHydrationWarning lang={locale}>
            <body
                className={`${notoSerif.variable} ${sourceCode.variable} font-serif text-foreground bg-background antialiased`}
            >
                <NextIntlClientProvider messages={messages}>
                    <Providers>
                        <Navbar />
                        {children}
                    </Providers>
                </NextIntlClientProvider>
            </body>
            <GoogleAnalytics gaId={process.env.GA_ID!}/>
        </html>
    );
}
