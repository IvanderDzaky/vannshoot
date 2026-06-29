'use client';
import { FC } from 'react';

import Features from './_components/Features';
import Hero from './_components/Hero';
import Steps from './_components/Steps';

const Home: FC = () => {
  return (
    <div className="w-full">
      <Hero />
      <Features />
      <Steps />
    </div>
  );
};

export default Home;
