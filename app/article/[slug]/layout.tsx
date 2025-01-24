export default function ArticleLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="container mx-auto pt-8 px-8 sm:px-24 md:px-48 md:max-w-[72rem]">
            {children}
        </div>
    )
}