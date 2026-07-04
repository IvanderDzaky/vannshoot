import type { FC } from 'react';

import type { Testimonial } from '@/interfaces/features/testimonial';
import { getTestimonialById } from '@/services/testimonial';
import TestimonialForm from './_components/TestimonialForm';

type Props = {
  params: Promise<{ name: string }>;
};

const TestimonialsDetailCMS: FC<Props> = async ({ params }) => {
  const { name } = await params;
  const isEdit = name !== 'new';

  let initialData: Testimonial | null = null;

  if (isEdit) {
    // Treat 'name' as ID for testimonials
    const result = await getTestimonialById(name);
    if (result.success && result.data) {
      initialData = result.data as Testimonial;
    }
  }

  return <TestimonialForm initialData={initialData} />;
};

export default TestimonialsDetailCMS;
