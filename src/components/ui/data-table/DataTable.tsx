"use client";

import { Table, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingList from "@/components/loading/LoadingList";
import { useState, useEffect } from "react";

export type Column<T> = {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string | ((item: T) => string);
};

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  filters?: {
    name: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
  }[];
  onSearch?: () => void;
  onReset?: () => void;
  isLoading?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  actions?: (item: T) => React.ReactNode;
  mobileRender?: (item: T) => React.ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  filters,
  onSearch,
  onReset,
  isLoading,
  pagination,
  actions,
  mobileRender,
}: DataTableProps<T>) {
  const [isMobile, setIsMobile] = useState(false);

  const getCellContent = (
    item: T,
    accessor: keyof T | ((item: T) => React.ReactNode)
  ) => {
    if (typeof accessor === "function") {
      return accessor(item);
    }
    const value = item[accessor];
    return value !== undefined ? String(value) : "N/A";
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    console.log("DataTable recebeu dados:", {
      data,
      isLoading,
      dataLength: data?.length,
    });
  }, [data, isLoading]);

  if (isLoading) {
    return <LoadingList />;
  }

  if (!data) {
    return <div className="text-center">Nenhum dado disponível</div>;
  }

  return (
    <div className="flex flex-col">
      {/* Filtros com botões de pesquisa e limpar */}
      {filters && (
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <div className="flex flex-col md:flex-row gap-4 w-full">
            {filters.map((filter, index) => (
              <Input
                key={index}
                placeholder={filter.placeholder}
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && onSearch) {
                    onSearch();
                  }
                }}
              />
            ))}
          </div>
          <div className="flex gap-4">
            <Button onClick={onSearch} className="flex-1" variant="default">
              Pesquisar
            </Button>
            <Button onClick={onReset} className="flex-1" variant="outline">
              Limpar Filtros
            </Button>
          </div>
        </div>
      )}

      {/* Versão Desktop */}
      {!isMobile && (
        <div className="hidden md:block">
          <Table>
            <thead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    className={
                      typeof column.className === "string"
                        ? column.className
                        : undefined
                    }
                  >
                    {column.header}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell className="text-center">Ações</TableCell>
                )}
              </TableRow>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns.map((column, colIndex) => (
                      <TableCell
                        key={colIndex}
                        className={
                          typeof column.className === "function"
                            ? column.className(item)
                            : column.className
                        }
                      >
                        {getCellContent(item, column.accessor)}
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell className="text-center">
                        {actions(item)}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="text-center"
                  >
                    Nenhum registro encontrado.
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </div>
      )}

      {/* Versão Mobile */}
      {isMobile && (
        <div className="md:hidden flex flex-col gap-2">
          {data.length > 0 ? (
            data.map((item, index) =>
              mobileRender ? (
                mobileRender(item)
              ) : (
                <div key={index} className="border p-4 rounded-lg">
                  {columns.map((column, colIndex) => (
                    <div key={colIndex} className="mb-2">
                      <span className="font-semibold">{column.header}: </span>
                      <span>{getCellContent(item, column.accessor)}</span>
                    </div>
                  ))}
                  {actions && (
                    <div className="mt-2 border">{actions(item)}</div>
                  )}
                </div>
              )
            )
          ) : (
            <p className="text-center">Nenhum registro encontrado.</p>
          )}
        </div>
      )}

      {/* Paginação */}
      {pagination && (
        <div className="flex justify-between mt-4">
          <Button
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            Anterior
          </Button>
          <span>
            Página {pagination.currentPage} de {pagination.totalPages}
          </span>
          <Button
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
