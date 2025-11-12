import { NewPasswordForm } from '@/features/new-password/ui';

const NewPasswordPage = () => {
  return (
    <div className='flex min-h-screen flex-col bg-[#8FA3C7]'>
    <header className='bg-[#F1F5F9] py-4'>
       <div className='flex w-full items-center justify-start px-8'>
         <h1 className='text-lg font-semibold text-[#0F172A]'>
           Панель управления AI FOR BI
         </h1>
       </div>
     </header>


     <main className='flex flex-1 items-center justify-center px-4 py-10 '>
       <div className='w-[329px]'>
         <div className='rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm shadow-slate-900/10 '>
            <NewPasswordForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewPasswordPage;

