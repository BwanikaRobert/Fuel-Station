"use client";

import { useQuery } from "@tanstack/react-query";
import { mockGetExpenses } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  ExpenseSummaryCards,
  RecordExpenseForm,
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage expenses</h1>
      </div>

      {/* Summary Cards */}
      <ExpenseSummaryCards
        todayExpenses={todayExpenses}
        totalExpenses={totalExpenses}
      />

      {/* Form */}
      <RecordExpenseForm userId={user!.id} branchId={user!.branchId!} />

      {/* History Table */}
      <ExpenseHistoryTable expenses={expenses || []} />
    </div>
  );
}
