import Footer from '@/components/home/Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen flex-col'>
      <main className='mx-auto flex w-full flex-1 flex-col'>{children}</main>
      <Footer />
    </div>
  );
}
