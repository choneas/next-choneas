import { Spinner } from "@heroui/react"

export default function ArticleLoading() {
    return (
        <div className="flex flex-col h-screen justify-center items-center content-center space-y-2 -mt-16">
            <Spinner />
            <span>Loading...</span>
            <span>If stuck, check your connection to Notion.( notion.so )</span>
        </div>
    )
}