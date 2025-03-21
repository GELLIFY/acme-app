"use client";

import Image from "next/image";
import Link from "next/link";
import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function Page() {
  return (
    <div className="h-screen w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex h-full items-center justify-center py-12">
        <SignUp.Root>
          <Clerk.Loading>
            {(isGlobalLoading) => (
              <>
                <SignUp.Step name="start">
                  <Card className="w-full sm:w-96">
                    <CardHeader>
                      <CardTitle>Create your account</CardTitle>
                      <CardDescription>
                        Welcome! Please fill in the details to get started.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-y-4">
                      <div className="grid grid-cols-1 gap-x-4">
                        <Clerk.Connection name="google" asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            type="button"
                            disabled={isGlobalLoading}
                          >
                            <Clerk.Loading scope="provider:google">
                              {(isLoading) =>
                                isLoading ? (
                                  <Loader2Icon className="size-4 animate-spin" />
                                ) : (
                                  <div className="flex gap-2">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 17 16"
                                      className="w-4"
                                      aria-hidden
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M8.82 7.28v2.187h5.227c-.16 1.226-.57 2.124-1.192 2.755-.764.765-1.955 1.6-4.035 1.6-3.218 0-5.733-2.595-5.733-5.813 0-3.218 2.515-5.814 5.733-5.814 1.733 0 3.005.685 3.938 1.565l1.538-1.538C12.998.96 11.256 0 8.82 0 4.41 0 .705 3.591.705 8s3.706 8 8.115 8c2.382 0 4.178-.782 5.582-2.24 1.44-1.44 1.893-3.475 1.893-5.111 0-.507-.035-.978-.115-1.369H8.82Z"
                                      />
                                    </svg>
                                    Google
                                  </div>
                                )
                              }
                            </Clerk.Loading>
                          </Button>
                        </Clerk.Connection>
                      </div>
                      <p className="flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                        or
                      </p>
                      <Clerk.Field name="emailAddress" className="space-y-2">
                        <Clerk.Label asChild>
                          <Label>Email address</Label>
                        </Clerk.Label>
                        <Clerk.Input type="email" required asChild>
                          <Input />
                        </Clerk.Input>
                        <Clerk.FieldError className="block text-sm text-destructive" />
                      </Clerk.Field>
                      <Clerk.Field name="password" className="space-y-2">
                        <Clerk.Label asChild>
                          <Label>Password</Label>
                        </Clerk.Label>
                        <Clerk.Input type="password" required asChild>
                          <Input />
                        </Clerk.Input>
                        <Clerk.FieldError className="block text-sm text-destructive" />
                      </Clerk.Field>
                    </CardContent>
                    <CardFooter>
                      <div className="grid w-full gap-y-4">
                        <SignUp.Captcha className="empty:hidden" />
                        <SignUp.Action submit asChild>
                          <Button disabled={isGlobalLoading}>
                            <Clerk.Loading>
                              {(isLoading) => {
                                return isLoading ? (
                                  <Loader2Icon className="size-4 animate-spin" />
                                ) : (
                                  "Continue"
                                );
                              }}
                            </Clerk.Loading>
                          </Button>
                        </SignUp.Action>
                        <Button variant="link" size="sm" asChild>
                          <Link href="/sign-in">
                            Already have an account? Sign in
                          </Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </SignUp.Step>

                <SignUp.Step name="continue">
                  <Card className="w-full sm:w-96">
                    <CardHeader>
                      <CardTitle>Continue registration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Clerk.Field name="username" className="space-y-2">
                        <Clerk.Label>
                          <Label>Username</Label>
                        </Clerk.Label>
                        <Clerk.Input type="text" required asChild>
                          <Input />
                        </Clerk.Input>
                        <Clerk.FieldError className="block text-sm text-destructive" />
                      </Clerk.Field>
                    </CardContent>
                    <CardFooter>
                      <div className="grid w-full gap-y-4">
                        <SignUp.Action submit asChild>
                          <Button disabled={isGlobalLoading}>
                            <Clerk.Loading>
                              {(isLoading) => {
                                return isLoading ? (
                                  <Loader2Icon className="size-4 animate-spin" />
                                ) : (
                                  "Continue"
                                );
                              }}
                            </Clerk.Loading>
                          </Button>
                        </SignUp.Action>
                      </div>
                    </CardFooter>
                  </Card>
                </SignUp.Step>

                <SignUp.Step name="verifications">
                  <SignUp.Strategy name="email_code">
                    <Card className="w-full sm:w-96">
                      <CardHeader>
                        <CardTitle>Verify your email</CardTitle>
                        <CardDescription>
                          Use the verification link sent to your email address
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-y-4">
                        <div className="grid items-center justify-center gap-y-2">
                          <Clerk.Field name="code" className="space-y-2">
                            <Clerk.Label className="sr-only">
                              Email address
                            </Clerk.Label>
                            <div className="flex justify-center text-center">
                              <Clerk.Input
                                type="otp"
                                className="flex justify-center has-disabled:opacity-50"
                                autoSubmit
                                render={({ value, status }) => {
                                  return (
                                    <div
                                      data-status={status}
                                      className={cn(
                                        "relative flex size-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
                                        {
                                          "z-10 ring-2 ring-ring ring-offset-background":
                                            status === "cursor" ||
                                            status === "selected",
                                        },
                                      )}
                                    >
                                      {value}
                                      {status === "cursor" && (
                                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
                                        </div>
                                      )}
                                    </div>
                                  );
                                }}
                              />
                            </div>
                            <Clerk.FieldError className="block text-center text-sm text-destructive" />
                          </Clerk.Field>
                          <SignUp.Action
                            asChild
                            resend
                            className="text-muted-foreground"
                            fallback={({ resendableAfter }) => (
                              <Button variant="link" size="sm" disabled>
                                Didn&apos;t receive a code? Resend (
                                <span className="tabular-nums">
                                  {resendableAfter}
                                </span>
                                )
                              </Button>
                            )}
                          >
                            <Button type="button" variant="link" size="sm">
                              Didn&apos;t receive a code? Resend
                            </Button>
                          </SignUp.Action>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="grid w-full gap-y-4">
                          <SignUp.Action submit asChild>
                            <Button disabled={isGlobalLoading}>
                              <Clerk.Loading>
                                {(isLoading) => {
                                  return isLoading ? (
                                    <Loader2Icon className="size-4 animate-spin" />
                                  ) : (
                                    "Continue"
                                  );
                                }}
                              </Clerk.Loading>
                            </Button>
                          </SignUp.Action>
                        </div>
                      </CardFooter>
                    </Card>
                  </SignUp.Strategy>
                </SignUp.Step>
              </>
            )}
          </Clerk.Loading>
        </SignUp.Root>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
