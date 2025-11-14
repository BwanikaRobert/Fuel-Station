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
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { CreditSale } from "@/lib/types";

interface CreditsTableProps {
  credits: CreditSale[];
  onPayment?: (credit: CreditSale) => void;
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
  unpaid: "destructive",
  partially_paid: "secondary",
  settled: "default",
};

const statusLabels: Record<string, string> = {
  unpaid: "Unpaid",
  partially_paid: "Partially Paid",
  settled: "Settled",
};

export function CreditsTable({ credits, onPayment }: CreditsTableProps) {
  if (credits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-muted/10">
        <CreditCard className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">No credit sales found</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Debtor Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Fuel Type</TableHead>
            <TableHead className="text-right">Quantity (L)</TableHead>
            <TableHead className="text-right">Price/L</TableHead>
            <TableHead className="text-right">Total Amount</TableHead>
            <TableHead className="text-right">Amount Paid</TableHead>
            <TableHead className="text-right">Remaining</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sale Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {credits.map((credit) => (
            <TableRow key={credit.id}>
              <TableCell className="font-medium">{credit.debtorName}</TableCell>
              <TableCell className="text-sm">
                {credit.debtorPhone || (
                  <span className="text-muted-foreground">N/A</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {fuelTypeLabels[credit.fuelType]}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {credit.quantityLiters.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                UGX {credit.pricePerLiter.toLocaleString()}
              </TableCell>
              <TableCell className="text-right font-semibold">
                UGX {credit.totalAmount.toLocaleString()}
              </TableCell>
              <TableCell className="text-right text-green-600">
                UGX {credit.amountPaid.toLocaleString()}
              </TableCell>
              <TableCell className="text-right font-semibold text-destructive">
                UGX {credit.amountRemaining.toLocaleString()}
              </TableCell>
              <TableCell>
                <Badge variant={statusColors[credit.status]}>
                  {statusLabels[credit.status]}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(credit.saleDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {credit.status !== "settled" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onPayment?.(credit)}
                  >
                    Record Payment
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
