"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { mockGetFuelDeliveries, mockGetBranches } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import {
  CreateDeliveryForm,
  DeliveriesTable,
} from "@/components/admin-dashboard/fuel-deliveries";

export default function FuelDeliveriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: deliveries, isLoading: deliveriesLoading } = useQuery({
    queryKey: ["fuel-deliveries"],
    queryFn: () => mockGetFuelDeliveries(),
  });

  const { data: branches, isLoading: branchesLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: () => mockGetBranches(),
  });

  if (deliveriesLoading || branchesLoading) {
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
      {/* Header with Action Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deliveries</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Delivery Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Fuel Delivery Note</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new fuel delivery note for a
                branch.
              </DialogDescription>
            </DialogHeader>
            <CreateDeliveryForm
              branches={branches || []}
              onSuccess={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Deliveries Table */}
      <DeliveriesTable deliveries={deliveries || []} />
    </div>
  );
}
