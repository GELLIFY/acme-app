import { useSuspenseQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getInitials } from "@/lib/users/utils";
import { useTRPC } from "@/shared/helpers/trpc/client";
import { useScopedI18n } from "@/shared/locales/client";
import type { UserSchema } from "@/shared/validators/user.schema";

interface UsersSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function UsersSelect({
  value,
  onValueChange,
  defaultValue = "",
  placeholder,
  disabled = false,
}: UsersSelectProps) {
  const t = useScopedI18n("tasks");

  const trpc = useTRPC();
  const { data: users } = useSuspenseQuery(trpc.user.get.queryOptions());

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder ?? t("form.no_user_assigned")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="no-user" value="no-user">
          {t("form.no_user_assigned")}
        </SelectItem>
        {users?.map((user: UserSchema) => (
          <SelectItem key={user.id} value={user.id}>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <span>{user.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
