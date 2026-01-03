'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
// import { useCompletion } from 'ai/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import * as z from 'zod';
import { ApiResponse } from '@/types/apiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

// Simple local suggestions (4 messages)
const suggestedMessages: string[] = [
  "What's one thing that made you smile today?",
  "If you could travel anywhere right now, where would you go?",
  "What’s a goal you’re working on this month?",
  "What’s your favorite song at the moment?",
];

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message, { shouldValidate: true, shouldDirty: true });
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast.success(response.data.message);
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? 'Failed to sent message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-3xl border bg-card/80 p-6 shadow-lg backdrop-blur sm:p-10">
        <div className="mb-8 space-y-2 text-center">
          <p className="mx-auto w-fit rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            Anonymous • Private • Fast
          </p>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Send an anonymous message
          </h1>
          <p className="text-sm text-muted-foreground">
            Your message will be delivered to <span className="font-medium">@{username}</span>.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write something kind, curious, or fun…"
                      className="min-h-32 resize-none rounded-xl border-border/60 bg-background/60 shadow-sm focus-visible:ring-2 focus-visible:ring-ring"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {isLoading ? (
                <Button disabled className="min-w-40">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending…
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading || !messageContent} className="min-w-40">
                  Send message
                </Button>
              )}
            </div>
          </form>
        </Form>

        <div className="mt-10 space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Need inspiration?</p>
            <p className="text-sm text-muted-foreground">Tap a prompt to autofill your message.</p>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <h3 className="text-base font-semibold">Suggested prompts</h3>
            </CardHeader>

            <CardContent className="grid gap-3 sm:grid-cols-2">
              {suggestedMessages.map((msg, idx) => (
                <button
                  key={`${idx}-${msg}`}
                  type="button"
                  onClick={() => handleMessageClick(msg)}
                  className="group text-left rounded-xl border border-border/60 bg-background/50 p-4 shadow-sm transition
                             hover:-translate-y-0.5 hover:bg-muted/40 hover:shadow-md
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <p className="text-sm leading-relaxed">{msg}</p>
                  <p className="mt-2 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    Click to use
                  </p>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        <Separator className="my-10" />
        <div className="text-center">
          <div className="mb-4 text-sm text-muted-foreground">Want your own message board?</div>
          <Link href={'/sign-up'}>
            <Button size="lg" className="px-8">Create your account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}