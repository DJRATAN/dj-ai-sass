import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { config } from "dotenv";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "../subscription";

config();
const openAIClient = new OpenAI({
    apiKey: process.env['NEXT_PUBLIC_OPENAI_API_KEY']
});
export async function POST(req: Request) {
    const { userId } = auth();

    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!process.env['NEXT_PUBLIC_OPENAI_API_KEY']) {
        return new NextResponse("OpenAI API Key not configured", { status: 500 });
    }
    if (!prompt) {
        return new NextResponse("Prompt is required", { status: 400 });
    }
    if (!amount) {
        return new NextResponse("Amount is required", { status: 400 });
    }
    if (!resolution) {
        return new NextResponse("Resolution is required", { status: 400 });
    }
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!freeTrial && isPro) {
        return new NextResponse("Free trial has expired", { status: 403 });
    }
    try {
        const response = await openAIClient.createImage({
            prompt,
            n: parseInt(amount, 10),
            size: resolution,
        })
        if (!isPro) {
            await increaseApiLimit();
        }
        return NextResponse.json(response.data.data);
    } catch (error) {
        console.error("Error creating completion:", error);
        console.log("[CODE_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}