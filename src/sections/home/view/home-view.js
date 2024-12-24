'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useScroll } from 'framer-motion';

import MainLayout from 'src/layouts/main';
import ScrollProgress from 'src/components/scroll-progress';
import HomeHero from '../home-hero';

// ----------------------------------------------------------------------

export default function HomeView() {
  const { scrollYProgress } = useScroll();
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return null; // Ensure no other UI is rendered since it's redirecting
}
