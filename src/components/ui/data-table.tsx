"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";
import { Trash } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string | string[] | null;
  onPageChange?: (page: number) => void;
  onSearchChange?: (value: string) => void;
  onBulkDelete?: (rows: TData[]) => void;
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: (selection: any) => void;
  searchValue?: string;
  pageCount?: number;
  placeholderSearch?: string;
  isFetching?: boolean;
  onLimitChange?: (limit: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  onPageChange,
  onSearchChange,
  onBulkDelete,
  rowSelection: externalRowSelection,
  onRowSelectionChange,
  searchValue: externalSearchValue,
  pageCount,
  placeholderSearch,
  isFetching,
  onLimitChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [internalRowSelection, setInternalRowSelection] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [internalSearchValue, setInternalSearchValue] = useState("");

  const rowSelection = externalRowSelection ?? internalRowSelection;
  const onRowSelectionChangeHandler = onRowSelectionChange ?? setInternalRowSelection;


  const searchValue = externalSearchValue ?? internalSearchValue;

  const filteredData = useMemo(() => {
    // If onSearchChange is provided, we assume server-side filtering is intended
    // or handled externally, so we return data as is.
    if (onSearchChange) return data;
    if (!searchValue) return data;

    const lowered = searchValue.toLowerCase();

    return data.filter((item: any) => {
      if (Array.isArray(searchKey)) {
        return searchKey.some((key) => {
          const value = key.split(".").reduce((acc, part) => acc?.[part], item);
          return value?.toString()?.toLowerCase()?.includes(lowered);
        });
      } else if (typeof searchKey === "string") {
        const value = searchKey
          .split(".")
          .reduce((acc, part) => acc?.[part], item);
        return value?.toString()?.toLowerCase()?.includes(lowered);
      }
      return true;
    });
  }, [data, searchKey, searchValue]);

  const table = useReactTable({
    data: filteredData,
    columns,
    pageCount: pageCount ?? -1,
    manualPagination: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: onRowSelectionChangeHandler,
    enableRowSelection: true,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
  });


  useEffect(() => {
    if (pageIndex < (pageCount ?? Infinity)) {
      onPageChange?.(pageIndex + 1);
    }
  }, [pageIndex, onPageChange, pageCount]);

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  return (
    <div>
      {/* 🔍 Search input & Bulk Actions */}
      <div className="flex items-center justify-between py-4 gap-2">
        <div className="flex items-center gap-2">
          {onBulkDelete && selectedRows.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onBulkDelete(selectedRows.map((row) => row.original))}
              className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2"
            >
              <Trash className="h-4 w-4" />
              Hapus Terpilih ({selectedRows.length})
            </Button>
          )}
        </div>
        <Input
          placeholder={placeholderSearch ? placeholderSearch : "Cari..."}
          value={searchValue}
          onChange={(event) => {
            const value = event.target.value;
            if (onSearchChange) {
              onSearchChange(value);
            } else {
              setInternalSearchValue(value);
            }
            setPageIndex(0); // Reset to first page on search
          }}
          className="max-w-sm dark:bg-sidebar"
        />
      </div>

      {/* 🧱 Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Memuat Data...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Oops! Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 🔄 Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center justify-between space-x-6 py-4">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Tampilkan</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                const newSize = Number(value);
                setPageSize(newSize);
                setPageIndex(0);
                onLimitChange?.(newSize);
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 15, 20, 25, 30].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm font-medium">baris data</p>
          </div>

          {/* <span className="text-sm text-muted-foreground">
            {selectedRows.length} baris terpilih
          </span> */}
        </div>

        <div className="flex items-center justify-end space-x-6 py-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
              {pageCount || 1}
            </span>

            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageIndex((old) => Math.max(old - 1, 0))}
                disabled={pageIndex === 0 || isFetching}
                className={cn(
                  pageIndex === 0 || isFetching
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                )}
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageIndex((old) => old + 1)}
                disabled={pageIndex + 1 >= (pageCount || 0) || isFetching}
                className={cn(
                  pageIndex + 1 >= (pageCount || 0) || isFetching
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                )}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex items-center justify-end space-x-2 py-4">
        <span className="text-sm text-muted-foreground">
          Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
          {pageCount || 1}
        </span>

        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((old) => Math.max(old - 1, 0))}
            disabled={pageIndex === 0 || isFetching}
          >
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((old) => old + 1)}
            disabled={pageIndex + 1 >= (pageCount || 0) || isFetching}
          >
            Selanjutnya
          </Button>
        </div>
      </div> */}
    </div>
  );
}
