export default function ProjectLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="container mx-auto pt-8 px-8 sm:pt-20 sm:px-24 md:px-48 md:max-w-6xl">
            {children}
        </main>
    )
}