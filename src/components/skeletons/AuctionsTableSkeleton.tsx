"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const AuctionsTableSkeleton = () => {
  const rows = Array.from({ length: 10 });
  const cols = [172, 119, 173, 173, 173, 156, 200];

  return (
    <div className="rounded-md px-4">
      <Table className="text-sm !rounded-lg border border-[#E2E8F0]">
        <TableHeader className="bg-[#F8FAFC] text-slate-500 border-b border-[#E2E8F0]">
          <TableRow className="border-none">
            {cols.map((w, i) => (
              <TableHead
                key={i}
                className={cn(
                  "p-3 font-sans text-sm font-medium leading-5 tracking-normal text-[#64748B]"
                )}
                style={{ width: w }}
              >
                <Skeleton className="h-6 w-1/2" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody className="border-b border-[#E2E8F0] !rounded-lg">
          {rows.map((_, r) => (
            <TableRow key={r} className="border-b border-slate-100">
              {cols.map((w, c) => (
                <TableCell key={c} className="p-3" style={{ width: w }}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-[76px] rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-[76px] rounded-md" />
        </div>
      </div>
    </div>
  );
}
