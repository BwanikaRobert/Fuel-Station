"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IdCard } from "lucide-react";

export default function CreditsReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <IdCard className="h-8 w-8" />
          Credits Reports
        </h1>
        <p className="text-muted-foreground">
          Monitor credit sales and payment status across all branches
        </p>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Credits Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Credits reports table will be displayed here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
