'use client';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field';
import { loginSchema } from '@/schemas/auth';
import type { LoginValues } from '@/services/auth';
import { signIn } from '@/lib/authClient';

const LoginForm: FC = () => {
  const router = useRouter();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: handleLogin, isPending } = useMutation({
    mutationFn: async (values: LoginValues) => {
      const { data, error } = await signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: '/admin/dashboard',
      });

      if (error) {
        let message = 'Terjadi kesalahan saat login.';
        if (error.status === 401 || error.code === 'INVALID_EMAIL_OR_PASSWORD') {
          message = 'Email atau password salah.';
        } else if (error.code === 'USER_NOT_FOUND') {
          message = 'Pengguna tidak ditemukan.';
        }
        throw new Error(message);
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Login Berhasil! Selamat Datang Kembali.');
      router.push('/admin/dashboard');
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (values: LoginValues) => {
    handleLogin(values);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
      <div className="space-y-4">
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <FieldContent>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              disabled={isPending}
              {...form.register('email')}
              className="rounded-xl border-2 focus-visible:ring-blue-600 dark:bg-zinc-900"
            />
          </FieldContent>
          {form.formState.errors.email && (
            <FieldError>{form.formState.errors.email.message}</FieldError>
          )}
        </Field>

        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
          <FieldContent>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              disabled={isPending}
              {...form.register('password')}
              className="rounded-xl border-2 focus-visible:ring-blue-600 dark:bg-zinc-900"
            />
          </FieldContent>
          {form.formState.errors.password && (
            <FieldError>{form.formState.errors.password.message}</FieldError>
          )}
        </Field>
      </div>

      <Button
        type="submit"
        className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-[#4e7145]/20 active:scale-[0.98]"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Memproses...
          </>
        ) : (
          'Masuk ke Dashboard'
        )}
      </Button>

      {/* <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Belum punya akun?{' '}
        <Button
          variant="link"
          className="h-auto p-0 text-blue-600 dark:text-blue-400 font-semibold"
          type="button"
        >
          Hubungi Admin
        </Button>
      </div> */}
    </form>
  );
};

export default LoginForm;
