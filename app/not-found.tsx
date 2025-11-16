import { Button } from "@heroui/react"
import { GoHomeFill } from "react-icons/go"
import Image from "next/image"
import Link from "next/link"

export default function NotFound() {
    return (
        <div className="flex flex-col justify-center items-center space-y-6 mt-16">
            <h1>4 🫥 4</h1>
            <p>What are you looking for?</p>

            <Image
                unoptimized
                alt="Theresa nodding"
                src="/pictures/theresa-nod.gif"
                width={200}
                height={200}
            />

            <Button variant="primary" size="lg">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                >
                    <GoHomeFill />
                    Go Home
                </Link>
            </Button>
        </div>
    )
}