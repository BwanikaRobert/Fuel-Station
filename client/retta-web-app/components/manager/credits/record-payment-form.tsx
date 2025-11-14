"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { CreditPaymentFormData, CreditSale } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const paymentSchema = z.object({
  amountPaid: z.number().min(1, "Payment amount must be greater than 0"),
  paymentDate: z.string().min(1, "Payment date is required"),
  notes: z.string().optional(),
});

interface RecordPaymentFormProps {
  credit: CreditSale;
  userId: string;
  onSuccess?: () => void;
}

export function RecordPaymentForm({
  credit,
  userId,
  onSuccess,
}: RecordPaymentFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Omit<CreditPaymentFormData, "creditSaleId">>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentDate: new Date().toISOString().split("T")[0],
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<CreditPaymentFormData, "creditSaleId">) => {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newAmountPaid = credit.amountPaid + data.amountPaid;
      const newAmountRemaining = credit.totalAmount - newAmountPaid;
      const newStatus =
        newAmountRemaining <= 0
          ? "settled"
          : newAmountPaid > 0
          ? "partially_paid"
          : "unpaid";

      return {
        ...credit,
        amountPaid: newAmountPaid,
        amountRemaining: Math.max(0, newAmountRemaining),
        status: newStatus,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credit-sales"] });
      toast.success("Payment recorded successfully!", {
        description: "The payment has been added to the credit account.",
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error("Failed to record payment", {
        description: error.message || "Please try again later.",
      });
    },
  });

  const onSubmit = (data: Omit<CreditPaymentFormData, "creditSaleId">) => {
    if (data.amountPaid > credit.amountRemaining) {
      toast.error("Payment amount exceeds remaining balance", {
        description: `Maximum payment amount is UGX ${credit.amountRemaining.toLocaleString()}`,
      });
      return;
    }
    createMutation.mutate(data);
  };

  const amountPaid = watch("amountPaid") || 0;
  const newAmountRemaining = Math.max(0, credit.amountRemaining - amountPaid);
  const willBeSettled = newAmountRemaining <= 0;

  return (
    <div className="space-y-6">
      {/* Credit Summary */}
      <div className="rounded-lg bg-muted p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Debtor:</span>
          <span className="font-medium">{credit.debtorName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Amount:</span>
          <span className="font-semibold">
            UGX {credit.totalAmount.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Already Paid:</span>
          <span className="text-green-600 font-medium">
            UGX {credit.amountPaid.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm border-t pt-2">
          <span className="text-muted-foreground">Amount Remaining:</span>
          <span className="font-bold text-destructive">
            UGX {credit.amountRemaining.toLocaleString()}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Payment Amount */}
          <div className="space-y-2">
            <Label htmlFor="amountPaid">Payment Amount (UGX) *</Label>
            <Input
              id="amountPaid"
              type="number"
              step="1"
              placeholder={`Max: ${credit.amountRemaining.toLocaleString()}`}
              {...register("amountPaid", { valueAsNumber: true })}
            />
            {errors.amountPaid && (
              <p className="text-sm text-destructive">
                {errors.amountPaid.message}
              </p>
            )}
          </div>

          {/* Payment Date */}
          <div className="space-y-2">
            <Label htmlFor="paymentDate">Payment Date *</Label>
            <Input id="paymentDate" type="date" {...register("paymentDate")} />
            {errors.paymentDate && (
              <p className="text-sm text-destructive">
                {errors.paymentDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Payment Preview */}
        {amountPaid > 0 && (
          <div className="rounded-lg bg-primary/10 p-4 space-y-3">
            <p className="text-sm font-medium">Payment Summary</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Payment Amount:</p>
                <p className="text-lg font-bold">
                  UGX {amountPaid.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">New Remaining Balance:</p>
                <p className="text-lg font-bold text-destructive">
                  UGX {newAmountRemaining.toLocaleString()}
                </p>
              </div>
            </div>
            {willBeSettled && (
              <div className="border-t pt-3">
                <Badge variant="default" className="bg-green-600">
                  ✓ This payment will settle the debt
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Payment Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Add any notes about this payment..."
            rows={3}
            {...register("notes")}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="min-w-[150px]"
          >
            {createMutation.isPending ? "Recording..." : "Record Payment"}
          </Button>
        </div>
      </form>
    </div>
  );
}
