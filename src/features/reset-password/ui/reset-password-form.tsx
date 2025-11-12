'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';

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
  defaultResetPasswordValues,
  resetPasswordSchema,
  sendResetLink,
  type ResetPasswordFormValues,
} from '@/features/reset-password/model';

export function ResetPasswordForm() {
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: defaultResetPasswordValues,
    mode: 'onSubmit',
  });

  const handleSubmit = async (values: ResetPasswordFormValues) => {
    try {
      await sendResetLink(values);
    } catch (error) {
      console.error('Не удалось отправить ссылку для восстановления', error);
    }
  };

  return (
    <div className='flex flex-col gap-6'>
      <Link
        href='/auth/login'
        className='inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-800'
      >
        <ArrowLeft size={20} />
        Назад
      </Link>

      <div className='flex flex-col gap-1'>
        <h1 className='font-sans text-xl font-semibold leading-7 tracking-normal text-[#020617]'>
          Восстановление пароля
        </h1>
        <p className='font-sans text-sm font-normal leading-5 tracking-normal text-[#64748B]'>
          Введите электронную почту, чтобы получить ссылку для восстановления.
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

          <div className='flex justify-end'>
            <Button
              type='submit'
              className='cursor-pointer h-9 rounded-md bg-[#0F172A] px-3 py-2 font-sans text-sm font-medium leading-5 tracking-normal text-center align-middle text-[#F8FAFC] transition hover:bg-slate-800 disabled:opacity-70'
            >
              Отправить ссылку
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

