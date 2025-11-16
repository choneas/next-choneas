import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Suspense } from "react";
import { Card, Skeleton } from "@heroui/react";
// import { FaCodeBranch, FaHeart } from "react-icons/fa6";
// import { Card, CardBody, CardHeader } from "@heroui/card";
import { MomentList } from "@/components/moment-list";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("Metadata");

    return {
        title: t("title"),
        description: t("description"),
    }

}

// const InfoCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
//     <Card className="flex-1 h-32 bg-black/20 backdrop-blur-md md:flex-initial md:w-64">
//         <CardBody>
//             <div className="text-white font-bold inline-flex items-center gap-1">{icon}{" "}{title}</div>
//             <div className="text-white/60">{description}</div>
//         </CardBody>
//     </Card>
// );

function MomentListSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
                <Card key={i} className="relative">
                    {/* Header */}
                    <div className="flex gap-3 items-center">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex flex-col gap-2 flex-1">
                            <Skeleton className="h-4 w-24 rounded-lg" />
                            <Skeleton className="h-3 w-32 rounded-lg" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-3/4 rounded-lg" />
                        <Skeleton className="h-4 w-full rounded-lg" />
                        <Skeleton className="h-4 w-5/6 rounded-lg" />
                    </div>

                    {/* Footer */}
                    <Skeleton className="h-10 w-full rounded-lg" />
                </Card>
            ))}
        </div>
    );
}

export default async function Home() {
    // const t = await getTranslations("Home");

    return (
        // <div className="container my-10 md:my-16 mx-auto px-8 md:px-12 max-w-6xl">
        //     <p className="text-lg">{t("hello-iam")}</p>
        //     <h1 className="font-bold text-primary" translate="no">{t('choneas')}</h1>
        //     <p className="text-content4-foreground">{t('name-desc')}</p>
        //     <p
        //         className="text-lg py-4 pb-16 text-secondary"
        //     >
        //         {t('description')}
        //         {t('description-line2')}
        //     </p>

        //     <MomentList sortOrder="desc"/>
        // </div>
        <>
            <div className="relative h-screen max-w-screen -mt-16">
                <Image
                    fill
                    src="/pictures/landscape.jpg"
                    alt="Background"
                    className="-z-10 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 -z-10 hidden dark:block" />
                <div className="flex flex-col justify-end gap-4 md:flex-row md:items-end h-full px-8 md:px-12 pb-16 pt-(--navbar-height)">
                    <div className="md:grow">
                        <span className="font-thin text-6xl md:text-8xl text-accent/55">Live with</span><br />
                        <span className="font-light text-7xl md:text-8xl text-accent">Culture.</span>
                    </div>
                    {/* <div className="w-full flex flex-row md:flex-col lg:flex-row gap-4 md:w-auto ">
                        <InfoCard icon={<FaHeart />} title="Hobby" description="唱、跳、rap、篮球" />
                        <InfoCard icon={<FaCodeBranch />} title="技术栈" description="React, Next.js, TailwindCSS" />
                    </div> */}
                </div>
            </div>
            <div className="container my-10 md:my-16 mx-auto px-8 md:px-12 max-w-6xl">
                <Suspense fallback={<MomentListSkeleton />}>
                    <MomentList sortOrder="desc" />
                </Suspense>
            </div>
        </>
    );
}