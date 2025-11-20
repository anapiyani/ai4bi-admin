'use client';

import { useMemo, useState, useEffect } from 'react';
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
  CheckCircle,
  Clock,
  Radio,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

import { useAuctions, type Auction } from '@/hooks/useAuctions';
import { AuctionFiltersState } from '@/widgets/auction-toolbar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useColumns } from '@/widgets/columns-dropdown/columns-context';

import { AuctionsTableSkeleton } from '../../components/skeletons/AuctionsTableSkeleton'


type AuctionStatus = 'AuctionPlanning' | 'AuctionActive' | 'AuctionFinished' | 'AuctionEnd' | 'TechCouncilPlanning' | 'TechCouncilActive' | 'TechCouncilEnd' | 'TechCouncilFinished';
type AuctionEventType = 'tender' | 'tech' | 'tech_council';

const columnHelper = createColumnHelper<Auction>();

const EVENT_TYPE_OPTIONS: { value: AuctionEventType; label: string }[] = [
  { value: 'tender', label: 'Тендер' },
  { value: 'tech_council', label: 'Тех. совет' },
];

const STATUS_OPTIONS: {
  value: AuctionStatus;
  label: string;
  color: string;
  icon?: 'play' | 'pause';
}[] = [
  {
    value: 'AuctionPlanning',
    label: 'Тендер ожидает начала',
    color: 'bg-[#E6F0FF] text-[#1D4ED8]',
    icon: 'pause',
  },
  {
    value: 'AuctionActive',
    label: 'Тендер в процессе',
    color: 'bg-[#E8EDFF] text-[#4338CA]',
    icon: 'play',
  },
  {
    value: 'AuctionFinished',
    label: 'Тендер завершен',
    color: 'bg-[#E6F9EB] text-[#047857]',
  },
  {
    value: 'AuctionEnd',
    label: 'Тендер отменен',
    color: 'bg-[#FEEAEA] text-[#DC2626]',
  },
  {
    value: 'TechCouncilPlanning',
    label: 'Тех совет ожидает начала',
    color: 'bg-[#E6F0FF] text-[#1D4ED8]',
    icon: 'pause',
  },
  {
    value: 'TechCouncilActive',
    label: 'Тех совет в процессе',
    color: 'bg-[#E8EDFF] text-[#4338CA]',
    icon: 'play',
  },
  {
    value: 'TechCouncilEnd',
    label: 'Тех совет отменен',
    color: 'bg-[#FEEAEA] text-[#DC2626]',
  },
  {
    value: 'TechCouncilFinished',
    label: 'Тех совет завершен',
    color: 'bg-[#E6F9EB] text-[#047857]',
  },
];

const REGIONS = [
  'Астана',
  'Алматы',
  'Шымкент',
  'Караганда',
  'Тараз',
  'Өскемен',
  'Павлодар',
  'Ақтөбе',
  'Семей',
  'Көкшетау',
];

