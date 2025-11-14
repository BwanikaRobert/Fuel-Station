"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

const fuelPricesSchema = z.object({
  gasoline: z.number().min(1, "Petrol price must be greater than 0"),
  diesel: z.number().min(1, "Diesel price must be greater than 0"),
  kerosene: z.number().min(1, "Kerosene price must be greater than 0"),
});

type FuelPricesFormData = z.infer<typeof fuelPricesSchema>;

interface UpdateFuelPricesDialogProps {
  currentPrices: {
    gasoline: number;
    diesel: number;
    kerosene: number;
  };
  branchId: string;
}

// Mock API function to update fuel prices
async function mockUpdateFuelPrices(
  prices: FuelPricesFormData,
  branchId: string
): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  // In a real app, this would make an API call to update prices in the database
  console.log("Updated fuel prices for branch:", branchId, prices);
}

export function UpdateFuelPricesDialog({
  currentPrices,
  branchId,
}: UpdateFuelPricesDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FuelPricesFormData>({
    resolver: zodResolver(fuelPricesSchema),
    defaultValues: currentPrices,
  });

  const updateMutation = useMutation({
    mutationFn: (data: FuelPricesFormData) =>
      mockUpdateFuelPrices(data, branchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Fuel prices updated successfully!", {
        description: "The new prices are now active.",
      });
      setOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to update fuel prices", {
        description: error.message || "Please try again later.",
      });
    },
  });

  const onSubmit = (data: FuelPricesFormData) => {
    updateMutation.mutate(data);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset(currentPrices);
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 ">
          <ArrowUpDown className="h-4 w-4" />
          Update Fuel Prices
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Fuel Prices</DialogTitle>
          <DialogDescription>
            Set new selling prices for fuel types. Prices are in UGX per liter.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gasoline">Petrol Price (UGX/L)</Label>
              <Input
                id="gasoline"
                type="number"
                step="1"
                placeholder="5850"
                {...register("gasoline", { valueAsNumber: true })}
              />
              {errors.gasoline && (
                <p className="text-sm text-destructive">
                  {errors.gasoline.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="diesel">Diesel Price (UGX/L)</Label>
              <Input
                id="diesel"
                type="number"
                step="1"
                placeholder="6200"
                {...register("diesel", { valueAsNumber: true })}
              />
              {errors.diesel && (
                <p className="text-sm text-destructive">
                  {errors.diesel.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="kerosene">Kerosene Price (UGX/L)</Label>
              <Input
                id="kerosene"
                type="number"
                step="1"
                placeholder="4750"
                {...register("kerosene", { valueAsNumber: true })}
              />
              {errors.kerosene && (
                <p className="text-sm text-destructive">
                  {errors.kerosene.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Updating..." : "Update Prices"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
