"use client"

import { ArrowUpDown } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "./button"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://fekycnmoyqkpjxklsdrv.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);


export type Details = {
  id: string
  name: string
  balance: number
  createdAt: string
}

export type LogDetails = {
  id: string
  logid: string
  entry: string
  exit: string
  total: number
  status: string
}
export const columns: ColumnDef<Details>[] = [
  {
    accessorKey: "id",
    header: "Card ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Full Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "balance",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Balance
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original
      const [open, setOpen] = useState(false)
      const [openDeets, setOpenDeets] = useState(false)

      const [formData, setFormData] = useState<{
        id: string
        name: string
        balance: number
        topupAmount?: number
      }>({
        id: rowData.id,
        name: rowData.name,
        balance: rowData.balance,
      })


      return (
        <div className="flex justify-end px-6">
          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-2 w-2" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(rowData.id)}
              >
                Copy Customer ID
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Open Dialog */}
              <DropdownMenuItem onClick={() => setOpen(true)}>
                Top Up Customer
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setOpenDeets(true)}
              >View customer details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={openDeets} onOpenChange={setOpenDeets}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Customer Details</AlertDialogTitle>
                <AlertDialogDescription>
                  View customer details and information
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-3 py-4">
                <div>
                  <label className="text-sm font-medium">Card ID</label>
                  <Input value={formData.id} disabled />
                </div>
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input value={formData.name} disabled />
                </div>
                <div>
                  <label className="text-sm font-medium">Current Balance</label>
                  <Input value={formData.balance} disabled />
                </div>
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setOpen(false)}>
                  Close
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>


          {/* Top Up Dialog */}
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Top Up Customer</AlertDialogTitle>
                <AlertDialogDescription>
                  Add balance to this customer's account.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-3 py-4">
                <div>
                  <label className="text-sm font-medium">Card ID</label>
                  <Input value={formData.id} disabled />
                </div>
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input value={formData.name} disabled />
                </div>
                <div>
                  <label className="text-sm font-medium">Current Balance</label>
                  <Input value={formData.balance} disabled />
                </div>
                <div>
                  <label className="text-sm font-medium">Top-up Amount</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        topupAmount: parseFloat(e.target.value),
                      })
                    }
                    onKeyDown={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </div>
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    console.log("Top up confirmed for", formData.id)
                    const total = formData.balance + formData.topupAmount!
                    const pushData = async () => {
                      const { data, error } = await supabase
                        .from('Holder')
                        .update({ Money: total })
                        .eq('CardID', formData.id)
                        .select()
                      console.log(data)
                      console.log(error)
                    }
                    pushData();
                    setOpen(false)
                  }}
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    },
  },
]

export const columns_log: ColumnDef<LogDetails>[] = [
  {
    accessorKey: "id",
    header: "Card ID",
  },
  {
    accessorKey: "logid",
    header: "Log ID",
  },
  {
    accessorKey: "entry",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date of Entry
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "exit",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date of Exit
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original
      return (
        <div className="flex justify-end px-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-2 w-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(rowData.id)}
              >
                Copy Cusomter ID
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      )
    },
  },
]
