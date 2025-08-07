import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
// import { FaCodeBranch, FaHeart } from "react-icons/fa6";
// import { Card, CardBody, CardHeader } from "@heroui/card";
import { MomentList }  from "@/components/moment-list";
import React from "react";

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
            <div className="relative h-screen max-w-screen -mt-[4rem]">
                <Image
                    fill
                    src="/pictures/landscape.jpg"
                    alt="Background"
                    className="-z-10 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 -z-10 hidden dark:block" />
                <div className="flex flex-col justify-end gap-4 md:flex-row md:items-end h-full px-8 md:px-12 pb-16 pt-[var(--navbar-height)]">
                    <div className="md:flex-grow">
                        <span className="font-thin text-6xl md:text-8xl text-primary/80">Live with</span><br />
                        <span className="font-light text-7xl md:text-8xl text-primary">Culture.</span>
                    </div>
                    {/* <div className="w-full flex flex-row md:flex-col lg:flex-row gap-4 md:w-auto ">
                        <InfoCard icon={<FaHeart />} title="Hobby" description="唱、跳、rap、篮球" />
                        <InfoCard icon={<FaCodeBranch />} title="技术栈" description="React, Next.js, TailwindCSS" />
                    </div> */}
                </div>
            </div>
            <div className="container my-10 md:my-16 mx-auto px-8 md:px-12 max-w-6xl">
                <MomentList sortOrder="desc" />
            </div>
        </>
    );
}