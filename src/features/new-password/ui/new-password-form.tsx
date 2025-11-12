'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
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
  defaultNewPasswordValues,
  newPasswordSchema,
  saveNewPassword,
  type NewPasswordFormValues,
} from '@/features/new-password/model';

export function NewPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: defaultNewPasswordValues,
    mode: 'onSubmit',
  });

  const handleSubmit = async (values: NewPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      await saveNewPassword(values);
    } catch (error) {
      console.error('Не удалось сохранить новый пароль', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-1'>
        <h1 className='font-sans text-xl font-semibold leading-7 tracking-normal text-[#020617]'>
          Новый пароль
        </h1>
        <p className='font-sans text-sm font-normal leading-5 tracking-normal text-[#64748B]'>
          Ваш пароль должен содержать минимум 1 строчную, 1 заглавную букву и 1
          цифру.
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
            name='password'
            render={({ field }) => (
              <FormItem className='flex flex-col gap-1'>
                <FormLabel className='font-sans text-sm font-medium leading-5 tracking-normal text-center align-middle text-[#020617]'>
                  Новый пароль
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='password'
                    placeholder='Введите ваш пароль'
                    autoComplete='new-password'
                    className='h-10 rounded-md border border-[#E2E8F0] bg-white py-2 px-3 font-sans text-sm font-normal leading-5 tracking-normal align-middle placeholder:text-[#64748B] focus-visible:border-slate-300 focus-visible:ring-slate-200'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem className='flex flex-col gap-1'>
                <FormLabel className='font-sans text-sm font-medium leading-5 tracking-normal text-center align-middle text-[#020617]'>
                  Повторите новый пароль
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='password'
                    placeholder='Введите ваш пароль'
                    autoComplete='new-password'
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
              disabled={isSubmitting}
              className='cursor-pointer h-9 rounded-md bg-[#0F172A] px-3 py-2 font-sans text-sm font-medium leading-5 tracking-normal text-center align-middle text-[#F8FAFC] transition hover:bg-slate-800 disabled:opacity-70'
            >
              {isSubmitting ? 'Сохраняем...' : 'Сохранить пароль'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

