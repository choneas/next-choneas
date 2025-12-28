import { Suspense } from "react";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GoogleAnalytics } from "@next/third-parties/google";
import { Noto_Serif_SC, Source_Code_Pro } from "next/font/google";
import { NavbarWrapper } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";
import { SkipToContent } from "@/components/skip-to-content";
import "overlayscrollbars/overlayscrollbars.css";
import "./globals.css";

const notoSerif = Noto_Serif_SC({
    variable: "--font-serif",
    subsets: ["latin"],
    display: "swap",
    weight: "variable",
    fallback: ["Noto Serif SC", "Noto Serif", "serif"],
});

const sourceCode = Source_Code_Pro({
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
        <html suppressHydrationWarning data-overlayscrollbars-initialize>
            <body
                data-overlayscrollbars-initialize
                className={`${notoSerif.variable} ${sourceCode.variable} font-serif text-foreground bg-background antialiased`}
            >
                <Suspense fallback={null}>
                    <LayoutContent>{children}</LayoutContent>
                </Suspense>
                <Analytics />
            </body>
            <GoogleAnalytics gaId={process.env.GA_ID!} />
            <SpeedInsights />
        </html>
    );
}

async function LayoutContent({ children }: { children: React.ReactNode }) {
    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            <Providers>
                <SkipToContent />
                <NavbarWrapper />
                <div className="min-h-[calc(100svh+1px)]">
                    {children}
                </div>
                <Footer />
            </Providers>
        </NextIntlClientProvider>
    );
}
