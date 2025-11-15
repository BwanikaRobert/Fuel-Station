"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FuelDelivery } from "@/lib/types";
import { Package, CheckCircle2 } from "lucide-react";

interface DeliveriesTableProps {
  deliveries: FuelDelivery[];
}

const fuelTypeLabels: Record<string, string> = {
  gasoline: "Petrol",
  diesel: "Diesel",
  kerosene: "Kerosene",
};

export function DeliveriesTable({ deliveries }: DeliveriesTableProps) {
  if (deliveries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-muted/10">
        <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">No deliveries found</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Branch</TableHead>
            <TableHead>Fuel Type</TableHead>
            <TableHead className="text-right">Quantity (L)</TableHead>
            <TableHead className="text-right">Price/L</TableHead>
            <TableHead className="text-right">Total Cost</TableHead>
            <TableHead>Delivery Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveries.map((delivery) => (
            <TableRow key={delivery.id}>
              <TableCell className="font-medium">
                {delivery.toBranchName}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {fuelTypeLabels[delivery.fuelType]}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {delivery.quantityLiters.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                UGX {delivery.pricePerLiter.toLocaleString()}
              </TableCell>
              <TableCell className="text-right font-semibold">
                UGX {delivery.totalCost.toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(delivery.deliveryDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {delivery.status === "pending" ? (
                  <Badge variant="secondary" className="gap-1">
                    <Package className="h-3 w-3" />
                    Pending
                  </Badge>
                ) : (
                  <Badge variant="default" className="gap-1 bg-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    Acknowledged
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {delivery.createdByName}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
