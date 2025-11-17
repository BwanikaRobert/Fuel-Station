"use client";

import { useQuery } from "@tanstack/react-query";
import { mockGetExpenses } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AccountantDashboardPage() {
  const { data: expenses = [] } = useQuery({
    queryKey: ["expenses"],
    queryFn: () => mockGetExpenses(),
  });

  // Calculate stats
  const pendingExpenses = expenses.filter((exp) => !exp.verified);
  const verifiedExpenses = expenses.filter((exp) => exp.verified);

  const pendingAmount = pendingExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );
  const verifiedAmount = verifiedExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Get last 2 days expenses
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const recentPending = pendingExpenses.filter(
    (exp) => new Date(exp.date) >= twoDaysAgo
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Accountant Dashboard</h1>
        <p className="text-muted-foreground">
          Review and verify expense records
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Verification
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingExpenses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              UGX {pendingAmount.toLocaleString()}
            </p>
            {recentPending.length > 0 && (
              <Badge variant="outline" className="mt-2 border-orange-600">
                {recentPending.length} from last 2 days
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Expenses
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedExpenses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              UGX {verifiedAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              UGX {totalAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verification Rate
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {expenses.length > 0
                ? Math.round((verifiedExpenses.length / expenses.length) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {verifiedExpenses.length} of {expenses.length} verified
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
