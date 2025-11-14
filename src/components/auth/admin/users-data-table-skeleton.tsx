import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function UsersDataTableSkeleton({ isEmpty }: { isEmpty?: boolean }) {
  return (
    <div className="w-full">
      <div
        className={cn("overflow-x-auto", !isEmpty && "border-t border-border")}
      >
        <Table
          className={cn(
            "min-w-[1600px]",
            isEmpty && "pointer-events-none opacity-20 blur-[7px]",
          )}
        >
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {[...Array(10)].map((_, index) => (
              <TableRow
                key={index.toString()}
                className="h-[49px] hover:bg-transparent"
              >
                <TableCell className="w-full">
                  <Skeleton
                    className={cn(
                      "size-4 rounded-b-md",
                      isEmpty && "animate-none",
                    )}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
