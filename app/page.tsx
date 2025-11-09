import Image from "next/image";
import { Button } from "@/components/ui/button";

import { createClient } from '@supabase/supabase-js'


export default async function Home() {

  try {

    const supabaseUrl = 'https://fekycnmoyqkpjxklsdrv.supabase.co'
    const supabaseKey = process.env.SUPABASE_KEY
    const supabase = createClient(supabaseUrl, supabaseKey)

    //const res = await fetch('http://localhost/IT155P/wemos/getAllUsers.php')
    //const data = await res.json();
    return (
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div>
          <Button className="rounded-full">Click me</Button>
        </div>
        <div>
          <ul>
            {data.map((item: any) => (
              <li key={item.CardID}>{item.SN_Holder_Name} {item.GN_Holder_Name}</li>
            ))}
          </ul>
        </div>
      </main>
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
