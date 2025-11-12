import { Header } from '@/components/layout/Header';
import { AnalyticsDashboard } from '@/widgets/analytics-dashboard';

const Analytics = () => {
  return (
    <div className='flex min-h-screen flex-col bg-white'>
      <Header />
      <main className='flex w-full flex-1 px-8 py-8'>
        <div className='flex w-full flex-col'>
          <AnalyticsDashboard />
        </div>
      </main>
    </div>
  );
};

export default Analytics;