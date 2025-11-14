"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

interface TopBranchesListProps {
  branches?: Array<{
    branchId: string;
    branchName: string;
    revenue: number;
  }>;
}

export function TopBranchesList({ branches }: TopBranchesListProps) {
  if (!branches || branches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Branches</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No branch data available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Branches</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {branches.map((branch, index) => (
            <div key={branch.branchId} className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                {index + 1}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{branch.branchName}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Building2 className="mr-1 h-3 w-3" />
                      Branch
                    </div>
                  </div>
                  <p className="text-sm font-bold">
                    UGX {branch.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
