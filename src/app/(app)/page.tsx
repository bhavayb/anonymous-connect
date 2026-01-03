'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Inbox, Link2, Mail, Send, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <>
      <main className="flex flex-1 items-center justify-center px-4 py-16 md:px-10 md:py-20">
        <div className="w-full max-w-6xl">
          {/* Hero Section - Enhanced */}
          <section className="mx-auto mb-16 text-center md:mb-20">
            <div className="relative inline-flex items-center gap-2 rounded-full border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-4 py-1.5 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-foreground/80">
                Anonymous feedback, done right
              </span>
            </div>

            <h1 className="mt-8 bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
              Dive into the world of
              <br />
              <span className="bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text">
                anonymous feedback
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
              True Feedback — where your identity stays private and conversations stay respectful. Start receiving honest feedback today.
            </p>
          </section>

          {/* Carousel - Premium Design */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/5 via-transparent to-primary/5 blur-2xl" />
            
            <Carousel
              plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
              opts={{ loop: true, align: 'start' }}
              className="relative mx-auto w-full"
            >
              <CarouselContent className="-ml-3 md:-ml-4">
                {messages.map((message, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-3 md:basis-1/2 md:pl-4 lg:basis-1/3"
                  >
                    <Card className="group h-full border-border/50 bg-gradient-to-br from-card via-card to-card/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <CardTitle className="text-base font-semibold leading-tight sm:text-lg">
                            {message.title}
                          </CardTitle>
                          <div className="flex-none rounded-lg border bg-background/60 p-2 shadow-sm transition-all group-hover:border-primary/30 group-hover:bg-primary/5">
                            <Mail className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {message.content}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                          {message.received}
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="hidden border-border/50 bg-background/80 shadow-lg backdrop-blur-sm transition-all hover:bg-background/90 sm:inline-flex -left-4" />
              <CarouselNext className="hidden border-border/50 bg-background/80 shadow-lg backdrop-blur-sm transition-all hover:bg-background/90 sm:inline-flex -right-4" />
            </Carousel>
          </div>

          {/* How it Works - Modern Grid */}
          <section className="mt-20 md:mt-24">
            <div className="mb-10 text-center">
              <h2 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
                How it works
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground">
                Create your board, share your link, and receive anonymous messages—then manage everything in your dashboard.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Step 1 */}
              <Card className="group relative overflow-hidden border-border/50 bg-gradient-to-br from-card via-card to-card/90 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                
                <CardHeader className="relative space-y-4 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-primary/20 bg-primary/10 shadow-sm transition-all group-hover:scale-110 group-hover:border-primary/40 group-hover:shadow-md group-hover:shadow-primary/20">
                      <Link2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      1
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold">Share your link</CardTitle>
                </CardHeader>

                <CardContent className="relative text-sm leading-relaxed text-muted-foreground">
                  Sign up in seconds and get a unique profile link to share anywhere—social media, bio, or direct messages.
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="group relative overflow-hidden border-border/50 bg-gradient-to-br from-card via-card to-card/90 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                
                <CardHeader className="relative space-y-4 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-primary/20 bg-primary/10 shadow-sm transition-all group-hover:scale-110 group-hover:border-primary/40 group-hover:shadow-md group-hover:shadow-primary/20">
                      <Send className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      2
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold">Receive messages</CardTitle>
                </CardHeader>

                <CardContent className="relative text-sm leading-relaxed text-muted-foreground">
                  Anyone with your link can send anonymous feedback instantly. No login required, completely private and fast.
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="group relative overflow-hidden border-border/50 bg-gradient-to-br from-card via-card to-card/90 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                
                <CardHeader className="relative space-y-4 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-primary/20 bg-primary/10 shadow-sm transition-all group-hover:scale-110 group-hover:border-primary/40 group-hover:shadow-md group-hover:shadow-primary/20">
                      <Inbox className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      3
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold">Manage dashboard</CardTitle>
                </CardHeader>

                <CardContent className="relative text-sm leading-relaxed text-muted-foreground">
                  View all messages in one place, refresh anytime, and toggle message acceptance on/off with a single click.
                </CardContent>
              </Card>
            </div>

            {/* CTA Buttons - Enhanced */}
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/sign-up" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/90 px-8 shadow-lg transition-all hover:shadow-xl hover:shadow-primary/25 sm:w-auto"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Create your board
                    <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary opacity-0 transition-opacity group-hover:opacity-100" />
                </Button>
              </Link>

              <Link href="/sign-in" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-12 w-full rounded-xl border-border/50 bg-background/50 px-8 shadow-sm backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-background/80 hover:shadow-md sm:w-auto"
                >
                  Sign in
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Footer - Refined */}
      <footer className="border-t border-border/50 bg-background/80 py-8 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            © 2025 trueFeedback. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}