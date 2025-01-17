export default function ArticleLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="container mx-auto px-8 sm:px-24 pt-8">
            {children}
        </div>
    )
}