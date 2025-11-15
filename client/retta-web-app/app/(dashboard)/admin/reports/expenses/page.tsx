"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ExpenseFilters,
  ExpenseSummaryCard,
  ExpensesTable,
} from "@/components/admin-dashboard/reports/expenses";

// Mock data - replace with actual API call
const mockExpenses = [
  {
    id: "1",
    branchName: "Downtown Station",
    category: "utilities",
    amount: 5000,
    description: "Electricity bill for November",
    date: "2024-11-10",
    recordedByName: "Sarah Manager",
  },
  {
    id: "2",
    branchName: "Airport Station",
    category: "salaries",
    amount: 25000,
    description: "Monthly staff salaries",
    date: "2024-11-01",
    recordedByName: "Lisa Manager",
  },
  {
    id: "3",
    branchName: "Downtown Station",
    category: "maintenance",
    amount: 3500,
    description: "Pump repair and maintenance",
    date: "2024-11-08",
    recordedByName: "Sarah Manager",
  },
  {
    id: "4",
    branchName: "Highway Station",
    category: "supplies",
    amount: 1200,
    description: "Office supplies and cleaning materials",
    date: "2024-11-12",
    recordedByName: "Admin",
  },
  {
    id: "5",
    branchName: "Airport Station",
    category: "utilities",
    amount: 4800,
    description: "Water and electricity bills",
    date: "2024-11-11",
    recordedByName: "Lisa Manager",
  },
  {
    id: "6",
    branchName: "Downtown Station",
    category: "other",
    amount: 800,
    description: "Security system upgrade",
    date: "2024-11-14",
    recordedByName: "Sarah Manager",
  },
  {
    id: "15",
    branchName: "Downtown Station",
    category: "other",
    amount: 800,
    description: "Security system upgrade",
    date: "2024-11-14",
    recordedByName: "Sarah Manager",
  },
  {
    id: "14",
    branchName: "Downtown Station",
    category: "other",
    amount: 800,
    description: "Security system upgrade",
    date: "2024-11-14",
    recordedByName: "Sarah Manager",
  },
  {
    id: "13",
    branchName: "Downtown Station",
    category: "other",
    amount: 800,
    description: "Security system upgrade",
    date: "2024-11-14",
    recordedByName: "Sarah Manager",
  },
  {
    id: "12",
    branchName: "Downtown Station",
    category: "other",
    amount: 800,
    description: "Security system upgrade",
    date: "2024-11-14",
    recordedByName: "Sarah Manager",
  },
  {
    id: "11",
    branchName: "Downtown Station",
    category: "other",
    amount: 800,
    description: "Security system upgrade",
    date: "2024-11-14",
    recordedByName: "Sarah Manager",
  },
  {
    id: "10",
    branchName: "Downtown Station",
    category: "other",
    amount: 800,
    description: "Security system upgrade",
    date: "2024-11-14",
    recordedByName: "Sarah Manager",
  },
  {
    id: "9",
    branchName: "Downtown Station",
    category: "other",
    amount: 800,
    description: "Security system upgrade",
    date: "2024-11-14",
    recordedByName: "Sarah Manager",
  },
  {
    id: "8",
    branchName: "Downtown Station",
    category: "other",
    amount: 800,
    description: "Security system upgrade",
    date: "2024-11-14",
    recordedByName: "Sarah Manager",
  },
  {
    id: "7",
    branchName: "Downtown Station",
    category: "other",
    amount: 800,
    description: "Security system upgrade",
    date: "2024-11-14",
    recordedByName: "Sarah Manager",
  },
];

export default function ExpensesReportsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExpensesReportsContent />
    </Suspense>
  );
}

function ExpensesReportsContent() {
  const searchParams = useSearchParams();

  // Get filter values from URL
  const selectedBranch = searchParams.get("branch") || "all";
  const selectedCategory = searchParams.get("category") || "all";
  const startDate = searchParams.get("start") || "";
  const endDate = searchParams.get("end") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Filter expenses
  const filteredExpenses = mockExpenses.filter((expense) => {
    const matchesBranch =
      selectedBranch === "all" || expense.branchName === selectedBranch;
    const matchesCategory =
      selectedCategory === "all" || expense.category === selectedCategory;

    // Date range filter
    const expenseDate = new Date(expense.date);
    const matchesStartDate = !startDate || expenseDate >= new Date(startDate);
    const matchesEndDate = !endDate || expenseDate <= new Date(endDate);

    return (
      matchesBranch && matchesCategory && matchesStartDate && matchesEndDate
    );
  });

  // Calculate total
  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          Expenses Reports
        </h1>
      </div>

      {/* Filters and Summary Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ExpenseFilters resultCount={filteredExpenses.length} />
        <ExpenseSummaryCard totalExpenses={totalExpenses} />
      </div>

      {/* Expenses Table */}
      <ExpensesTable expenses={filteredExpenses} currentPage={currentPage} />
    </div>
  );
}
