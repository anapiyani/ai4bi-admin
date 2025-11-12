import { z } from 'zod';

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Введите электронную почту' })
    .email({ message: 'Введите корректную почту' }),
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const defaultResetPasswordValues: ResetPasswordFormValues = {
  email: '',
};

export async function sendResetLink(values: ResetPasswordFormValues) {
  // TODO: replace with real API call when endpoint is available.
  console.log('Отправка ссылки для восстановления пароля', values);
  return Promise.resolve(values);
}

