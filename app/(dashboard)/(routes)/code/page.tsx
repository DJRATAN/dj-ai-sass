"use client"
import BotAvatar from '@/components/bot-avatar'
import Empty from '@/components/empty'
import Heading from '@/components/heading'
import Loader from '@/components/loader'
import { Button } from '@/components/ui/button'
import axios from 'axios';
import ReactMarkDown from "react-markdown"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import UserAvatar from '@/components/user-avatar'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Code, MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from "zod"
import ChatCompletionRequestMessage from 'openai'
import { useProModal } from '@/hooks/use-pro-modal'
import toast from 'react-hot-toast'

const CodePage = () => {
    const router = useRouter();
    const [message, setMessage] = useState<ChatCompletionRequestMessage[]>([])
    const proModal = useProModal();
    const formschema = z.object({
        prompt: z.string().min(1, {
            message: "Prompt is required"
        })
    })
    const form = useForm<z.infer<typeof formschema>>({
        resolver: zodResolver(formschema),
        defaultValues: {
            prompt: ""
        }
    })
    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formschema>) => {
        try {
            const userMessage: ChatCompletionRequestMessage = {
                role: "user",
                content: values.prompt,
            }
            const newMessage = [...message, userMessage]
            // console.log(newMessage)
            const response = await axios.post("/api/code", {
                message: newMessage,
            })

            console.log(response.data);
            setMessage((current) => [...current, userMessage, response.data])
            form.reset();

        } catch (error: any) {
            if (error?.response?.status === 403) {
                proModal.onOpen();
            } else {
                toast.error("Something went wrong")
            }
        } finally {
            router.refresh()
        }
        // console.log(values)
    }
    return (
        <div>
            <Heading
                title='Code Generation'
                description='Generate code using descriptive text.'
                icon={Code}
                iconColor='text-green-700'
                bgColor='bg-green-700/10'
            />
            <div className='px-4 lg:px-8'>
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2'>
                            <FormField
                                name='prompt'
                                render={({ field }) => (
                                    <FormItem className='col-span-12 lg:col-span-10'>
                                        <FormControl className='m-0 p-0'>
                                            <Input className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                                                disabled={isLoading}
                                                placeholder='How do I calculate the radius of a circle?' {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button className='col-span-12 lg:col-span-2' type='submit' disabled={isLoading}>Generate</Button>
                        </form>
                    </Form>
                </div>
                <div className='space-y-4 mt-4'>
                    {isLoading && (<div className='p-8 rounded-lg w-full flex items-center justify-center bg-muted'><Loader /></div>)}
                    {message.length === 0 && !isLoading && (<Empty label='No conversation started.' />)}
                    <div className='flex flex-col-reverse gap-y-4'>
                        {message.map((message) => (
                            <div
                                key={message.content}
                                className={cn("p-8 w-full flex items-start gap-x-8 rounded-lg", message.role === 'user' ? 'bg-white border border-black/10' : 'bg-muted')}
                            >
                                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                                <p className='text-sm'>
                                    <ReactMarkDown
                                        components={{
                                            pre: ({ node, ...props }) => (
                                                <div className='overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg'>
                                                    <pre {...props} />
                                                </div>
                                            ),
                                            code: ({ node, ...props }) => (
                                                <code className='bg-black/10 rounded-lg p-1' {...props} />
                                            )
                                        }} className={"text-sm overflow-hidden leading-7"}>
                                        {message.content || ""}
                                    </ReactMarkDown>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CodePage
