import { Metadata } from 'next';

import { BASE_URL } from '@/lib/env';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: {
    canonical: `${BASE_URL}/generator`,
  },
};

export default function GeneratorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
