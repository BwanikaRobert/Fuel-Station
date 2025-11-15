"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CreditsFilters,
  CreditsSummaryCard,
  CreditsTable,
} from "@/components/admin-dashboard/reports/credits";

// Mock data - replace with actual API call
const mockCredits = [
  {
    id: "1",
    branchName: "Downtown Station",
    debtorName: "ABC Transport Ltd",
    fuelType: "Diesel",
    amount: 5000,
    amountPaid: 0,
    amountRemaining: 5000,
    status: "unpaid" as const,
    date: "2024-11-08",
  },
  {
    id: "2",
    branchName: "Airport Station",
    debtorName: "XYZ Logistics",
    fuelType: "Petrol",
    amount: 3500,
    amountPaid: 1500,
    amountRemaining: 2000,
    status: "partially-paid" as const,
    date: "2024-11-09",
  },
  {
    id: "3",
    branchName: "Downtown Station",
    debtorName: "Quick Delivery Services",
    fuelType: "Premium",
    amount: 2800,
    amountPaid: 2800,
    amountRemaining: 0,
    status: "settled" as const,
    date: "2024-11-10",
  },
  {
    id: "4",
    branchName: "Highway Station",
    debtorName: "Metro Taxi Association",
    fuelType: "Petrol",
    amount: 4200,
    amountPaid: 2100,
    amountRemaining: 2100,
    status: "partially-paid" as const,
    date: "2024-11-11",
  },
  {
    id: "5",
    branchName: "Airport Station",
    debtorName: "Global Shipping Co",
    fuelType: "Diesel",
    amount: 6500,
    amountPaid: 0,
    amountRemaining: 6500,
    status: "unpaid" as const,
    date: "2024-11-12",
  },
  {
    id: "6",
    branchName: "Highway Station",
    debtorName: "City Bus Company",
    fuelType: "Diesel",
    amount: 8000,
    amountPaid: 8000,
    amountRemaining: 0,
    status: "settled" as const,
    date: "2024-11-13",
  },
];

export default function CreditsReportsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreditsReportsContent />
    </Suspense>
  );
}

function CreditsReportsContent() {
  const searchParams = useSearchParams();

  // Get filter values from URL
  const selectedBranch = searchParams.get("branch") || "all";
  const selectedStatus = searchParams.get("status") || "all";
  const startDate = searchParams.get("start") || "";
  const endDate = searchParams.get("end") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Filter credits
  const filteredCredits = mockCredits.filter((credit) => {
    const matchesBranch =
      selectedBranch === "all" || credit.branchName === selectedBranch;
    const matchesStatus =
      selectedStatus === "all" || credit.status === selectedStatus;

    // Date range filter
    const creditDate = new Date(credit.date);
    const matchesStartDate = !startDate || creditDate >= new Date(startDate);
    const matchesEndDate = !endDate || creditDate <= new Date(endDate);

    return matchesBranch && matchesStatus && matchesStartDate && matchesEndDate;
  });

  // Calculate totals
  const totalCredits = filteredCredits.reduce(
    (sum, credit) => sum + credit.amount,
    0
  );
  const totalOutstanding = filteredCredits.reduce(
    (sum, credit) => sum + credit.amountRemaining,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          Credits Reports
        </h1>
        <p className="text-muted-foreground">
          Monitor credit sales and payment status across all branches
        </p>
      </div>

      {/* Filters and Summary Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <CreditsFilters resultCount={filteredCredits.length} />
        <CreditsSummaryCard
          totalCredits={totalCredits}
          totalOutstanding={totalOutstanding}
        />
      </div>

      {/* Credits Table */}
      <CreditsTable credits={filteredCredits} currentPage={currentPage} />
    </div>
  );
}
