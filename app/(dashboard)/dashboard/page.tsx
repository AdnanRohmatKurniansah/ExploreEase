import { ChartArea } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import Stats from './stats';

export default async function Page(
  props: {
    searchParams: Promise<{ q: string; offset: string }>;
  }
) {
  return (
    <>
      <div className="flex items-center">
        <div className="flex items-center gap-2 mt-4">
          <Button size="sm" className="gap-1">
            <ChartArea className="h-3.5 w-3.5" />
            <span className="sm:whitespace-nowrap">
              Dashboard Statistics
            </span>
          </Button>
        </div>
      </div>
      <Stats />
    </>
  );
}