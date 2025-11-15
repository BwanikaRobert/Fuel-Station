"use client";

import { useQuery } from "@tanstack/react-query";
import { mockGetBranches } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BranchesPage() {
  const router = useRouter();
  const { data: branches, isLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: mockGetBranches,
  });

  useEffect(() => {
    // Redirect to the first branch when branches are loaded
    if (branches && branches.length > 0) {
      router.replace(`/admin/branches/${branches[0].id}`);
    }
  }, [branches, router]);

  if (isLoading || !branches) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading branches...</p>
        </div>
      </div>
    );
  }

  return null;
}
