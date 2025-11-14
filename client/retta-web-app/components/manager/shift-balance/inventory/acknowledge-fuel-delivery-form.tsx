"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockAcknowledgeFuelDelivery } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2 } from "lucide-react";
import { FuelDelivery, AcknowledgeFuelFormData } from "@/lib/types";

const acknowledgeFuelSchema = z.object({
  deliveryId: z.string().min(1, "Please select a delivery"),
  actualQuantityReceived: z
    .number()
    .min(1, "Actual quantity must be greater than 0"),
  supplierName: z.string().min(2, "Supplier name is required"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof acknowledgeFuelSchema>;

interface AcknowledgeFuelDeliveryFormProps {
  userId: string;
  branchId: string;
  pendingDeliveries: FuelDelivery[];
}

export function AcknowledgeFuelDeliveryForm({
  userId,
  branchId,
  pendingDeliveries,
}: AcknowledgeFuelDeliveryFormProps) {
  const [successMessage, setSuccessMessage] = useState("");
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(acknowledgeFuelSchema),
  });

  const selectedDeliveryId = watch("deliveryId");
  const selectedDelivery = pendingDeliveries.find(
    (d) => d.id === selectedDeliveryId
  );

  const acknowledgeMutation = useMutation({
    mutationFn: (data: AcknowledgeFuelFormData & { deliveryId: string }) => {
      const { deliveryId, ...formData } = data;
      return mockAcknowledgeFuelDelivery(deliveryId, formData, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-deliveries"] });
      setSuccessMessage("Fuel delivery acknowledged successfully!");
      reset();
      setTimeout(() => setSuccessMessage(""), 5000);
    },
  });

  const onSubmit = (data: FormData) => {
    acknowledgeMutation.mutate(data);
  };

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

      <Card>
        <CardHeader>
          <CardTitle>Acknowledge Fuel Delivery</CardTitle>
          <CardDescription>
            Record received fuel delivery with supplier information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="deliveryId">Select Delivery</Label>
                <Select
                  value={watch("deliveryId")}
                  onValueChange={(value) => setValue("deliveryId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a pending delivery" />
                  </SelectTrigger>
                  <SelectContent>
                    {pendingDeliveries.length > 0 ? (
                      pendingDeliveries.map((delivery) => (
                        <SelectItem key={delivery.id} value={delivery.id}>
                          {delivery.fuelType.toUpperCase()} -{" "}
                          {delivery.quantityLiters.toLocaleString()}L (
                          {new Date(delivery.deliveryDate).toLocaleDateString()}
                          )
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No pending deliveries
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.deliveryId && (
                  <p className="text-sm text-destructive">
                    {errors.deliveryId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplierName">Supplier Name</Label>
                <Input
                  id="supplierName"
                  placeholder="e.g., Total Uganda, Shell"
                  {...register("supplierName")}
                />
                {errors.supplierName && (
                  <p className="text-sm text-destructive">
                    {errors.supplierName.message}
                  </p>
                )}
              </div>
            </div>

            {selectedDelivery && (
              <div className="p-4 rounded-lg bg-muted space-y-2">
                <h4 className="font-medium">Delivery Details</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fuel Type:</span>
                    <span className="font-medium capitalize">
                      {selectedDelivery.fuelType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Expected Quantity:
                    </span>
                    <span className="font-medium">
                      {selectedDelivery.quantityLiters.toLocaleString()} L
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Cost:</span>
                    <span className="font-medium">
                      UGX {selectedDelivery.totalCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="actualQuantityReceived">
                  Actual Quantity Received (L)
                </Label>
                <Input
                  id="actualQuantityReceived"
                  type="number"
                  step="0.01"
                  placeholder="1000.00"
                  {...register("actualQuantityReceived", {
                    valueAsNumber: true,
                  })}
                />
                {errors.actualQuantityReceived && (
                  <p className="text-sm text-destructive">
                    {errors.actualQuantityReceived.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about the delivery..."
                rows={3}
                {...register("notes")}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={acknowledgeMutation.isPending || !selectedDeliveryId}
            >
              {acknowledgeMutation.isPending
                ? "Acknowledging..."
                : "Acknowledge Receipt"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
