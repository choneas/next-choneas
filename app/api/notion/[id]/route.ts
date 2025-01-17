import { notion } from "@/lib/content";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const recordMap = await notion.getPage(params.id);
    return NextResponse.json(recordMap);
}