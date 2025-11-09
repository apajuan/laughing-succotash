import Image from "next/image";
import { Button } from "@/components/ui/button";
import { columns } from "./columns"

export default async function Home() {
  try {
    return (
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-16 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="font-bold text-xl">Top Up Cards</h1>
        <div>
          <h2>Kill the database</h2>
        </div>
      </main>
    );
  } catch {
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