const formatDateTime = (date: string) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year}, ${hours}:${minutes}`;
};

type AuctionsTableProps = {
  filters?: AuctionFiltersState;
  searchKey?: number;
};

export function AuctionsTable({ filters, searchKey }: AuctionsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const { columnVisibility } = useColumns();

  useEffect(() => {
    if (searchKey !== undefined && searchKey > 0) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [searchKey]);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const startDate = filters?.dateRange?.from ? formatDate(filters.dateRange.from) : undefined;
  const endDate = filters?.dateRange?.to ? formatDate(filters.dateRange.to) : undefined;

  const { data, total, refetch, isLoading } = useAuctions({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    search: filters?.search,
    region: filters?.region,
    status: filters?.status as 'AuctionPlanning' | 'AuctionActive' | 'AuctionFinished' | 'AuctionEnd' | 'TechCouncilPlanning' | 'TechCouncilActive' | 'TechCouncilEnd' | 'TechCouncilFinished' | undefined,
    startDate,
    endDate,
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        id: 'name',
        header: () => <span>Наименование</span>,
        enableSorting: false,
        size: 172,
        cell: ({ row }) => (
          <Link
            href={`/auctions/${row.original.auction_chat_id}`}
            className='block w-full truncate text-left font-sans text-sm font-normal leading-5 tracking-normal underline cursor-pointer text-[#2563EB] transition hover:text-blue-700'
          >
            {row.original.name}
          </Link>
        ),
      }),
      columnHelper.accessor('portal_id', {
        id: 'tenderId',
        header: () => <span>ID тендера</span>,
        enableSorting: false,
        size: 119,
        cell: ({ getValue }) => (
          <button className='w-full text-left font-sans text-sm font-normal leading-5 tracking-normal underline cursor-pointer text-[#2563EB] transition hover:text-blue-700'>
            {getValue()}
          </button>
        ),
      }),
      columnHelper.accessor('date', {
        id: 'datetime',
        header: () => <span>Дата и время</span>,
        size: 173,
        cell: ({ getValue }) => (
          <span className='font-sans text-sm font-normal leading-5 tracking-normal text-slate-700'>
            {formatDateTime(getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('event_type', {
        id: 'eventType',
        header: () => <span>Тип мероприятия</span>,
        enableSorting: false,
        size: 173,
        cell: ({ row }) => (
          <Select
            value={row.original.event_type}
            onValueChange={(value: AuctionEventType) => {
              // TODO: Update event_type via API
              console.log('Update event_type for', row.original.auction_chat_id, 'to', value);
            }}
          >
            <SelectTrigger
              className={cn(
                'flex h-7 w-[156px] items-center justify-between gap-[10px] rounded border border-[#E2E8F0] py-1 px-2 text-sm font-medium text-slate-700',
                row.original.event_type === 'tender'
                  ? 'bg-[#F0FDF4]'
                  : 'bg-[#E0F2FE]'
              )}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='rounded-md border border-[#E2E8F0] bg-white shadow-md'>
              {EVENT_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ),
      }),
      columnHelper.accessor('chat_status', {
        id: 'status',
        header: () => <span>Статус</span>,
        enableSorting: false,
        size: 173,
        cell: ({ row }) => {
          const getStatusConfig = (status: AuctionStatus) => {
            switch (status) {
              case 'AuctionPlanning': case "TechCouncilPlanning":
                return {
                  bgColor: 'bg-[#FFFFFF]',
                  textColor: "text-[#020617]",
                  icon: Clock,
                };
              case 'AuctionActive': case "TechCouncilActive":
                return {
                  bgColor: 'bg-[#EFF6FF]',
                  textColor: "text-[#1D4ED8]",
                  icon: Radio,
                };
              case "AuctionFinished":
              case "TechCouncilFinished":
                return {
                  bgColor: "bg-[#F0FDF4]",
                  textColor: "text-[#15803D]",
                  icon: CheckCircle,
                };
              case 'AuctionEnd':
              case "TechCouncilEnd":
                return {
                  bgColor: "bg-[#FEF2F2]",
                  textColor: "text-[#DC2626]",
                  icon: XCircle,
                };
              default:
                return {
                  bgColor: 'bg-[#FFFFFF]',
                  icon: null,
                };
            }
          };

          const statusConfig = row.original.chat_status 
            ? getStatusConfig(row.original.chat_status as AuctionStatus)
            : { bgColor: 'bg-[#FFFFFF]', textColor: 'text-slate-700', icon: null };
          const StatusIcon = statusConfig.icon;
          const textColor = statusConfig.textColor;
          return (  
            <Select
              value={row.original.chat_status || undefined}
              onValueChange={(value: AuctionStatus) => {
                // TODO: Update chat_status via API
                console.log('Update chat_status for', row.original.auction_chat_id, 'to', value);
              }}
            >
              <SelectTrigger
                className={cn(
                  'flex h-7 min-w-[172px] items-center justify-between gap-[10px] rounded border border-[#E2E8F0] py-1 px-2 text-sm font-medium text-slate-700',
                  statusConfig.bgColor
                )}
              >
                <div className={`flex items-center gap-2 ${textColor}`}>
                  {StatusIcon && <StatusIcon size={16} className={textColor} />}
                  <SelectValue className={textColor} placeholder='Неизвестно' />
                </div>
              </SelectTrigger>
              <SelectContent className='rounded-md border border-[#E2E8F0] bg-white shadow-md'>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        },
      }),
      columnHelper.accessor('region', {
        id: 'region',
        header: () => <span>Регион</span>,
        enableSorting: false,
        cell: ({ row }) => (
          <Select
            value={row.original.region || undefined}
            onValueChange={(value: string) => {
              // TODO: Update region via API
              console.log('Update region for', row.original.auction_chat_id, 'to', value);
            }}
          >
            <SelectTrigger className='flex h-7 w-[156px] items-center justify-between gap-[10px] rounded border border-[#E2E8F0] bg-white py-1 px-2 text-sm font-medium text-slate-700'>
              <SelectValue placeholder='Неизвестно'>
                {row.original.region || 'Неизвестно'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className='rounded-md border border-[#E2E8F0] bg-white shadow-md'>
              {REGIONS.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ),
      }),
      columnHelper.accessor('organizer', {
        id: 'organizer',
        header: () => <span>Организатор</span>,
        enableSorting: false,
        cell: ({ getValue }) => (
          <span className='font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]'>
            {getValue()}
          </span>
        ),
      }),
    ],
    [refetch]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / pagination.pageSize),
  });

  const totalRows = total;
  const pageStart = pagination.pageIndex * pagination.pageSize + 1;
  const pageEnd = Math.min(
    pagination.pageIndex * pagination.pageSize + pagination.pageSize,
    totalRows
  );

  if (isLoading) {
    return <AuctionsTableSkeleton />;
  }

  return (
    <div className='rounded-md px-4'>
      <Table className='text-sm !rounded-lg border border-[#E2E8F0] '>
        <TableHeader className='bg-[#F8FAFC] text-slate-500 border-b border-[#E2E8F0]'>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className='border-none'>
              {headerGroup.headers.map((header, index) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    'p-3 font-sans text-sm font-medium leading-5 tracking-normal text-[#64748B]',
                    index === 0 && 'w-[172px] max-w-[172px]'
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className='border-b border-[#E2E8F0] !rounded-lg'>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className='border-b border-slate-100'>
              {row.getVisibleCells().map((cell, index) => (
                <TableCell
                  key={cell.id}
                  className={cn(
                    'p-3',
                    index === 0 && 'w-[172px] max-w-[172px]'
                  )}
                >
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

