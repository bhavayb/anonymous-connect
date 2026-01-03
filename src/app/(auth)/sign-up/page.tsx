'use client'
import React, { useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import { useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/apiResponse'
import { Form } from '@/components/ui/form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

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

  const onsubmit = async (data: z.infer<typeof signUpSchema>) => {
    setisSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      toast(`Success: ${response.data.message}`)
      router.replace(`/verify/${encodeURIComponent(data.username)}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message)
    } finally {
      setisSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border bg-card/80 p-8 shadow-xl backdrop-blur">
        <div className="text-center">
          <p className="mx-auto mb-4 w-fit rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            Create account
          </p>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl mb-3">
            Join trueFeedback
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Sign up to start receiving anonymous messages.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="yourname"
                        className="h-11 rounded-xl border-border/60 bg-background/60 pr-10 shadow-sm focus-visible:ring-2 focus-visible:ring-ring"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          debounced(e.target.value)
                        }}
                      />
                      {isCheckingUsername && (
                        <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  </FormControl>

                  {!!usernameMessage && (
                    <p
                      className={cn(
                        "text-xs",
                        usernameMessage === "Username is available" ? "text-emerald-600" : "text-destructive"
                      )}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      className="h-11 rounded-xl border-border/60 bg-background/60 shadow-sm focus-visible:ring-2 focus-visible:ring-ring"
                      {...field}
                    />
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
                  <FormLabel className="text-sm">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      className="h-11 rounded-xl border-border/60 bg-background/60 shadow-sm focus-visible:ring-2 focus-visible:ring-ring"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="h-11 w-full rounded-xl">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating…
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Already a member?{" "}
          <Link href="/sign-in" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Page
