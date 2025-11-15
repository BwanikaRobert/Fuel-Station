"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export default function ExpensesReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <DollarSign className="h-8 w-8" />
          Expenses Reports
        </h1>
        <p className="text-muted-foreground">
          Track and analyze expenses across all branches
        </p>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Expenses Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Expenses reports table will be displayed here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
