"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fekycnmoyqkpjxklsdrv.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function Capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
export default function FieldResponsive() {
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successCreateDialogOpen, setCreateSuccessDialogOpen] = useState(false);
  const [isDisabled, setisDisabled] = useState(false);
  const [recentID, setrecentID] = useState("");

  const getRecentID = async (): Promise<string | null> => {
    try {
      let { data, error } = await supabase
        .from('Holder')
        .select('CardID')
        .order('datetimeissued', { ascending: false })
        .limit(1)
        .single()

      if (data) {
        return "Most Recent ID: " + data.CardID
      }

      console.log(data)
      return "No ID Found"



    } catch {
      return "None"
    }
  };


  const handleSubmit = async (
    initialBalance: string,
    firstName: string,
    middleInitial: string,
    lastName: string
  ) => {
    try {

      const { data, error } = await supabase
        .from('Holder')
        .insert([
          {
            Money: Capitalize(initialBalance),
            SN_Holder_Name: Capitalize(lastName),
            GN_Holder_Name: Capitalize(firstName),
            MI_Holder_Name: middleInitial.toUpperCase(),
          },
        ])
        .select()

      if (error) {
        console.log("error!");
        throw new Error("Network response was not ok");
      }

      console.log("User created:", data);
      const recent = await getRecentID()
      if (recent) setrecentID(recent)
      setSuccessDialogOpen(true);
      return data;
    } catch (error) {
      console.error("Database error:", error);
      setErrorDialogOpen(true);
    }
  };

  const handleCreateCard = async (
    id: string,
  ) => {
    try {

      const { data, error } = await supabase
        .from('WriteCard')
        .update({ id: id })
        .eq('status', true)
        .select()

      if (error) {
        console.log("error!");
        console.log(error);
        throw new Error("Network response was not ok");
      }

      setisDisabled(true)
      setTimeout(() => setisDisabled(false), 10000)
      setCreateSuccessDialogOpen(true);
      return data;
    } catch (error) {
      console.error("Database error:", error);
      setErrorDialogOpen(true);
    }
  };

  const handleClearForm = () => {
    const form = document.querySelector("form");
    form?.reset();
  };

  return (
    <div className="w-full max-w-4xl py-20 p-16">

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const first = document.getElementById("firstName") as HTMLInputElement
          const last = document.getElementById("lastName") as HTMLInputElement
          const middle = document.getElementById("midInitial") as HTMLInputElement
          const balance = document.getElementById("balance") as HTMLInputElement
          if (first !== null && last !== null && middle !== null && balance !== null) {
            handleSubmit(balance.value, first.value, middle.value, last.value);
          } else {
            console.log("something is null")
            console.log(first)
            console.log(last)
            console.log(middle)
            console.log(balance)
          }
        }}
      >
        <FieldSet>
          <FieldLegend>Profile</FieldLegend>
          <FieldDescription>Fill in the profile information.</FieldDescription>
          <FieldSeparator />
          <FieldGroup>
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                <FieldDescription>
                  Provide your first name for identification
                </FieldDescription>
              </FieldContent>
              <Input id="firstName" placeholder="Juan" required />
            </Field>

            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="midInitial">Middle Initial</FieldLabel>
                <FieldDescription>
                  Provide your middle initial for identification
                </FieldDescription>
              </FieldContent>
              <Input id="midInitial" placeholder="A" maxLength={1} required />
            </Field>

            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                <FieldDescription>
                  Provide your last name for identification
                </FieldDescription>
              </FieldContent>
              <Input id="lastName" placeholder="Dela Cruz" required />
            </Field>

            <FieldSeparator />

            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="initialBalance">Initial Balance</FieldLabel>
                <FieldDescription>
                  Provide the initial balance for this card
                </FieldDescription>
              </FieldContent>
              <Input type="number" id="balance" placeholder="100" required />
            </Field>

            <FieldSeparator />

            <Field orientation="responsive" className="justify-end">
              <Button type="submit">Submit</Button>
              <Button type="button" variant="outline" onClick={handleClearForm}>
                Cancel
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
      <FieldSeparator className="py-16" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const card = document.getElementById("cardID") as HTMLInputElement
          handleCreateCard(card.value)
        }}
      >
        <FieldSet>
          <FieldLegend>Write to RFID Card</FieldLegend>
          <FieldDescription>Fill in the Card ID to write</FieldDescription>
          <FieldDescription>{recentID}</FieldDescription>
          <FieldSeparator />
          <FieldGroup>
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="cardIDFor">Card ID</FieldLabel>
              </FieldContent>
              <Input id="cardID" placeholder="abc123ABC" required />
            </Field>
            <FieldSeparator />
            <Field orientation="responsive" className="justify-end">
              <Button type="submit">Write</Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>



      <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error!</AlertDialogTitle>
            <AlertDialogDescription>
              Cannot connect to database. Please try again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorDialogOpen(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Created Successfully!</AlertDialogTitle>
            <AlertDialogDescription>
              User has been created successfully.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorDialogOpen(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={successCreateDialogOpen} onOpenChange={setCreateSuccessDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Writing to card...</AlertDialogTitle>
            <AlertDialogDescription>
              Please place the card to write its ID. Wait for 10 seconds before removing the card or closing this dialoge.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorDialogOpen(false)} asChild>
              <Button disabled={isDisabled}>
                {isDisabled ? 'Wait for 10 seconds...' : 'Close'}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

