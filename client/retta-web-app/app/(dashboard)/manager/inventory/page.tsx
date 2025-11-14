"use client";

import { useQuery } from "@tanstack/react-query";
import { mockGetFuelDeliveries } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { UpdateFuelPricesDialog } from "@/components/manager/manager-dashboard";
import {
  AcknowledgeFuelDeliveryForm,
  PendingDeliveriesTable,
  AcknowledgedDeliveriesTable,
} from "@/components/manager/shift-balance/inventory";

export default function ManagerInventoryPage() {
  const { user } = useAuth();

  const { data: deliveries, isLoading } = useQuery({
    queryKey: ["fuel-deliveries", user?.branchId],
    queryFn: () => mockGetFuelDeliveries(user?.branchId),
  });

  // Get current fuel prices from the deliveries or use defaults
  const currentFuelPrices = {
    gasoline: 5850,
    diesel: 6200,
    kerosene: 4750,
  };

  const pendingDeliveries =
    deliveries?.filter((d) => d.status === "pending") || [];
  const acknowledgedDeliveries =
    deliveries?.filter((d) => d.status === "acknowledged") || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Inventory Management
          </h1>
          <UpdateFuelPricesDialog
            currentPrices={currentFuelPrices}
            branchId={user?.branchId || ""}
          />
        </div>
      </div>

      {/* Acknowledge Fuel Delivery Section */}
      <AcknowledgeFuelDeliveryForm
        userId={user?.id || ""}
        branchId={user?.branchId || ""}
        pendingDeliveries={pendingDeliveries}
      />

      {/* Pending Deliveries Table */}
      <PendingDeliveriesTable deliveries={pendingDeliveries} />

      {/* Acknowledged Deliveries Table */}
      <AcknowledgedDeliveriesTable deliveries={acknowledgedDeliveries} />
    </div>
  );
}
