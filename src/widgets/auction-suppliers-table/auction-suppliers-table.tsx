'use client';

import { useState } from 'react';
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
  ArrowDownToLine,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

import { useSuppliers, type Supplier } from '@/hooks/useSuppliers';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

type SupplierStatus =
  | 'invited'
  | 'uploaded'
  | 'declined'
  | 'confirmed'
  | 'no-response';

const columnHelper = createColumnHelper<Supplier>();

const STATUS_OPTIONS: {
  value: SupplierStatus;
  label: string;
  color: string;
}[] = [
  {
    value: 'invited',
    label: 'Приглашён',
    color: 'bg-[#EEF2F6] text-slate-700',
  },
  {
    value: 'uploaded',
    label: 'Загрузил КП',
    color: 'bg-[#E0E9FB] text-slate-700',
  },
  {
    value: 'declined',
    label: 'Отклонил участие',
    color: 'bg-[#FEE2E2] text-slate-700',
  },
  {
    value: 'confirmed',
    label: 'Подтвердил участие',
    color: 'bg-[#E6F7E6] text-slate-700',
  },
  {
    value: 'no-response',
    label: 'Не ответил',
    color: 'bg-[#FEF3C7] text-slate-700',
  },
];

const columns = [
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
  columnHelper.accessor('name', {
    header: () => <span className='text-sm font-medium'>Поставщик</span>,
    size: 172,
    cell: ({ getValue }) => (
      <span className='font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]'>{getValue()}</span>
    ),
  }),
  columnHelper.accessor('status', {
    header: () => (
      <div className='flex items-center gap-1'>
        <span className='text-sm font-medium'>Статус</span>
      </div>
    ),
    enableSorting: false,
    cell: ({ row }) => {
      const currentStatus = STATUS_OPTIONS.find(
        (status) => status.value === row.original.status
      );

      return (
        <div className='flex items-center gap-2'>
          <span
            className={cn(
              'text-sm text-slate-900',
              row.original.status === 'uploaded' ? 'font-medium' : 'font-normal'
            )}
          >
            {currentStatus?.label ?? row.original.status}
          </span>
          {row.original.status === 'uploaded' && row.original.hasWarning && (
            <AlertTriangle className='size-4 text-red-500' />
          )}
        </div>
      );
    },
  }),
  columnHelper.accessor('cpAvailable', {
    header: () => (
      <div className='flex items-center gap-1'>
        <span className='text-sm font-medium'>КП</span>
        <div className='flex flex-col'>
          <ChevronUp className='size-3 opacity-50' />
          <ChevronDown className='size-3 opacity-50 -mt-1' />
        </div>
      </div>
    ),
    enableSorting: true,
    cell: ({ row }) =>
      row.original.cpAvailable ? (
        <Button
          variant='link'
          className='flex items-center gap-1 !px-0 font-sans text-sm font-semibold leading-5 tracking-normal text-[#020617] hover:text-slate-700'
        >
          Скачать
          <ArrowDownToLine className='size-4' />
        </Button>
      ) : (
        <Button disabled variant="link" className='flex items-center gap-1 !px-0  text-sm text-[#64748B] italic'>Недоступна</Button>
      ),
  }),
  columnHelper.accessor('cpAmount', {
    header: () => <span className='text-sm font-medium'>Сумма КП</span>,
    enableSorting: false,
    cell: ({ getValue }) => {
      const value = getValue();
      if (!value) {return <span className='font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]'></span>;}
      return (
        <span className='font-sans text-sm font-normal leading-5 tracking-normal text-[#020617] '>
          {value.toLocaleString('ru-RU', { useGrouping: true }).replace(/,/g, ' ')}
        </span>
      );
    },
  }),
  columnHelper.accessor('currency', {
    header: () => <span className='font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]'>Валюта</span>,
    enableSorting: false,
    cell: ({ getValue }) => {
      const value = getValue();
      return <span className='font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]'>{value ?? ' '}</span>;
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: () => (
      <span className='text-sm font-medium'>Действия участник...</span>
    ),
    enableSorting: false,
    cell: ({ row }) => {
      const action = row.original.participantAction;
      if (!action) {return <span className='font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]'></span>;}
      return <span className='font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]'>{action}</span>;
    },
  }),
  columnHelper.accessor('uploadTime', {
    header: () => <span className='text-sm font-medium'>Время загрузки</span>,
    enableSorting: true,
    cell: ({ getValue }) => {
      const value = getValue();
      return <span className='font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]'>{value ?? ''}</span>;
    },
  }),
  columnHelper.display({
    id: 'comment',
    header: () => <span className='text-sm font-medium'>Комментар...</span>,
    enableSorting: false,
    cell: ({ getValue }) => {
      const value = getValue()
      return <div className='font-sans text-sm font-normal leading-5 tracking-normal text-[#020617] text-wrap'>{value as string ?? ""}</div>;
    },
  }),
  columnHelper.display({
    id: 'rowActions',
    header: () => <span className='text-sm font-medium'></span>,
    enableSorting: false,
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='h-auto p-0 font-sans text-sm font-normal leading-5 tracking-normal text-[#020617] hover:bg-transparent'
            >
              ...
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='w-[200px] rounded-md border border-[#E2E8F0] bg-white p-2 shadow-md'
          >
            <DropdownMenuItem className='rounded-md px-4 py-2 font-sans text-sm font-normal leading-5 tracking-normal text-[#020617] hover:bg-[#eef3fb]'>
              Зафиксировать цену
            </DropdownMenuItem>
            <DropdownMenuItem className='rounded-md px-4 py-2 font-sans text-sm font-normal leading-5 tracking-normal text-[#020617] hover:bg-[#eef3fb]'>
              Отклонить участие
            </DropdownMenuItem>
            <DropdownMenuItem className='rounded-md px-4 py-2 font-sans text-sm font-normal leading-5 tracking-normal text-[#020617] hover:bg-[#eef3fb]'>
              Отправить уведомление
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];

interface AuctionSuppliersTableProps {
  auctionChatId: string;
  event: string;
}

export function AuctionSuppliersTable({ auctionChatId, event }: AuctionSuppliersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const total = 0;
  const { data } = useSuppliers({
    auctionChatId,
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    eventType: event
  });

  const table = useReactTable({
    data,
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

