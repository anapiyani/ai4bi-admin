'use client';

import { useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRouter } from "next/navigation";

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  defaultLoginUserValues,
  loginUser,
  loginUserSchema,
  type LoginUserFormValues,
} from '@/features/login-user/model';

export function LoginUserForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<LoginUserFormValues>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: defaultLoginUserValues,
    mode: 'onSubmit',
  });

  const handleSubmit = async (values: LoginUserFormValues) => {
    setIsSubmitting(true);
    try {
      await loginUser(values);
      router.push('/auctions');
    } catch (error) {
      console.error('Не удалось выполнить вход', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () =>
    setShowPassword((prevState) => !prevState);

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-1'>
        <h1 className='font-sans text-xl font-semibold leading-7 tracking-normal text-[#020617]'>
          Вход в систему
        </h1>
        <p className='font-sans text-sm font-normal leading-5 tracking-normal text-[#64748B]'>
          Введите электронную почту и пароль.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className='flex flex-col gap-4'
          noValidate
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='flex flex-col gap-1'>
                <FormLabel className='font-sans text-sm font-medium leading-5 tracking-normal text-center align-middle text-[#020617]'>
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='email'
                    placeholder='example@email.com'
                    autoComplete='email'
                    className='h-10 rounded-md border border-[#E2E8F0] bg-white py-2 px-3 font-sans text-sm font-normal leading-5 tracking-normal align-middle placeholder:text-[#64748B] focus-visible:border-slate-300 focus-visible:ring-slate-200'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='flex flex-col gap-1'>
                <FormLabel className='font-sans text-sm font-medium leading-5 tracking-normal text-center align-middle text-[#020617]'>
                  Пароль
                </FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Введите ваш пароль'
                      autoComplete='current-password'
                      className='h-10 rounded-md border border-[#E2E8F0] bg-white py-2 px-3 pr-12 font-sans text-sm font-normal leading-5 tracking-normal align-middle placeholder:text-[#64748B] focus-visible:border-slate-300 focus-visible:ring-slate-200'
                    />
                    <button
                      type='button'
                      onClick={togglePasswordVisibility}
                      className='absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-slate-500'
                      aria-label={
                        showPassword ? 'Скрыть пароль' : 'Показать пароль'
                      }
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='text-center h-9 flex items-center justify-center gap-1.5 rounded-md px-3 py-0 '>
            <Link
              href='/auth/forgot-password'
              className='font-sans text-sm font-medium leading-5 tracking-normal underline align-middle text-blue-700 transition hover:text-blue-800'
            >
              Не помню пароль
            </Link>
          </div>

          <div className='flex justify-end'>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='cursor-pointer h-9 w-[66px]  rounded-md bg-[#0F172A] px-3 py-2 font-sans text-sm font-medium leading-5 tracking-normal text-center align-middle text-[#F8FAFC] transition hover:bg-slate-800 disabled:opacity-70'
            >
              {isSubmitting ? 'Входим...' : 'Войти'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

