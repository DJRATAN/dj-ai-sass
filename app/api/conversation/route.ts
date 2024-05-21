import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import OpenAI from "openai";
require("dotenv").config();
const openAIClient = new OpenAI({
    apiKey: process.env['NEXT_PUBLIC_OPENAI_API_KEY']
})

const openai = new OpenAI({
    organization: "org-kKaRlhY8XiwYO1wy0M3P0nTO",
    project: "proj_MNud6P3U0nxJgtnTmCe8hDTB",
});
export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        console.log(userId)
        const body = await req.json();
        const { message } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        if (!openai) {
            return new NextResponse("OpenAI API Key not configured", { status: 500 })
        }
        if (!message) {
            return new NextResponse("Message are Required")
        }

        const response = await openai.chat.completions.create({
        // const response = await openAIClient.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages
        })
        // return NextResponse.json(response.data.choice[0].message)
        return NextResponse.json(response.choices[0].message)
    } catch (error) {
        console.log("[CONVERSATION_ERROR", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}