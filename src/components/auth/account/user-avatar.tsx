"use client";

import { Loader2 } from "lucide-react";
// import { AvatarUpload } from "../avatar-upload";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserQuery } from "@/hooks/use-user";

export function UserAvatar() {
  const { data: user, isLoading } = useUserQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avatar</CardTitle>
        <CardDescription>
          Click on the avatar to upload a custom one from your files.
        </CardDescription>
        <CardAction>
          {isLoading || !user ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Skeleton className="size-16" />
            // <AvatarUpload userId={user.id} avatarUrl={user.image} />
          )}
        </CardAction>
      </CardHeader>

      <CardFooter className="border-t text-muted-foreground text-sm">
        An avatar is optional but strongly recommended.
      </CardFooter>
    </Card>
  );
}
