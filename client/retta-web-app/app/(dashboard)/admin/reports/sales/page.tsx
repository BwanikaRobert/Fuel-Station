"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function SalesReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          Sales Reports
        </h1>
        <p className="text-muted-foreground">
          View and analyze sales data across all branches
        </p>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Sales reports table will be displayed here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
