'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { getNavItems } from '@/features/auth-header/model';
import { UserProfile } from '@/features/user-profile/ui';

export function AuthHeader() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  if (!isAuthenticated) {
    return null;
  }

  const navItems = getNavItems();

  return (
    <header className='sticky top-0 z-40 bg-[#eef3fb]'>
      <div className='flex w-full items-center justify-between px-8 py-2'>
        <div className='flex items-center gap-[10px]'>
          <Link
            href='/auctions'
            className='text-lg font-semibold text-slate-900 transition hover:text-slate-950'
          >
            Панель Управления AI FOR BI
          </Link>

          <nav className='flex items-center gap-2 px-6 py-1'>
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <Link key={item.id} href={item.href}>
                  <Button
                    variant='ghost'
                    className={cn(
                      'h-8 w-[86px] gap-2 rounded-sm py-[6px] px-3 font-sans text-sm font-medium leading-5 tracking-normal cursor-pointer',
                      'hover:bg-white hover:text-[#020617]',
                      isActive
                        ? 'bg-white text-[#020617]'
                        : 'text-[#64748B]'
                    )}
                  >
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        <UserProfile />
      </div>
    </header>
  );
}

