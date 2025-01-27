"use client"
import Empty from '@/components/empty'
import Heading from '@/components/heading'
import Loader from '@/components/loader'
import { Button } from '@/components/ui/button'
import axios from 'axios';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from '@hookform/resolvers/zod'
import { Video } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from "zod"
import { useProModal } from '@/hooks/use-pro-modal'

const VideoPage = () => {
    const router = useRouter();
    const [video, setVideo] = useState<string>()
    const proModal = useProModal();
    const formschema = z.object({
        prompt: z.string().min(1, {
            message: "Video Prompt is required"
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
            setVideo(undefined)
            const response = await axios.post("/api/video", values)
            setVideo(response.data[0])            // console.log(response.data);
            form.reset();

        } catch (error: any) {
            if (error?.response?.status === 403) {
                proModal.onOpen();
            }
        } finally {
            router.refresh()
        }
        // console.log(values)
    }
    return (
        <div>
            <Heading
                title='Video Generation'
                description='Turn your prompt into video'
                icon={Video}
                iconColor='text-orange-700'
                bgColor='bg-orange-700/10'
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
                                                placeholder='Fish swimming into Water at Top Hills' {...field} />
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
                    {!video && !isLoading && (<Empty label='No Music Generated' />)}
                    {video && (<video controls className='w-full aspect-video rounded-lg border bg-black mt-8'>
                        <source src={video} />
                    </video>)}
                </div>
            </div>
        </div>
    )
}

export default VideoPage
