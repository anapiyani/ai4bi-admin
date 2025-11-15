'use client';

import { useState, useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import {
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

import { useSuppliers, CommercialOffer } from "@/hooks/useSuppliers";
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

const columnHelper = createColumnHelper<CommercialOffer>();

const getColumns = (auctionType?: string) => [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <div className='flex items-center'>
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-center'>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      </div>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('commercial_offer_name', {
    header: () => <span className='text-sm font-medium'>Поставщик</span>,
    size: 172,
    cell: ({ getValue }) => (
      <span className='font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]'>{getValue()}</span>
    ),
  }),
  columnHelper.accessor('amount_materials', {
    header: () => (
      <div className='flex items-center gap-1'>
        <span className='text-sm font-medium'>Материалы</span>
      </div>
    ),
    enableSorting: false,
    cell: ({ getValue }) => (
      <span className='font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]'>{getValue()}</span>
    ),
  }),
  ...(auctionType?.toLowerCase() === 'default' ? [
    columnHelper.accessor('amount_work', {
      header: () => (
        <div className='flex items-center gap-1'>
          <span className='text-sm font-medium'>Работы</span>
        </div>
      ),
      enableSorting: false,
      cell: ({ getValue }) => (
        <span className='font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]'>{getValue()}</span>
      ),
    }),
  ] : []),
  columnHelper.accessor('total_price', {
    header: () => (
      <div className='flex items-center gap-1'>
        <span className='text-sm font-medium'>Итого</span>
      </div>
    ),
    enableSorting: true,
    cell: ({ getValue }) => (
      <span className='font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]'>{getValue()}</span>
    ),
  }),
  columnHelper.accessor('advance', {
    header: () => <span className='text-sm font-medium'>Аванс</span>,
    enableSorting: false,
    cell: ({ getValue }) => (
      <span className='font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]'>{getValue()}</span>
    ),
  }),
  columnHelper.accessor('guarantee', {
    header: () => <span className='font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]'>Тип аванса</span>,
    enableSorting: false,
    cell: ({ getValue }) => {
      const value = getValue();
      return <span className='font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]'>{value ?? ' '}</span>;
    },
  }),
  columnHelper.accessor('bespoke_deadline', {
    header: () => <span className='font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]'>Срок работы</span>,
    enableSorting: false,
    cell: ({ getValue }) => {
      const value = getValue();
      return <span className='font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]'>{value ? `${value} кд`:' '}</span>;
    },
  }),
  columnHelper.accessor('price_after', {
    header: () => <span className='font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]'>Сумма после</span>,
    enableSorting: false,
    cell: ({ getValue }) => {
      const value = getValue();
      return <span className='font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]'>{value ? `${value}`:' '}</span>;
    },
  }),
  columnHelper.display({
    id: 'comments',
    header: () => <span className='text-sm font-medium'>Примечания</span>,
    enableSorting: false,
    cell: ({ getValue }) => {
      const value = getValue()
      return <div className='font-sans text-sm font-normal leading-5 tracking-normal text-[#020617] text-wrap'>{value as string ?? ""}</div>;
    },
  }),
];

interface AuctionSuppliersTableProps {
  auctionChatId: string;
  event: string;
  lot: number;
}

export function AuctionSuppliersTable({ auctionChatId, event, lot }: AuctionSuppliersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data: supplier} = useSuppliers({
    auctionChatId,
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    eventType: event
  });
  const lots = supplier ? supplier?.protocol.lots[lot].commercial_offers : [];
  const total = supplier ? supplier?.protocol.lots[lot].commercial_offers.length : 0;
  const auctionType = supplier?.protocol.lots[lot]?.auction_type;
  console.log(auctionType)
  const columns = useMemo(() => getColumns(auctionType), [auctionType]);

  const table = useReactTable({
    data: lots ? lots :  [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
    manualPagination: true,
    pageCount: Math.ceil(total / pagination.pageSize),
  });

  const totalRows = total;
  const pageStart = pagination.pageIndex * pagination.pageSize + 1;
  const pageEnd = Math.min(
    pagination.pageIndex * pagination.pageSize + pagination.pageSize,
    totalRows
  );

  return (
    <div className='rounded-md px-4'>
      <Table className='text-sm'>
        <TableHeader className='bg-[#F8FAFC] text-slate-500 border-b border-[#E2E8F0]'>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className='border-none'>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className='p-3 font-sans text-sm font-medium leading-5 tracking-normal text-[#64748B]'
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className='flex items-center gap-1'>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header.column.getCanSort() &&
                      (header.column.getIsSorted() === 'asc' ? (
                        <ChevronUp className='size-4' />
                      ) : header.column.getIsSorted() === 'desc' ? (
                        <ChevronDown className='size-4' />
                      ) : (
                        <ChevronDown className='size-4 opacity-30' />
                      ))}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className='border-b border-slate-100'>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className='p-3'>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className='mt-4 flex items-center justify-between'>
        <div className='text-sm font-normal text-[#64748B]'>
          {pageStart}-{pageEnd} из {totalRows}
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            className='h-9 w-[76px] gap-1.5 rounded-md border border-[#E2E8F0] bg-white py-0 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Назад
          </Button>
          <div className='flex items-center gap-1'>
            {(() => {
              const currentPage = pagination.pageIndex + 1;
              const totalPages = table.getPageCount();
              const pages: (number | 'ellipsis')[] = [];

              if (totalPages <= 5) {
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                pages.push(1);
                if (currentPage > 3) {
                  pages.push('ellipsis');
                }
                for (
                  let i = Math.max(2, currentPage - 1);
                  i <= Math.min(totalPages - 1, currentPage + 1);
                  i++
                ) {
                  if (i !== 1 && i !== totalPages) {
                    pages.push(i);
                  }
                }
                if (currentPage < totalPages - 2) {
                  pages.push('ellipsis');
                }
                pages.push(totalPages);
              }

              return pages.map((page, index) => {
                if (page === 'ellipsis') {
                  return (
                    <span key={`ellipsis-${index}`} className='px-2 text-sm text-slate-500'>
                      ...
                    </span>
                  );
                }
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'outline' : 'link'}
                    className={cn(
                      'h-9 min-w-9 rounded-xl px-3 text-sm font-medium',
                      currentPage === page
                        ? 'rounded-md border border-[#E2E8F0] bg-white text-[#020617] hover:bg-slate-50'
                        : 'text-slate-700 hover:bg-slate-50'
                    )}
                    onClick={() => table.setPageIndex(page - 1)}
                  >
                    {page}
                  </Button>
                );
              });
            })()}
          </div>
          <Button
            variant='outline'
            className='h-9 w-[76px] gap-1.5 rounded-md border border-[#E2E8F0] bg-white py-0 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Вперед
          </Button>
        </div>
      </div>
    </div>
  );
}

