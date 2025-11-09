"use client"

import * as React from "react"

import {
  Field,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"


import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { SendTopUp } from "@/app/TopUpCard/send"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [selectedUser, setSelectedUser] = React.useState<TData | null>(null)
  const [open, setOpen] = React.useState(false)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  })

  const handleTopUpClick = (rowData: TData) => {
    const topUpAmountObj = document.getElementById("topUpAmount") as HTMLInputElement
    if (topUpAmountObj !== null) {
      const data = rowData as unknown as { CardID: string, Money: string }
      toast(data.CardID + " " + (parseFloat(topUpAmountObj.value) + parseFloat(data.Money)));
      const total = parseFloat(topUpAmountObj.value) + parseFloat(data.Money)
      SendTopUp(data.CardID, total.toString())
      window.location.reload();
    }


  };
  const handleRowClick = (rowData: TData) => {
    const data = rowData as unknown as { CardID: string }
    toast(data.CardID);
    setSelectedUser(rowData)
    setOpen(true);
  };

  return (
    <div>
      <Toaster></Toaster>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("FullName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("FullName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Top Up User</DialogTitle>
            <DialogDescription>
              Top up user's card.
              Please make sure to verify the proper amount before topping up.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (selectedUser) handleTopUpClick(selectedUser)
            }}
          >
            {selectedUser && (
              <div className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="cardID-1">Card ID</FieldLabel>
                  <Input
                    id="cardID-1"
                    name="cardID"
                    defaultValue={selectedUser.CardID}
                    readOnly
                    disabled
                    required
                  />
                  <FieldDescription>This is the user’s assigned card ID.</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="name-1">Name</FieldLabel>
                  <Input
                    id="name-1"
                    name="name"
                    defaultValue={selectedUser.FullName}
                    readOnly
                    disabled
                    required
                  />
                  <FieldDescription>Full name of the cardholder.</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="amount-1">Top Up Amount</FieldLabel>
                  <Input
                    type="number"
                    id="topUpAmount"
                    name="amount"
                    required
                  />
                  <FieldDescription>Enter the amount to top up.</FieldDescription>
                </Field>
              </div>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                Top Up
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
