import type { Metadata } from "next";
import { Suspense } from "react";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GoogleAnalytics } from "@next/third-parties/google";
import { Noto_Serif_SC, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { NavbarWrapper } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";

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

export const metadata: Metadata = {
    title: "Choneas's Blog",
    description: "代码、随笔、思考、分享以及生活",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html suppressHydrationWarning>
            <body
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
                <NavbarWrapper />
                {children}
                <Footer />
            </Providers>
        </NextIntlClientProvider>
    );
}
