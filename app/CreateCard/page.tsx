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

export default function FieldResponsive() {
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const handleSubmit = async (
    initialBalance: string,
    firstName: string,
    middleInitial: string,
    lastName: string
  ) => {
    try {
      const api = `http://localhost/IT155P/wemos/makeUser.php?initialBalance=${initialBalance}&firstName=${firstName}&middleInitial=${middleInitial}&lastName=${lastName}`;
      const res = await fetch(api);

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      console.log("User created:", data);
      setSuccessDialogOpen(true);
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
    </div>
  );
}

