import { CarForm } from '@/components/component/car-form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log(session);
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login'); // Redirect to login page if not authenticated
    }
  }, [status, router]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session || !session.user) {
    return <p>No session found</p>;
  }

  return (
    <div className='flex items-center justify-center min-h-screen py-4 px-2'>
      <CarForm/>
    </div>
  );
}
