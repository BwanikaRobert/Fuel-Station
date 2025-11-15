"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockCreateFuelDelivery } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { FuelDeliveryFormData, Branch, FuelType } from "@/lib/types";

const deliverySchema = z.object({
  toBranchId: z.string().min(1, "Please select a branch"),
  fuelType: z.enum(["gasoline", "diesel", "kerosene"], {
    message: "Please select a fuel type",
  }),
  quantityLiters: z.number().min(1, "Quantity must be greater than 0"),
  pricePerLiter: z.number().min(1, "Price must be greater than 0"),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  notes: z.string().optional(),
});

interface CreateDeliveryFormProps {
  branches: Branch[];
  onSuccess?: () => void;
}

export function CreateDeliveryForm({
  branches,
  onSuccess,
}: CreateDeliveryFormProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedFuelType, setSelectedFuelType] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FuelDeliveryFormData>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      deliveryDate: new Date().toISOString().split("T")[0],
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: FuelDeliveryFormData) =>
      mockCreateFuelDelivery(data, user?.id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-deliveries"] });
      toast.success("Fuel delivery note created successfully!", {
        description: "Branch manager will be notified to acknowledge receipt.",
      });
      reset();
      setSelectedFuelType("");
      setSelectedBranch("");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error("Failed to create delivery note", {
        description: error.message || "Please try again later.",
      });
    },
  });

  const onSubmit = (data: FuelDeliveryFormData) => {
    createMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Branch Selection */}
        <div className="space-y-2">
          <Label htmlFor="toBranchId">Destination Branch *</Label>
          <Select
            value={selectedBranch}
            onValueChange={(value) => {
              setSelectedBranch(value);
              setValue("toBranchId", value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
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

        {/* Fuel Type */}
        <div className="space-y-2">
          <Label htmlFor="fuelType">Fuel Type *</Label>
          <Select
            value={selectedFuelType}
            onValueChange={(value) => {
              setSelectedFuelType(value);
              setValue("fuelType", value as FuelType);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gasoline">Petrol</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="kerosene">Kerosene</SelectItem>
            </SelectContent>
          </Select>
          {errors.fuelType && (
            <p className="text-sm text-destructive">
              {errors.fuelType.message}
            </p>
          )}
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <Label htmlFor="quantityLiters">Quantity (Liters) *</Label>
          <Input
            id="quantityLiters"
            type="number"
            step="1"
            placeholder="e.g., 10000"
            {...register("quantityLiters", { valueAsNumber: true })}
          />
          {errors.quantityLiters && (
            <p className="text-sm text-destructive">
              {errors.quantityLiters.message}
            </p>
          )}
        </div>

        {/* Price Per Liter */}
        <div className="space-y-2">
          <Label htmlFor="pricePerLiter">Buying Price per Liter (UGX) *</Label>
          <Input
            id="pricePerLiter"
            type="number"
            step="1"
            placeholder="e.g., 5000"
            {...register("pricePerLiter", { valueAsNumber: true })}
          />
          {errors.pricePerLiter && (
            <p className="text-sm text-destructive">
              {errors.pricePerLiter.message}
            </p>
          )}
        </div>

        {/* Delivery Date */}
        <div className="space-y-2">
          <Label htmlFor="deliveryDate">Expected Delivery Date *</Label>
          <Input id="deliveryDate" type="date" {...register("deliveryDate")} />
          {errors.deliveryDate && (
            <p className="text-sm text-destructive">
              {errors.deliveryDate.message}
            </p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Add any special instructions or notes..."
          rows={3}
          {...register("notes")}
        />
      </div>

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset();
            setSelectedFuelType("");
            setSelectedBranch("");
          }}
          disabled={createMutation.isPending}
        >
          Clear Form
        </Button>
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Creating..." : "Create Delivery Note"}
        </Button>
      </div>
    </form>
  );
}
