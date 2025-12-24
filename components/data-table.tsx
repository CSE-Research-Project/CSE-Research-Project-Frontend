import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface Column {
  key: string
  label: string
  format?: (value: any) => React.ReactNode
  align?: "left" | "center" | "right"
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  loading?: boolean
  emptyMessage?: string
}

export function DataTable({ columns, data, loading, emptyMessage = "No data available" }: DataTableProps) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="border-b border-border">
            {columns.map((col) => (
              <TableHead key={col.key} className={`text-${col.align || "left"}`}>
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="border-b border-border">
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, i) => (
              <TableRow key={i} className="border-b border-border hover:bg-muted/30">
                {columns.map((col) => (
                  <TableCell key={col.key} className={`text-${col.align || "left"}`}>
                    {col.format ? col.format(row[col.key]) : row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
