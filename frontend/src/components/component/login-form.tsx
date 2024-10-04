
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export function LoginForm() {
  const router = useRouter();
  const { handleSubmit, register, formState : { errors } } = useForm({ 
    defaultValues: {
      email: 'Amjad@desolint.com',
      password: '123456abc',
    },
    resolver: yupResolver(schema) 
  });

  const onSubmit = async (data: {
    email: string;
    password: string;
  }) => {
    const { email, password } = data;
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result && result.error) {
      alert('Invalid email or password'); // Show an error message if login fails
    } else {
      router.push('/'); // Redirect to a protected route after successful login
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>Enter your email and password to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" {...register('email')} type="email" placeholder="m@example.com" required />
              {errors.email && <p className="text-red-500 text-xs capitalize ">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register('password')} required />
              {errors.password && <p className="text-red-500 text-xs capitalize">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
