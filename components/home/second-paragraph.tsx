import Link from "next/link";

interface SecondParagraphProps {
    /** Pre-rendered paragraph parts */
    beforeCulture: React.ReactNode;
    cultureText: React.ReactNode;
    betweenCultureAndLink: React.ReactNode;
    linkText: React.ReactNode;
    afterLink: React.ReactNode;
    /** Click handler for culture text */
    onCultureClick: () => void;
}

/**
 * Second paragraph text content - SSR optimized
 * Separates text rendering from modal logic
 */
export function SecondParagraph({
    beforeCulture,
    cultureText,
    betweenCultureAndLink,
    linkText,
    afterLink,
    onCultureClick,
}: SecondParagraphProps) {
    return (
        <span className="text-[1.4rem] lg:text-2xl text-foreground/85 leading-relaxed max-w-[85vw] md:max-w-4xl px-2 md:px-6 block">
            {beforeCulture}
            <button
                onClick={onCultureClick}
                className="text-accent hover:text-accent/80 underline underline-offset-4 transition-colors cursor-pointer inline bg-transparent border-none p-0 font-inherit"
            >
                {cultureText}
            </button>
            {betweenCultureAndLink}
            <Link
                href="/article"
                className="text-accent hover:text-accent/80 underline underline-offset-4 transition-colors"
            >
                {linkText}
            </Link>
            {afterLink}
        </span>
    );
}