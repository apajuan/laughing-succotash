"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Details = {
  id: string
  name: string
  balance: number
}

export const columns: ColumnDef<Details>[] = [
  {
    accessorKey: "id",
    header: "Card ID",
  },
  {
    accessorKey: "name",
    header: "Full Name",
  },
  {
    accessorKey: "balance",
    header: "Balance",
  },
]
