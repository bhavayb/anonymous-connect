'use client'
import MessageCard from '@/components/message'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Message } from '@/model/user'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { set } from 'mongoose'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import {useCallback, useEffect, useState} from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [profileUrl, setProfileUrl] = useState<string>('')
  
   const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => String(message._id) !== messageId));
  };

  const {data: session} = useSession()
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  })
  
  const {register, watch ,setValue} = form;

  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessage = useCallback(async()=>{
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-message')
      setValue('acceptMessages', response.data.isAcceptingMessage ?? false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Error fetching accept messages setting')
    } finally{
      setIsSwitchLoading(false);
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false)=>{
    setIsLoading(true);
    setIsSwitchLoading(false);
    try{
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])
      if(refresh){
        toast.success('Messages refreshed')
      }
    }catch(error){
      const axiosError = error as AxiosError<ApiResponse>;
      // toast.error(axiosError.response?.data.message || 'Error fetching messages')
    } finally{
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, [setIsLoading, setMessages])

  useEffect(()=>{
    if(!session || !session.user ) return
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages])

  useEffect(() => {
    if (session && session.user) {
      // Only run on client
      if (typeof window !== 'undefined') {
        const { username } = session.user as User;
        const baseUrl = `${window.location.protocol}//${window.location.host}`;
        setProfileUrl(`${baseUrl}/u/${username}`);
      }
    }
  }, [session])

  // hadle switch change
  const handleSwitchChange = async()=>{
    try{
      const response = await axios.post<ApiResponse>('/api/accept-message', {
        isAcceptingMessage: !acceptMessages
      });
      setValue('acceptMessages', !acceptMessages);
      toast.success(response.data.message);
    } catch(error){
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Error updating accept messages setting')
    }

  }

  if (!session || !session.user){
      return <div>Please Login</div>
  }

  const copyToClipboard = async () => {
    if (profileUrl) {
      navigator.clipboard.writeText(profileUrl);
      toast.success('Profile URL copied to clipboard!');
    }
  }
console.log('Messages in render:', messages);

   return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl border bg-card/80 p-6 shadow-lg backdrop-blur sm:p-10">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 w-fit rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              Dashboard
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">User dashboard</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Share your link and manage incoming messages.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
            className="h-10 gap-2 self-start sm:self-auto"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>

        <div className="mb-8 space-y-3">
          <h2 className="text-sm font-semibold">Your unique link</h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="h-11 w-full rounded-xl border border-border/60 bg-background/60 px-3 text-sm shadow-sm
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-80"
            />
            <Button onClick={copyToClipboard} className="h-11 rounded-xl sm:w-auto">
              Copy link
            </Button>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between rounded-2xl border border-border/60 bg-background/40 p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Accept messages</p>
            <p className="text-xs text-muted-foreground">
              Turn off to temporarily pause new messages.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              {...register('acceptMessages')}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
            <span className="text-sm text-muted-foreground">
              {acceptMessages ? 'On' : 'Off'}
            </span>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={String(message._id)}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-border/70 bg-background/30 p-8 text-center">
              <p className="text-sm text-muted-foreground">No messages to display.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page
