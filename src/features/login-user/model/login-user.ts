import { z } from 'zod';

export const loginUserSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Введите электронную почту' })
    .email({ message: 'Введите корректную почту' }),
  password: z
    .string()
    .min(1, { message: 'Введите пароль' }),
  phone: z.string()
});

export type LoginUserFormValues = z.infer<typeof loginUserSchema>;

export const defaultLoginUserValues: LoginUserFormValues = {
  email: '',
  password: '',
  phone: "+79001234567"
};

export async function loginUser(values: LoginUserFormValues) {
  console.log(values);
  const response = await fetch("/api/login/", {
    method: 'POST',
    body: JSON.stringify(values),
  });

  console.log(response);
  return Promise.resolve(values);
}

