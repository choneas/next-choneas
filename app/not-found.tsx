import Image from "next/image"
import Link from "next/link"

export default function NotFound() {
    return (
        <div className="flex flex-col justify-center items-center space-y-6 mt-16">
            <h1>4 🫥 4</h1>
            <p>What are you looking for?</p>
            <p className="px-4 text-center text-content4-foreground">If it seems like not right, check your connection to Notion. ( notion.so )</p>

            <Image
                unoptimized
                alt="Theresa nodding"
                src="/gifs/theresa-nod.gif"
                width={200}
                height={200}
            />

            <Link href="/">
                <button className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-4 min-w-20 h-10 text-small gap-2 rounded-medium [&amp;>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none bg-primary text-primary-foreground data-[hover=true]:opacity-hover" type="button">Go back to home</button>
            </Link>

        </div>
    )
}