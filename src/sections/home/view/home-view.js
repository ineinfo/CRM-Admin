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

  router.push('/dashboard');

  // return (
  //   <MainLayout>
  //     <ScrollProgress scrollYProgress={scrollYProgress} />
  //     <HomeHero />
  //   </MainLayout>
  // );
}
