"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Passkey } from "better-auth/plugins/passkey";
import { ArrowUpRightIcon, FingerprintIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/shared/helpers/better-auth/auth-client";

const passkeySchema = z.object({
  name: z.string().min(1),
  authenticatorAttachment: z.enum(["platform", "cross-platform"]).optional(),
});

export function PasskeyManagement({ passkeys }: { passkeys: Passkey[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");

  const router = useRouter();

  const form = useForm<z.infer<typeof passkeySchema>>({
    resolver: zodResolver(passkeySchema),
    defaultValues: {
      name: "",
    },
  });

  async function handleAddPasskey(data: z.infer<typeof passkeySchema>) {
    try {
      await authClient.passkey.addPasskey(data, {
        onRequest: () => {
          setLoading(true);
        },
        onResponse: () => {
          setLoading(false);
        },
        onError: (error) => {
          console.error(error);
          toast.error(error.error.message || "Failed to add passkey");
        },
        onSuccess: () => {
          router.refresh();
          setIsDialogOpen(false);
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  function handleDeletePasskey(passkeyId: string) {
    return authClient.passkey.deletePasskey(
      { id: passkeyId },
      {
        onRequest: () => {
          setLoading(true);
        },
        onResponse: () => {
          setLoading(false);
        },
        onSuccess: () => router.refresh(),
      },
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Passkeys</CardTitle>
        <CardDescription>
          Manage your passkeys for secure, passwordless authentication.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {passkeys.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FingerprintIcon />
              </EmptyMedia>
              <EmptyTitle>No Passkeys Yet</EmptyTitle>
              <EmptyDescription>
                You haven&apos;t created any passkeys yet. Get started by
                creating your first passkey.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          passkeys.map((passkey) => (
            <Item variant="outline" key={passkey.id}>
              <ItemMedia variant="icon">
                <FingerprintIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{passkey.name}</ItemTitle>
                <ItemDescription>
                  {" "}
                  Created {new Date(passkey.createdAt).toLocaleDateString()}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="text-muted hover:bg-destructive"
                    >
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Sei assolutamente sicuro?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Questa azione non può essere annullata. Questo eliminerà
                        definitivamente la tua passkey.,
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="mt-2 flex flex-col gap-2">
                      <Label htmlFor="confirm-delete">
                        Type <span className="font-medium">DELETE</span> to
                        confirm.
                      </Label>
                      <Input
                        id="confirm-delete"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                      />
                    </div>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Annulla</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeletePasskey(passkey.id)}
                        disabled={value !== "DELETE"}
                      >
                        {loading ? <Spinner /> : "Continua"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </ItemActions>
            </Item>
          ))
        )}
      </CardContent>
      <CardFooter className="border-t text-muted-foreground text-sm justify-between">
        <Link href="#" className="flex gap-2 items-center">
          Learn more about passkeys <ArrowUpRightIcon className="size-4" />
        </Link>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(o) => {
            if (o) form.reset();
            setIsDialogOpen(o);
          }}
        >
          <DialogTrigger asChild>
            <Button>New Passkey</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Passkey</DialogTitle>
              <DialogDescription>
                Create a new passkey for secure, passwordless authentication.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={form.handleSubmit(handleAddPasskey)}
              className="grid gap-4"
            >
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Input {...field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Spinner /> : "Add"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
