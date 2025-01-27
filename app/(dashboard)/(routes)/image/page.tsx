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
import { Download, ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from "zod"
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardFooter } from '@/components/ui/card'
import Image from 'next/image'
import { useProModal } from '@/hooks/use-pro-modal'
import toast from 'react-hot-toast'
export const amountOptions = [
    {
        value: "1",
        label: "1 Photo",
    }, {
        value: "2",
        label: "2 Photo",
    }, {
        value: "3",
        label: "3 Photo",
    }, {
        value: "4",
        label: "4 Photo",
    }, {
        value: "5",
        label: "5 Photo",
    },
]
export const resolutionOptions = [
    {
        value: "256x256",
        label: "256x256",
    }, {
        value: "512x512",
        label: "512x512",
    }, {
        value: "1024x1024",
        label: "1024x1024",
    }
]
const ImageGeneration = () => {
    const router = useRouter();
    const [images, setImages] = useState<string[]>([])
    const proModal = useProModal();
    const formschema = z.object({
        prompt: z.string().min(1, {
            message: "Image Prompt is required"
        }),
        amount: z.string().min(1),
        resolution: z.string().min(1)
    })

    const form = useForm<z.infer<typeof formschema>>({
        resolver: zodResolver(formschema),
        defaultValues: {
            prompt: "",
            amount: "1",
            resolution: "512x512"
        }
    })
    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formschema>) => {
        try {
            console.log(values)

            setImages([])
            const response = await axios.post("/api/image", values);
            const urls = response.data.map((image: { url: string }) => image.url)
            setImages(urls);
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
                title='Image Generation'
                description='Turn your prompt into an image'
                icon={ImageIcon}
                iconColor='text-pink-700'
                bgColor='bg-pink-700/10'
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
                                    <FormItem className='col-span-12 lg:col-span-6'>
                                        <FormControl className='m-0 p-0'>
                                            <Input className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                                                disabled={isLoading}
                                                placeholder='A picute of a horse in Swiss alps' {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='amount'
                                render={({ field }) => (
                                    <FormItem className='col-span-12 lg:col-span-2'>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {amountOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >{option.label}</SelectItem>
                                                ))}
                                            </SelectContent>

                                        </Select>
                                    </FormItem>
                                )}

                            />

                            <FormField
                                control={form.control}
                                name='resolution'
                                render={({ field }) => (
                                    <FormItem className='col-span-12 lg:col-span-2'>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {resolutionOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >{option.label}</SelectItem>
                                                ))}
                                            </SelectContent>

                                        </Select>
                                    </FormItem>
                                )}

                            />
                            <Button className='col-span-12 lg:col-span-2 w-full' type='submit' disabled={isLoading}>Generate</Button>
                        </form>
                    </Form>
                </div>
                <div className='space-y-4 mt-4'>
                    {isLoading && (<div className='p-20'><Loader /></div>)}
                    {images.length === 0 && !isLoading && (<Empty label='No Image generated' />)}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                        {images.map((src) => (
                            <Card
                                key={src}
                                className=''
                            >
                                <div className="relative aspect-square">
                                    <Image
                                        src={src}
                                        alt='no '
                                        fill
                                    />
                                </div>
                                <CardFooter className='p-2'>
                                    <Button
                                        onClick={() => window.open(src)}
                                        variant={'secondary'}
                                        className='w-full'
                                    >
                                        <Download className='h-4 w-4 mr-2' />
                                        Download
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImageGeneration
