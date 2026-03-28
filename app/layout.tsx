import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GoogleAnalytics } from "@next/third-parties/google";
import { Noto_Serif_SC, Google_Sans_Code } from "next/font/google";
import { NavbarWrapper } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";
import { SkipToContent } from "@/components/skip-to-content";
import { CopyrightToast } from "@/components/copyright-toast";
import { Suspense } from "react";
import "overlayscrollbars/overlayscrollbars.css";
import "./globals.css";

const notoSerif = Noto_Serif_SC({
    variable: "--font-serif",
    subsets: ["latin"],
    display: "swap",
    weight: "variable",
    fallback: ["Noto Serif SC", "Noto Serif", "serif", "Times New Roman", "system-ui"],
});

const googleSansCode = Google_Sans_Code({
    variable: "--font-code",
    display: "swap",
    subsets: ["latin"],
    fallback: ["Source Code Pro", "monospace"],
});

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Suspense fallback={
            <html suppressHydrationWarning data-overlayscrollbars-initialize>
                <body className={`${notoSerif.variable} ${googleSansCode.variable} font-serif text-foreground bg-background antialiased md:subpixel-antialiased`}>
                </body>
            </html>
        }>
            <LocalizedContent>
                <SkipToContent />
                <NavbarWrapper />
                <div className="min-h-[calc(100svh+1px)]">
                    {children}
                </div>
                <Footer />
            </LocalizedContent>
        </Suspense>
    );
}

async function LocalizedContent({ children }: { children: React.ReactNode }) {
    const [lang, messages] = await Promise.all([
        getLocale(),
        getMessages()
    ]);

    return (
        <html lang={lang} suppressHydrationWarning data-overlayscrollbars-initialize>
            <body
                data-overlayscrollbars-initialize
                className={`${notoSerif.variable} ${googleSansCode.variable} font-serif text-foreground bg-background antialiased`}
            >
                <NextIntlClientProvider messages={messages}>
                    <Providers>
                        {children}
                        <CopyrightToast />
                    </Providers>
                </NextIntlClientProvider>
                <Analytics />
                <SpeedInsights />
            </body>
            {process.env.GA_ID && <GoogleAnalytics gaId={process.env.GA_ID} />}
        </html>
    );
}