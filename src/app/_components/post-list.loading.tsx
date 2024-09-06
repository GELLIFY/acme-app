import { Skeleton } from "~/components/ui/skeleton";

export function PostListLoading() {
  return (
    <div className="flex justify-between gap-4">
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-6 w-[150px] rounded" />
        <Skeleton className="h-4 w-[250px] rounded" />
      </div>
      <Skeleton className="h-6 w-[70px] rounded" />
    </div>
  );
}
