import { LoginForm } from '@/components/component/login-form';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

export default function Login() {

  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      toast.success('Authenticated');
      router.push('/');
    }
  }, [status]);
   
  return (
    <div className='w-full min-h-screen py-6 px-4 flex items-center justify-center'>
      <LoginForm/>
    </div>
  );
}