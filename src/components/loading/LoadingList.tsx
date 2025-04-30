import React from "react";
import { Skeleton } from "../ui/skeleton";

const LoadingList = () => {
  return (
    <div className=" flex flex-col gap-4 justify-center items-center">
      <div className="flex flex-col gap-4 w-full mt-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
};

export default LoadingList;
