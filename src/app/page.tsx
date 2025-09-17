
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-6"
        >
          <Icons.logo className="size-12 text-primary" />
          <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl font-headline">
            StackSwipe
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl mb-8"
        >
          An AI-powered social networking application for tech professionals.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button asChild size="lg" className="font-semibold">
            <Link href="/signup">Get Started</Link>
          </Button>
        </motion.div>
      </main>
      <footer className="w-full p-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} StackSwipe. All rights reserved.
      </footer>
    </div>
  );
}
