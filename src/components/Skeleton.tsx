import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col justify-center items-center m-auto w-full space-y-3">
      <Skeleton className="h-[325px] w-[750px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[450px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
    </div>
  );
}
