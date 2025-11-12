import { useCallback, useMemo } from 'react';

import type { User } from '@/shared/types';

const mockUser: User = {
  id: '1',
  name: 'Имя Фамилия',
  email: 'example@email.com',
};

export function useAuth() {
  const logout = useCallback(() => {
    console.log('Выход из аккаунта');
  }, []);

  return useMemo(
    () => ({
      user: mockUser,
      isAuthenticated: true,
      logout,
    }),
    [logout]
  );
}

