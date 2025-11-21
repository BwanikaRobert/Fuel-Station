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
import { FuelTransfer } from "@/lib/types";
import { ArrowRight } from "lucide-react";

interface TransferHistoryTableProps {
  transfers: FuelTransfer[];
}

const fuelTypeLabels: Record<string, string> = {
  gasoline: "Petrol",
  diesel: "Diesel",
  kerosene: "Kerosene",
};

const statusColors: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "secondary",
  "in-transit": "default",
  completed: "outline",
  cancelled: "destructive",
};

export function TransferHistoryTable({ transfers }: TransferHistoryTableProps) {
  if (transfers.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">No fuel transfers recorded yet</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Transfer Route</TableHead>
            <TableHead>Fuel Type</TableHead>
            <TableHead className="text-right">Quantity (L)</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transfers.map((transfer) => (
            <TableRow key={transfer.id}>
              <TableCell className="font-medium">
                {new Date(transfer.transferDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{transfer.fromBranchName}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{transfer.toBranchName}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {fuelTypeLabels[transfer.fuelType]}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-semibold">
                {transfer.quantityTransferred.toLocaleString()}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {transfer.vehicleNumber || "-"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={statusColors[transfer.status]}
                  className="capitalize"
                >
                  {transfer.status.replace("-", " ")}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
