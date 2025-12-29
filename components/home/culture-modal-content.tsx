"use client";

import Image from "next/image";
import { Modal, Button, ScrollShadow } from "@heroui/react";
import { BsFillEmojiSurpriseFill } from "react-icons/bs";

interface ModalContent {
    title: string;
    paragraphs: React.ReactNode[];
    imageSrc?: string;
    imageAlt?: string;
}

interface CultureModalContentProps {
    /** Whether modal is open */
    isOpen: boolean;
    /** Close handler */
    onOpenChange: (isOpen: boolean) => void;
    /** Modal content */
    modal: ModalContent;
}

/**
 * Culture modal content - client component for interaction
 * Dynamically loaded to optimize initial page load
 */
export function CultureModalContent({
    isOpen,
    onOpenChange,
    modal,
}: CultureModalContentProps) {
    const { title, paragraphs, imageSrc = "/pictures/landscape.webp", imageAlt = "Landscape" } = modal;

    return (
        <Modal.Backdrop
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            className="bg-linear-to-t from-foreground/70 via-accent/20 to-transparent"
            variant="blur"
        >
            <Modal.Container size="lg" placement="center">
                <Modal.Dialog className="dark overflow-hidden pt-0 px-0 md:min-w-3xl relative max-h-180">
                    <Modal.CloseTrigger className="z-50 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90 transition-colors rounded-full" />

                    <ScrollShadow
                        className="max-h-[80vh] animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
                        hideScrollBar
                    >
                        {/* Header image - now scrollable */}
                        <div className="relative w-full h-48 md:h-64">
                            <Image
                                src={imageSrc}
                                alt={imageAlt}
                                fill
                                loading="lazy"
                                className="object-cover"
                                quality={75}
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                            {/* Title overlay */}
                            <div className="absolute bottom-4 left-6 right-6">
                                <h2 className="text-2xl md:text-3xl font-bold text-accent-soft drop-shadow-lg">
                                    {title}
                                </h2>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 pb-20 space-y-4">
                            {paragraphs.map((paragraph, index) => (
                                <p key={index} className="text-foreground/85 leading-relaxed text-xl">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </ScrollShadow>

                    {/* Floating close button */}
                    <Modal.Footer className="absolute bottom-0 left-0 right-0 flex justify-center p-6 bg-linear-to-t from-background via-background/90 to-transparent">
                        <Button
                            isIconOnly
                            size="lg"
                            slot="close"
                            variant="secondary"
                            className="dark size-12 rounded-full"
                        >
                            <BsFillEmojiSurpriseFill />
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    );
}