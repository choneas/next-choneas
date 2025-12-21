import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { MomentList, MomentListSkeleton } from "@/components/moment-list";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("Metadata");

    return {
        title: {
            absolute: t("title"),
        },
        description: t("description"),
    }
}

export default async function Home() {
    return (
        <>
            <header className="relative h-screen max-w-screen">
                <Image
                    fill
                    role="presentation"
                    src="/pictures/landscape.jpg"
                    alt="Background"
                    className="-z-10 object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/50 -z-10 hidden dark:block" />
                <div className="flex flex-col justify-end gap-4 md:flex-row md:items-end h-full px-8 md:px-12 pb-16 pt-(--navbar-height)">
                    <div role="heading" className="md:grow">
                        <span className="font-thin text-6xl md:text-8xl text-accent/55">Live with</span><br />
                        <span className="font-light text-7xl md:text-8xl text-accent">Culture.</span>
                    </div>
                </div>
            </header>
            <main className="container my-10 md:my-16 mx-auto px-8 md:px-12 max-w-6xl">
                <Suspense fallback={<MomentListSkeleton />}>
                    <MomentList sortOrder="desc" />
                </Suspense>
            </main>
        </>
    );
}