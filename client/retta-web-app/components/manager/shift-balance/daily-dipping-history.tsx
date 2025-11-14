"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Droplet } from "lucide-react";
import { DailyDipping } from "@/lib/types";

interface DailyDippingHistoryProps {
  dippings: DailyDipping[];
}

export function DailyDippingHistory({ dippings }: DailyDippingHistoryProps) {
  if (dippings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Droplet className="h-5 w-5 text-primary" />
            <CardTitle>Daily Dipping History</CardTitle>
          </div>
          <CardDescription>Recent tank measurement records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <Droplet className="h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No dipping records found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-primary" />
          <CardTitle>Daily Dipping History</CardTitle>
        </div>
        <CardDescription>Recent tank measurement records</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Petrol (L)</TableHead>
                <TableHead className="text-right">Diesel (L)</TableHead>
                <TableHead className="text-right">Kerosene (L)</TableHead>
                <TableHead className="text-right">Total (L)</TableHead>
                <TableHead>Recorded By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dippings.map((dipping) => {
                const total =
                  dipping.gasolineLiters +
                  dipping.dieselLiters +
                  dipping.keroseneLiters;
                return (
                  <TableRow key={dipping.id}>
                    <TableCell className="font-medium">
                      {new Date(dipping.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {dipping.gasolineLiters.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {dipping.dieselLiters.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {dipping.keroseneLiters.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {total.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {dipping.recordedByName || "Unknown"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
