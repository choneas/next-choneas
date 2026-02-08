"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import { SecondParagraph } from "@/components/home/second-paragraph";

// Dynamic import for modal content - only loads when needed
const CultureModalContent = dynamic(
    () => import("@/components/home/second-paragraph-modal-content").then(mod => ({ default: mod.SecondParagraphModalContent })),
    {
        ssr: false,
        loading: () => null, // No loading state needed for modal
    }
);

interface ModalContent {
    title: string;
    paragraphs: React.ReactNode[];
    imageSrc?: string;
    imageAlt?: string;
}

interface SecondParagraphWithModalProps {
    /** Pre-rendered paragraph parts */
    beforeCulture: React.ReactNode;
    cultureText: React.ReactNode;
    betweenCultureAndLink: React.ReactNode;
    linkText: React.ReactNode;
    afterLink: React.ReactNode;
    /** Modal content */
    modal: ModalContent;
}

/**
 * Second paragraph with embedded culture modal
 * Uses dynamic loading for modal to optimize initial page load
 */
export function SecondParagraphWithModal({
    beforeCulture,
    cultureText,
    betweenCultureAndLink,
    linkText,
    afterLink,
    modal,
}: SecondParagraphWithModalProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCultureClick = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = (isOpen: boolean) => {
        setIsModalOpen(isOpen);
    };

    return (
        <>
            <SecondParagraph
                beforeCulture={beforeCulture}
                cultureText={cultureText}
                betweenCultureAndLink={betweenCultureAndLink}
                linkText={linkText}
                afterLink={afterLink}
                onCultureClick={handleCultureClick}
            />

            {/* Modal only renders when needed */}
            {isModalOpen && (
                <CultureModalContent
                    isOpen={isModalOpen}
                    onOpenChange={handleModalClose}
                    modal={modal}
                />
            )}
        </>
    );
}
