"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockCreateFuelTransfer } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, TrendingUp } from "lucide-react";
import { FuelTransferFormData, Branch, FuelType } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";

const transferSchema = z.object({
  toBranchId: z.string().min(1, "Please select a destination branch"),
  fuelType: z.enum(["gasoline", "diesel", "kerosene"] as const, {
    message: "Please select a fuel type",
  }),
  meterReadingBefore: z
    .number()
    .min(0, "Meter reading before must be 0 or greater"),
  meterReadingAfter: z
    .number()
    .min(0, "Meter reading after must be 0 or greater"),
  transferDate: z.string().min(1, "Date is required"),
  vehicleNumber: z.string().optional(),
  driverName: z.string().optional(),
  notes: z.string().optional(),
});

interface InitiateTransferFormProps {
  userId: string;
  branchId: string;
  branches: Branch[];
  onSuccess?: () => void;
}

const fuelTypeLabels: Record<FuelType, string> = {
  gasoline: "Petrol",
  diesel: "Diesel",
  kerosene: "Kerosene",
};

export function InitiateTransferForm({
  userId,
  branchId,
  branches,
  onSuccess,
}: InitiateTransferFormProps) {
  const [successMessage, setSuccessMessage] = useState("");
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FuelTransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      transferDate: new Date().toISOString().split("T")[0],
      meterReadingBefore: 0,
      meterReadingAfter: 0,
    },
  });

  const meterBefore = watch("meterReadingBefore");
  const meterAfter = watch("meterReadingAfter");
  const quantityTransferred = meterAfter - meterBefore;

  const createMutation = useMutation({
    mutationFn: (data: FuelTransferFormData) =>
      mockCreateFuelTransfer(data, userId, branchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-transfers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setSuccessMessage("Fuel transfer initiated successfully!");
      reset({
        transferDate: new Date().toISOString().split("T")[0],
        toBranchId: "",
        fuelType: undefined,
        meterReadingBefore: 0,
        meterReadingAfter: 0,
        vehicleNumber: "",
        driverName: "",
        notes: "",
      });
      setTimeout(() => setSuccessMessage(""), 5000);
      onSuccess?.();
    },
  });

  const onSubmit = (data: FuelTransferFormData) => {
    if (data.meterReadingAfter <= data.meterReadingBefore) {
      return;
    }
    createMutation.mutate(data);
  };

  // Filter out current branch from destinations
  const availableBranches = branches.filter((b) => b.id !== branchId);

  return (
    <div className="space-y-4">
      {successMessage && (
        <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 mr-2" />
            <p className="text-sm text-green-600 dark:text-green-500 font-medium">
              {successMessage}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="transferDate">Transfer Date</Label>
            <Input
              id="transferDate"
              type="date"
              {...register("transferDate")}
            />
            {errors.transferDate && (
              <p className="text-sm text-destructive">
                {errors.transferDate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="toBranchId">Destination Branch</Label>
            <Select
              value={watch("toBranchId")}
              onValueChange={(value) => setValue("toBranchId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select destination branch" />
              </SelectTrigger>
              <SelectContent>
                {availableBranches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name} - {branch.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.toBranchId && (
              <p className="text-sm text-destructive">
                {errors.toBranchId.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fuelType">Fuel Type</Label>
          <Select
            value={watch("fuelType")}
            onValueChange={(value) => setValue("fuelType", value as FuelType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(fuelTypeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.fuelType && (
            <p className="text-sm text-destructive">
              {errors.fuelType.message}
            </p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="meterReadingBefore">
              Meter Reading Before Loading (L)
            </Label>
            <Input
              id="meterReadingBefore"
              type="number"
              step="0.01"
              placeholder="0"
              {...register("meterReadingBefore", { valueAsNumber: true })}
            />
            {errors.meterReadingBefore && (
              <p className="text-sm text-destructive">
                {errors.meterReadingBefore.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="meterReadingAfter">
              Meter Reading After Loading (L)
            </Label>
            <Input
              id="meterReadingAfter"
              type="number"
              step="0.01"
              placeholder="0"
              {...register("meterReadingAfter", { valueAsNumber: true })}
            />
            {errors.meterReadingAfter && (
              <p className="text-sm text-destructive">
                {errors.meterReadingAfter.message}
              </p>
            )}
          </div>
        </div>

        {/* Quantity Display */}
        {meterBefore > 0 && meterAfter > 0 && (
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="font-medium">Quantity to Transfer:</span>
              </div>
              <Badge
                variant={quantityTransferred > 0 ? "default" : "destructive"}
                className="text-lg px-3 py-1"
              >
                {quantityTransferred > 0
                  ? `${quantityTransferred.toLocaleString()} L`
                  : "Invalid readings"}
              </Badge>
            </div>
            {quantityTransferred <= 0 && (
              <p className="text-sm text-destructive mt-2">
                Meter reading after loading must be greater than before loading
              </p>
            )}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="vehicleNumber">Vehicle Number (Optional)</Label>
            <Input
              id="vehicleNumber"
              placeholder="UAX 123A"
              {...register("vehicleNumber")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="driverName">Driver Name (Optional)</Label>
            <Input
              id="driverName"
              placeholder="Enter driver name"
              {...register("driverName")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any additional notes about this transfer..."
            {...register("notes")}
            rows={3}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={createMutation.isPending || quantityTransferred <= 0}
        >
          {createMutation.isPending
            ? "Initiating Transfer..."
            : "Initiate Transfer"}
        </Button>
      </form>
    </div>
  );
}
