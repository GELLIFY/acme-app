"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getInitials } from "@/lib/users/utils";
import { formatDate } from "@/lib/utils";
import { useTRPC } from "@/shared/helpers/trpc/client";
import { useScopedI18n } from "@/shared/locales/client";
import type { UserSchema } from "@/shared/validators/user.schema";

export default function UsersTable() {
  const t = useScopedI18n("users");
  const [searchTerm, setSearchTerm] = useState("");
  const limiterOptions = [10, 25, 50];
  const [limiter, setLimiter] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.user.get.queryOptions());

  const searchFilter = (users: UserSchema[]) => {
    return users.filter((user: UserSchema) => {
      const name = user.name?.toLowerCase() ?? "";
      const email = user.email?.toLowerCase() ?? "";

      return (
        name.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase())
      );
    });
  };

  const filteredUsers = searchFilter(data).slice(
    (currentPage - 1) * limiter,
    (currentPage - 1) * limiter + limiter,
  );
  const totalFilteredUsers = searchFilter(data).length;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(totalFilteredUsers / limiter);

    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Search size={18} className="text-muted-foreground absolute ml-2" />
          <Input
            type="text"
            placeholder={t("filter_by_name_email")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="false"
            className="w-full pl-8 focus:ring-0"
          />
        </div>
        <div className="flex items-center justify-end">
          <span className="pr-4 text-sm text-gray-500">
            {t("table.n_items")}
          </span>
          <div className="flex gap-2">
            <Select
              value={limiter.toString()}
              onValueChange={(value) => {
                setLimiter(parseInt(value, 10));
                setCurrentPage(1);
              }}
              defaultValue={limiter.toString()}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="bottom">
                {limiterOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="w-full overflow-hidden">
        <Table className="mb-4 table-fixed w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/12">{t("table.avatar")}</TableHead>
              <TableHead className="w-3/12">{t("table.name")}</TableHead>
              <TableHead className="w-4/12">{t("table.email")}</TableHead>
              <TableHead className="w-2/12">{t("table.verified")}</TableHead>
              <TableHead className="w-2/12">{t("table.created_at")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.emailVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.emailVerified ? t("verified") : t("not_verified")}
                  </span>
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between pt-4 text-sm text-gray-500">
        <span>
          {t("table.showing_range", {
            start: Math.min(
              Math.max(currentPage - 1, 0) * limiter + 1,
              totalFilteredUsers,
            ),
            end: Math.min(currentPage * limiter, totalFilteredUsers),
            max: totalFilteredUsers,
          })}
        </span>
        <div className="flex gap-2">
          <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
            {t("table.previous")}
          </Button>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(totalFilteredUsers / limiter)}
          >
            {t("table.next")}
          </Button>
        </div>
      </div>
    </div>
  );
}
