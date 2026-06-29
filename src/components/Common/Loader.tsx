'use client';
import type { FC } from 'react';
import { ClipLoader } from 'react-spinners';

const Loader: FC = () => {
  return <ClipLoader color="#0d0d0d" size={50} />;
};

export default Loader;
