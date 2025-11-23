import { Chip } from "@heroui/react"

interface TagsProps {
    tags: string[];
    variant?: "primary" | "secondary" | "tertiary" | "soft";
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function Tags({ tags, variant = "secondary", size = "md", className = "" }: TagsProps) {
    if (!tags || tags.length === 0) return null;

    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {tags.map((tag, index) => (
                <Chip
                    key={index}
                    variant={variant}
                    size={size}
                >
                    {tag}
                </Chip>
            ))}
        </div>
    );
}
