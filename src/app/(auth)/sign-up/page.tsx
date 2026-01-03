'use client'
import React, {useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import { useState } from 'react'
import { useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { signInSchema } from '@/schemas/signInSchema'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/apiResponse'
import { Form } from '@/components/ui/form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
// username
// debouncing techniques
const Page = () => {
  const [username, setusername] = useState("")
  const [usernameMessage, setusernameMessage] = useState("")
  const [isCheckingUsername, setisCheckingUsername] = useState(false)
  const [isSubmitting, setisSubmitting] = useState(false)
  const debounced = useDebounceCallback(setusername, 300)

  const router = useRouter()

  // zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      
    }
  })

  useEffect(()=>{
    const checkUsernameUnique = async()=>{
      if(username){
        setisCheckingUsername(true)
        setusernameMessage("")
        try {
          const response  = await axios.get(`/api/check-username-unique?username=${username}`)
          const message = response.data.message
          setusernameMessage(message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setusernameMessage(axiosError.response?.data.message || 'Error checking username');
        } finally{
          setisCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [username])

  const onsubmit = async (data : z.infer<typeof signUpSchema>) => {
    setisSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      console.log("response from signup api:", response)
      toast(`Success: ${response.data.message}`)
      router.replace(`/verify/${username}`)
      setisSubmitting(false)
    } catch (error) {
      console.log("error in signup of user:", error)
      const axiosError = error as AxiosError<ApiResponse>;
      console.log("axiosError:", axiosError)
      const errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage)
      setisSubmitting(false)

    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join trueFeedback
          </h1>
          <p className="mb-4">Sign up to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onsubmit)} className='space-y-6'>
            <FormField
                      name="username"
                      control={form.control}
                      
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="username" {...field}
                            onChange={(e)=>{
                              field.onChange(e)
                              debounced(e.target.value)
                            }}
                            />
                            
                          </FormControl>
                          {isCheckingUsername && <Loader2 className='animate-spin'/>}
                          <p className = {`text-sm ${usernameMessage === "Username is available" ? "text-green-600" : "text-red-600"}`}>test {usernameMessage}</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
              
              <FormField
                      name="email"
                      control={form.control}
                      
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email" {...field}/>
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
                {
                  isSubmitting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                    </>
                  ): "Sign Up"
                }
              </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member ?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page
