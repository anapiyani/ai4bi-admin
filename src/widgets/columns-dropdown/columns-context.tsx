'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export const DEFAULT_COLUMNS: Array<{ id: string; label: string }> = [
  { id: 'name', label: 'Наименование' },
  { id: 'tenderId', label: 'ID тендера' },
  { id: 'datetime', label: 'Дата и время' },
  { id: 'eventType', label: 'Тип мероприятия' },
  { id: 'status', label: 'Статус' },
  { id: 'region', label: 'Регион' },
  { id: 'organizer', label: 'Организатор' },
  { id: 'kpi', label: 'Статус КП' },
];

type ColumnsContextType = {
  selectedColumns: string[];
  toggleColumn: (id: string) => void;
  columnVisibility: Record<string, boolean>;
};

const ColumnsContext = createContext<ColumnsContextType | undefined>(undefined);

export function ColumnsProvider({ children }: { children: ReactNode }) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    DEFAULT_COLUMNS.map((column) => column.id)
  );

  const toggleColumn = useCallback((id: string) => {
    setSelectedColumns((prev) =>
      prev.includes(id) ? prev.filter((column) => column !== id) : [...prev, id]
    );
  }, []);

  const columnVisibility = DEFAULT_COLUMNS.reduce(
    (acc, column) => {
      acc[column.id] = selectedColumns.includes(column.id);
      return acc;
    },
    {} as Record<string, boolean>
  );

  return (
    <ColumnsContext.Provider value={{ selectedColumns, toggleColumn, columnVisibility }}>
      {children}
    </ColumnsContext.Provider>
  );
}

export function useColumns() {
  const context = useContext(ColumnsContext);
  if (context === undefined) {
    throw new Error('useColumns must be used within a ColumnsProvider');
  }
  return context;
}

