import { columns, Details } from "./columns"
import { DataTable } from "./data-table"
import { createClient } from "@supabase/supabase-js"

async function getData(): Promise<Details[]> {
  // Fetch data from your API here.
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
  // ...
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
