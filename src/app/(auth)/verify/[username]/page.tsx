'use client'
import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from "sonner"
import {  useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { verifySchema } from '@/schemas/verifySchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/apiResponse'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })

            toast.success(response.data.message)
            router.replace('/sign-in')
        } catch (error) {
            console.log("error in signup of user:", error)
            const axiosError = error as AxiosError<ApiResponse>;
            console.log("axiosError:", axiosError)
            const errorMessage = axiosError.response?.data.message;
            toast.error(errorMessage)
        }
    }


    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-3xl border bg-card/80 p-8 shadow-xl backdrop-blur">
                <div className="text-center">
                    <p className="mx-auto mb-4 w-fit rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                        Email verification
                    </p>
                    <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl mb-3">
                        Verify your account
                    </h1>
                    <p className="mb-8 text-sm text-muted-foreground">
                        Enter the 6-digit code sent to your email to continue.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm">Verification code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="123456"
                                            className="h-11 rounded-xl border-border/60 bg-background/60 shadow-sm focus-visible:ring-2 focus-visible:ring-ring"
                                            inputMode="numeric"
                                            autoComplete="one-time-code"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="h-11 w-full rounded-xl">
                            Submit
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerifyAccount

