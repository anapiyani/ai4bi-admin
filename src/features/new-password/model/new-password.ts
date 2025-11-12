import { z } from 'zod';

const passwordRequirements =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\S]{8,}$/;

export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Минимум 8 символов' })
      .regex(passwordRequirements, {
        message: 'Добавьте строчную, заглавную буквы и цифру',
      }),
    confirmPassword: z.string().min(1, { message: 'Повторите пароль' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Пароли не совпадают',
  });

export type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;

export const defaultNewPasswordValues: NewPasswordFormValues = {
  password: '',
  confirmPassword: '',
};

export async function saveNewPassword(values: NewPasswordFormValues) {
  // TODO: replace with real API call when endpoint is available.
  console.log('Сохранение нового пароля', values);
  return Promise.resolve(values);
}

