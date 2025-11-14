"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardList } from "lucide-react";
import { ShiftBalance } from "@/lib/types";

interface ShiftBalanceHistoryProps {
  shiftBalances: ShiftBalance[];
}

export function ShiftBalanceHistory({
  shiftBalances,
}: ShiftBalanceHistoryProps) {
  if (shiftBalances.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            <CardTitle>Shift Balance History</CardTitle>
          </div>
          <CardDescription>Recent shift balance records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <ClipboardList className="h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              No shift balance records found
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          <CardTitle>Shift Balance History</CardTitle>
        </div>
        <CardDescription>Recent shift balance records</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Pump</TableHead>
                <TableHead>Fuel Type</TableHead>
                <TableHead>Opening</TableHead>
                <TableHead>Closing</TableHead>
                <TableHead>Volume Sold</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shiftBalances?.map((balance) => (
                <TableRow key={balance.id}>
                  <TableCell>
                    {new Date(balance.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {balance.shiftType}
                    </Badge>
                  </TableCell>
                  <TableCell>{balance.pumpName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {balance.fuelType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {balance.openingMeter.toLocaleString()} L
                  </TableCell>
                  <TableCell>
                    {balance.closingMeter.toLocaleString()} L
                  </TableCell>
                  <TableCell>{balance.volumeSold.toLocaleString()} L</TableCell>
                  <TableCell className="text-right font-medium">
                    UGX {balance.totalAmount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
