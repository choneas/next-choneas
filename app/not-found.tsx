import { Button } from "@heroui/button"
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

            <Button as={Link} href="/" color="primary" startContent={<GoHomeFill />}>Go Home</Button>

        </div>
    )
}