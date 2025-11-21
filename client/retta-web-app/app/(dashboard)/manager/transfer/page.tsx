"use client";

import { useQuery } from "@tanstack/react-query";
import { mockGetFuelTransfers, mockGetBranches } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  InitiateTransferModal,
  TransferHistoryTable,
} from "@/components/manager/transfer";

export default function TransferPage() {
  const { user } = useAuth();

  const { data: transfers = [], isLoading: transfersLoading } = useQuery({
    queryKey: ["fuel-transfers", user?.branchId],
    queryFn: () => mockGetFuelTransfers(user?.branchId),
  });

  const { data: branches = [], isLoading: branchesLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: mockGetBranches,
  });

  if (transfersLoading || branchesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Calculate summary stats
  const outgoingTransfers = transfers.filter(
    (t) => t.fromBranchId === user?.branchId
  );
  const incomingTransfers = transfers.filter(
    (t) => t.toBranchId === user?.branchId
  );

  const totalOutgoing = outgoingTransfers.reduce(
    (sum, t) => sum + t.quantityTransferred,
    0
  );
  const totalIncoming = incomingTransfers.reduce(
    (sum, t) => sum + t.quantityTransferred,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fuel Transfers</h1>
          <p className="text-muted-foreground">
            Manage fuel transfers between branches
          </p>
        </div>
        <InitiateTransferModal
          userId={user!.id}
          branchId={user!.branchId!}
          branches={branches}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-6 border rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Total Transfers</p>
          <p className="text-3xl font-bold">{transfers.length}</p>
        </div>
        <div className="p-6 border rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Outgoing (Sent)</p>
          <p className="text-3xl font-bold text-red-600">
            {totalOutgoing.toLocaleString()} L
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {outgoingTransfers.length} transfer(s)
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">
            Incoming (Received)
          </p>
          <p className="text-3xl font-bold text-green-600">
            {totalIncoming.toLocaleString()} L
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {incomingTransfers.length} transfer(s)
          </p>
        </div>
      </div>

      {/* Transfer History */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Transfer History</h2>
        <TransferHistoryTable transfers={transfers} />
      </div>
    </div>
  );
}
