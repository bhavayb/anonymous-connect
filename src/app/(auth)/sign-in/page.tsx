'use client'
import React, {useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import { useState } from 'react'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { signInSchema } from '@/schemas/signInSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/apiResponse'
import { Form } from '@/components/ui/form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
// username
// debouncing techniques
const Page = () => {
  const [isSubmitting, setisSubmitting] = useState(false)
  const router = useRouter()

  // zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
      
    }
  })


  const onsubmit = async (data : z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials',{
        redirect: false,
        identifier: data.identifier,
        password: data.password
    })
    if(result?.error){
        toast.error("Incorrect username or password")

    } 
    if (result?.url) {
        router.replace('/dashboard')
    }  
    
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            trueFeedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onsubmit)} className='space-y-6'>
            
              
              <FormField
                      name="identifier"
                      control={form.control}
                      
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email/Username</FormLabel>
                          <FormControl>
                            <Input placeholder="email/username" {...field}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

              <FormField
                      name="password"
                      control={form.control}
                      
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input placeholder="password" {...field}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

              <Button type='submit' disabled={isSubmitting} className='w-full mt-4'>
                Signin
              </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page
