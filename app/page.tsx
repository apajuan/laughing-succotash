"use client";

import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { DataTable } from "@/components/ui/data-table";
import { columns, columns_log, Details, LogDetails } from "@/components/ui/columns";

const supabaseUrl = 'https://fekycnmoyqkpjxklsdrv.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [cardData, setCardData] = useState<Details[]>([]);
  const [logData, setLogData] = useState<LogDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    // Fetch Holder data
    const { data: holders } = await supabase
      .from('Holder')
      .select('CardID, FullName, Money, datetimeissued');

    setCardData(
      (holders ?? []).map(item => ({
        id: item.CardID,
        name: item.FullName,
        balance: item.Money,
        createdAt: item.datetimeissued,
      }))
    );

    // Fetch ParkingLog data
    const { data: logs } = await supabase
      .from('ParkingLog')
      .select('LogID, CardID, DateOfEntry, DateOfExit, TotalPrice, Status');

    setLogData(
      (logs ?? []).map(item => ({
        id: item.CardID,
        logid: item.LogID,
        entry: item.DateOfEntry,
        exit: item.DateOfExit,
        total: item.TotalPrice,
        status: item.Status,
      }))
    );

    setLoading(false);
  };

  useEffect(() => {
    // Create a channel for the ParkingLog table
    fetchData()
    const channel = supabase
      .channel('public:ParkingLog') // channel name (can be any string)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ParkingLog' },
        () => fetchData() // refetch on any insert/update/delete
      )
      .subscribe();

    const holderChannel = supabase
      .channel('public:Holder')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Holder' }, () => {
        console.log('Holder updated');
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(holderChannel);
    };
  }, []);
  if (loading) return (
    <div className="container mx-auto py-10 text-3xl font-bold accent-amber-700">
      <p>Loading...</p>
    </div>

  );

  return (
    <div className="container mx-auto py-10">
      <div className="px-32">
        <h1 className="text-3xl font-bold">Log Data</h1>
        <DataTable columns={columns_log} data={logData} />
      </div>

      <div className="px-32">
        <h1 className="text-3xl font-bold">Card IDs</h1>
        <DataTable columns={columns} data={cardData} />
      </div>
    </div>
  );
}

