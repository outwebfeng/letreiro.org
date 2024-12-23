import Navigation from '@/components/home/Navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
} 