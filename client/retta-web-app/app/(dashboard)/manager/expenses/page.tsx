"use client";

import { useQuery } from "@tanstack/react-query";
import { mockGetExpenses } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  ExpenseSummaryCards,
  RecordExpenseModal,
  ExpenseHistoryTable,
} from "@/components/manager/expenses";

export default function ExpensesPage() {
  const { user } = useAuth();

  const { data: expenses, isLoading } = useQuery({
    queryKey: ["expenses", user?.branchId],
    queryFn: () => mockGetExpenses(user?.branchId),
  });

  // Calculate total expenses
  const totalExpenses =
    expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const todayExpenses =
    expenses
      ?.filter(
        (expense) => expense.date === new Date().toISOString().split("T")[0]
      )
      .reduce((sum, expense) => sum + expense.amount, 0) || 0;

  // Calculate unverified expenses from the last 2 days
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const twoDaysAgoStr = twoDaysAgo.toISOString().split("T")[0];

  const unverifiedExpenses =
    expenses
      ?.filter((expense) => !expense.verified && expense.date >= twoDaysAgoStr)
      .reduce((sum, expense) => sum + expense.amount, 0) || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manage expenses</h1>
        <RecordExpenseModal userId={user!.id} branchId={user!.branchId!} />
      </div>

      {/* Summary Cards */}
      <ExpenseSummaryCards
        todayExpenses={todayExpenses}
        totalExpenses={totalExpenses}
        unverifiedExpenses={unverifiedExpenses}
      />

      {/* History Table */}
      <ExpenseHistoryTable expenses={expenses || []} />
    </div>
  );
}
