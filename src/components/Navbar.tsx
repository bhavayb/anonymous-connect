'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-200 text-black">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <Link href="/" className="text-2xl font-extrabold tracking-tight hover:text-slate-300 transition-colors">
          trueFeedback
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="hidden sm:inline text-sm md:text-base px-3 py-1 rounded bg-gray-800/70">
                Welcome, <span className="font-semibold">{user?.username || user?.email}</span>
              </span>
              <Link href="/dashboard">
                <Button className="bg-slate-100 text-black hover:bg-slate-200 transition-colors font-semibold px-5 py-2 rounded">
                  Dashboard
                </Button>
              </Link>
              <Button
                className="bg-slate-100 text-black hover:bg-slate-200 transition-colors font-semibold px-5 py-2 rounded"
                onClick={() => signOut()}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
            <Link href="/sign-in">
              <Button className="bg-slate-100 text-black hover:bg-slate-200 transition-colors font-semibold px-5 py-2 rounded">
                Sign in
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-slate-100 text-black hover:bg-slate-200 transition-colors font-semibold px-5 py-2 rounded">
                Sign up
              </Button>
            </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
