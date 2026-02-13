"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { APIError } from "better-auth";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { browserLogger as logger } from "@/infrastructure/logger/browser-logger";
import { authClient } from "@/libs/better-auth/auth-client";
import { ROLES } from "@/libs/better-auth/permissions";

const formSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  password: z.string().min(8).max(32),
  role: z.enum(ROLES),
});

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const { data: _, error } = await authClient.admin.createUser(
        {
          email: data.email, // required
          password: data.password, // required
          name: `${data.firstName} ${data.lastName}`, // required
          role: data.role,
        },
        {
          onResponse: () => {
            setLoading(false);
          },
          onRequest: () => {
            setLoading(true);
          },
        },
      );

      if (error) {
        logger.error(error.statusText, new Error(error.message));
        toast.error(error.message || "Error creating user");
      }

      setOpen(false);
      form.reset();
      router.refresh();
      toast.success("User created");
    } catch (error) {
      if (error instanceof APIError) {
        logger.error(error.message, error);
        toast.error(error.message);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <PlusIcon />
            Add User
          </Button>
        }
      ></DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create user</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="first-name">First name</FieldLabel>
                  <Input
                    {...field}
                    id="first-name"
                    placeholder="Max"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="last-name">Last name</FieldLabel>
                  <Input
                    {...field}
                    id="last-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Robinson"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...field}
                  id="email"
                  aria-invalid={fieldState.invalid}
                  autoComplete="username"
                  placeholder="m@example.com"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  {...field}
                  id="password"
                  aria-invalid={fieldState.invalid}
                  type="password"
                  placeholder="password"
                  autoComplete="new-password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="role"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="role">Role</FieldLabel>
                <Select id="role" {...field}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ROLES).map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <DialogFooter>
            <DialogClose
              render={<Button variant="outline">Cancel</Button>}
            ></DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner /> : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
