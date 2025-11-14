"use client";

import { useQuery } from "@tanstack/react-query";
import { mockGetBankDeposits } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  BankDepositSummaryCards,
  RecordBankDepositForm,
  BankDepositHistoryTable,
  RecentBankDeposits,
} from "@/components/manager/bank-deposits";

export default function BankDepositsPage() {
  const { user } = useAuth();

  const { data: deposits, isLoading } = useQuery({
    queryKey: ["bank-deposits", user?.branchId],
    queryFn: () => mockGetBankDeposits(user?.branchId),
  });

  // Calculate total deposits
  const totalDeposits =
    deposits?.reduce((sum, deposit) => sum + deposit.amount, 0) || 0;
  const todayDeposits =
    deposits
      ?.filter(
        (deposit) => deposit.date === new Date().toISOString().split("T")[0]
      )
      .reduce((sum, deposit) => sum + deposit.amount, 0) || 0;

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
        <h1 className="text-3xl font-bold tracking-tight">Bank Deposits</h1>
        <p className="text-muted-foreground">
          Record and track bank deposits for your branch
        </p>
      </div>

      {/* Summary Cards */}
      <BankDepositSummaryCards
        todayDeposits={todayDeposits}
        totalDeposits={totalDeposits}
      />

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <RecordBankDepositForm userId={user!.id} branchId={user!.branchId!} />

        {/* Recent Deposits */}
        <RecentBankDeposits deposits={deposits || []} />
      </div>

      {/* History Table */}
      <BankDepositHistoryTable deposits={deposits || []} />
    </div>
  );
}
