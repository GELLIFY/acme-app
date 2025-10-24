"use client";

import { Loader2 } from "lucide-react";
import { useUserQuery } from "~/hooks/use-user";

import { AvatarUpload } from "../avatar-upload";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export function UserAvatar() {
  const { data: user, isLoading } = useUserQuery();

  return (
    <Card>
      <div className="flex items-center justify-between pr-6">
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>
            This is your avatar. Click on the avatar to upload a custom one from
            your files.
          </CardDescription>
        </CardHeader>

        {isLoading || !user ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <AvatarUpload userId={user.id} avatarUrl={user.image} />
        )}
      </div>
      <CardFooter>An avatar is optional but strongly recommended.</CardFooter>
    </Card>
  );
}
