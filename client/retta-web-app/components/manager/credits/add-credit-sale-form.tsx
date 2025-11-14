"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { CreditSaleFormData, FuelType } from "@/lib/types";

const creditSaleSchema = z.object({
  debtorName: z.string().min(2, "Name must be at least 2 characters"),
  debtorPhone: z.string().optional(),
  fuelType: z.enum(["gasoline", "diesel", "kerosene"], {
    message: "Please select a fuel type",
  }),
  quantityLiters: z.number().min(1, "Quantity must be greater than 0"),
  pricePerLiter: z.number().min(1, "Price must be greater than 0"),
  saleDate: z.string().min(1, "Sale date is required"),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
});

interface AddCreditSaleFormProps {
  userId: string;
  branchId: string;
  onSuccess?: () => void;
}

export function AddCreditSaleForm({
  userId,
  branchId,
  onSuccess,
}: AddCreditSaleFormProps) {
  const [selectedFuelType, setSelectedFuelType] = useState<string>("");
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreditSaleFormData>({
    resolver: zodResolver(creditSaleSchema),
    defaultValues: {
      saleDate: new Date().toISOString().split("T")[0],
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreditSaleFormData) => {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const totalAmount = data.quantityLiters * data.pricePerLiter;
      return {
        id: `credit-${Date.now()}`,
        branchId,
        debtorName: data.debtorName,
        debtorPhone: data.debtorPhone,
        fuelType: data.fuelType,
        quantityLiters: data.quantityLiters,
        pricePerLiter: data.pricePerLiter,
        totalAmount,
        amountPaid: 0,
        amountRemaining: totalAmount,
        status: "unpaid" as const,
        saleDate: data.saleDate,
        dueDate: data.dueDate,
        recordedBy: userId,
        notes: data.notes,
        createdAt: new Date().toISOString(),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credit-sales"] });
      toast.success("Credit sale recorded successfully!", {
        description: "The credit transaction has been added to your records.",
      });
      reset();
      setSelectedFuelType("");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error("Failed to record credit sale", {
        description: error.message || "Please try again later.",
      });
    },
  });

  const onSubmit = (data: CreditSaleFormData) => {
    createMutation.mutate(data);
  };

  const quantityLiters = watch("quantityLiters") || 0;
  const pricePerLiter = watch("pricePerLiter") || 0;
  const totalAmount = quantityLiters * pricePerLiter;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Debtor Name */}
        <div className="space-y-2">
          <Label htmlFor="debtorName">Debtor Name *</Label>
          <Input
            id="debtorName"
            placeholder="e.g., John Doe"
            {...register("debtorName")}
          />
          {errors.debtorName && (
            <p className="text-sm text-destructive">
              {errors.debtorName.message}
            </p>
          )}
        </div>

        {/* Debtor Phone */}
        <div className="space-y-2">
          <Label htmlFor="debtorPhone">Phone Number (Optional)</Label>
          <Input
            id="debtorPhone"
            type="tel"
            placeholder="e.g., +256 700 000000"
            {...register("debtorPhone")}
          />
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
            step="0.01"
            placeholder="e.g., 50"
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
          <Label htmlFor="pricePerLiter">Price per Liter (UGX) *</Label>
          <Input
            id="pricePerLiter"
            type="number"
            step="1"
            placeholder="e.g., 5850"
            {...register("pricePerLiter", { valueAsNumber: true })}
          />
          {errors.pricePerLiter && (
            <p className="text-sm text-destructive">
              {errors.pricePerLiter.message}
            </p>
          )}
        </div>

        {/* Sale Date */}
        <div className="space-y-2">
          <Label htmlFor="saleDate">Sale Date *</Label>
          <Input id="saleDate" type="date" {...register("saleDate")} />
          {errors.saleDate && (
            <p className="text-sm text-destructive">
              {errors.saleDate.message}
            </p>
          )}
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date (Optional)</Label>
          <Input id="dueDate" type="date" {...register("dueDate")} />
        </div>
      </div>

      {/* Total Amount Preview */}
      {totalAmount > 0 && (
        <div className="rounded-lg bg-primary/10 p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Amount:</span>
            <span className="text-2xl font-bold text-primary">
              UGX {totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Add any special notes or conditions..."
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
          }}
          disabled={createMutation.isPending}
        >
          Clear Form
        </Button>
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Recording..." : "Record Credit Sale"}
        </Button>
      </div>
    </form>
  );
}
