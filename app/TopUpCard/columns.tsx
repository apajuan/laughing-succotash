"use client"

import { ColumnDef } from "@tanstack/react-table"

export type CardData = {
  CardID: string
  Money: number
  GN_Holder_Name: string
  MI_Holder_Name: string
  SN_Holder_Name: string
  FullName: string
}

export const columns: ColumnDef<CardData>[] = [
  {
    accessorKey: "CardID",
    header: "Card ID",
  },
  {
    accessorKey: "Money",
    header: "Balance (₱)",
  },
  {
    accessorKey: "FullName",
    header: "Full Name"
  }

]
