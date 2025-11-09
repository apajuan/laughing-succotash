import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createClient } from '@supabase/supabase-js'
import { columns, Details, columns_log, LogDetails } from '@/components/ui/columns'
import { DataTable } from "@/components/ui/data-table"

async function getLogData(): Promise<LogDetails[]> {
  try {
    const supabaseUrl = 'https://fekycnmoyqkpjxklsdrv.supabase.co'
    const supabaseKey = process.env.SUPABASE_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)
    if (!supabaseKey) {
      throw new Error("SUPABASE_KEY is not defined in environment variables")
    }


    let { data: Holder, error } = await supabase
      .from('ParkingLog')
      .select('LogID, CardID, DateOfEntry, DateOfExit, TotalPrice, Status')

    const safe = Holder ?? []
    const formattedData = safe.map((item) => ({
      id: item.CardID,
      logid: item.LogID,
      entry: item.DateOfEntry,
      exit: item.DateOfExit,
      total: item.TotalPrice,
      status: item.Status,

    }))
    return formattedData
  } catch {
    return []
  }
}

async function getData(): Promise<Details[]> {
  try {
    const supabaseUrl = 'https://fekycnmoyqkpjxklsdrv.supabase.co'
    const supabaseKey = process.env.SUPABASE_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)
    if (!supabaseKey) {
      throw new Error("SUPABASE_KEY is not defined in environment variables")
    }


    let { data: Holder, error } = await supabase
      .from('Holder')
      .select('CardID, FullName, Money')

    const safe = Holder ?? []
    const formattedData = safe.map((item) => ({
      id: item.CardID,
      name: item.FullName,
      balance: item.Money,
    }))
    return formattedData
  } catch {
    return []
  }
}

export default async function Home() {

  try {
    const carddata = await getData();
    const logdata = await getLogData();
    return (
      <div className="container mx-auto py-10">

        <div className="px-32">
          <h1 className="text-3xl font-bold">Log Data</h1>
          <DataTable columns={columns_log} data={logdata} />
        </div>
        <div className="px-32">
          <h1 className="text-3xl font-bold">Card IDs</h1>
          <DataTable columns={columns} data={carddata} />
        </div>

      </div>

    );
  }
  catch {
    return (
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-amber-700">
            Error. Database is down. Please try again later.
          </h1>
        </div>
      </main>
    );
  }

}
