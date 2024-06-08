import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { config } from "dotenv";
import { CreateChatCompletionRequestMessage } from "openai/resources/index.mjs";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "../subscription";

config();
const openAIClient = new OpenAI({
    apiKey: process.env['NEXT_PUBLIC_OPENAI_API_KEY']
});

const instructionMessage: CreateChatCompletionRequestMessage = {
    role: "system",
    content: "You are a code generator. You must answer only in markdown code snippets. Use comments for explanations."
}
export async function POST(req: Request) {
    const { userId } = auth();
    console.log(userId);

    const body = await req.json();
    const { message } = body;

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!process.env['NEXT_PUBLIC_OPENAI_API_KEY']) {
        return new NextResponse("OpenAI API Key not configured", { status: 500 });
    }
    if (!message) {
        return new NextResponse("Message is required", { status: 400 });
    }
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!freeTrial && isPro) {
        return new NextResponse("Free trial has expired", { status: 403 });
    }
    try {
        const completion = await openAIClient.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [instructionMessage, ...message]
        });
        if (!isPro) {
            await increaseApiLimit();
        }
        console.log(completion.choices[0]);
        return NextResponse.json(completion.choices[0]);
    } catch (error) {
        console.error("Error creating completion:", error);
        console.log("[CODE_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

// require("dotenv").config();
// const openAIClient = new OpenAI({
//     apiKey: process.env['NEXT_PUBLIC_OPENAI_API_KEY']
// })


// export async function POST(
//     req: Request
// ) {
//     const { userId } = auth();
//     console.log(userId)
//     const body = await req.json();
//     const { message } = body;

//     if (!userId) {
//         return new NextResponse("Unauthorized", { status: 401 })
//     }
//     if (!openAIClient) {
//         return new NextResponse("OpenAI API Key not configured", { status: 500 })
//     }
//     if (!message) {
//         return new NextResponse("Message are Required")
//     }

//     try {
//         const completion = await openAIClient.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             messages
//         });

//         console.log(completion.choices[0]);
//         return NextResponse.json(completion.choices[0])
//     } catch (error) {
//         console.error("Error creating completion:", error);

//         console.log("[CONVERSATION_ERROR", error)
//         return new NextResponse("Internal error", { status: 500 })
//     }
//     // try {
//     //     // const response = await openai.chat.completions.create({
//     //     // // const response = await openAIClient.chat.completions.create({
//     //     //     model: "gpt-3.5-turbo",
//     //     //     messages
//     //     // })
//     //     // return NextResponse.json(response.data.choice[0].message)
//     //     // return NextResponse.json(response.choices[0].message)
//     // } catch (error) {
//     //     console.log("[CONVERSATION_ERROR", error)
//     //     return new NextResponse("Internal error", { status: 500 })
//     // }
// }