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
import { Badge } from "@/components/ui/badge";
import { Droplet, TrendingUp, TrendingDown } from "lucide-react";
import { DailyDipping, ShiftBalance, FuelType } from "@/lib/types";

interface DailyDippingHistoryProps {
  dippings: DailyDipping[];
  shiftBalances?: ShiftBalance[];
}

interface TankVariance {
  date: string;
  fuelType: FuelType;
  fuelTypeName: string;
  variance: number; // positive = gain, negative = loss
  openingStock: number;
  volumeSold: number;
  closingStock: number;
  expectedClosing: number;
}

export function DailyDippingHistory({
  dippings,
  shiftBalances = [],
}: DailyDippingHistoryProps) {
  // Calculate tank variances (gains/losses)
  const calculateVariances = (): TankVariance[] => {
    const variances: TankVariance[] = [];

    // Sort dippings by date
    const sortedDippings = [...dippings].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    for (let i = 1; i < sortedDippings.length; i++) {
      const previousDipping = sortedDippings[i - 1];
      const currentDipping = sortedDippings[i];
      const currentDate = currentDipping.date;

      // Get shift balances between these two dippings
      const shiftsInPeriod = shiftBalances.filter(
        (shift) =>
          shift.date === currentDate || shift.date === previousDipping.date
      );

      // Calculate for each fuel type
      const fuelTypes: Array<{
        type: FuelType;
        name: string;
        prev: number;
        curr: number;
      }> = [
        {
          type: "gasoline",
          name: "Petrol",
          prev: previousDipping.gasolineLiters,
          curr: currentDipping.gasolineLiters,
        },
        {
          type: "diesel",
          name: "Diesel",
          prev: previousDipping.dieselLiters,
          curr: currentDipping.dieselLiters,
        },
        {
          type: "kerosene",
          name: "Kerosene",
          prev: previousDipping.keroseneLiters,
          curr: currentDipping.keroseneLiters,
        },
      ];

      fuelTypes.forEach(({ type, name, prev, curr }) => {
        const volumeSold = shiftsInPeriod
          .filter((shift) => shift.fuelType === type)
          .reduce((sum, shift) => sum + shift.volumeSold, 0);

        const expectedClosing = prev - volumeSold;
        const variance = curr - expectedClosing;

        // Only add if there was activity or variance
        if (volumeSold > 0 || Math.abs(variance) > 0) {
          variances.push({
            date: currentDate,
            fuelType: type,
            fuelTypeName: name,
            variance,
            openingStock: prev,
            volumeSold,
            closingStock: curr,
            expectedClosing,
          });
        }
      });
    }

    return variances.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  const variances = calculateVariances();

  if (variances.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Tank Gains/Losses</CardTitle>
          </div>
          <CardDescription>Daily fuel variance analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <p className="text-muted-foreground">No variance records found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Record daily dippings to track tank gains and losses
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
          <CardTitle>Tank Gains/Losses</CardTitle>
        </div>
        <CardDescription>Daily fuel variance analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Opening (L)</TableHead>
                <TableHead className="text-right">Sold (L)</TableHead>
                <TableHead className="text-right">Expected (L)</TableHead>
                <TableHead className="text-right">Actual (L)</TableHead>
                <TableHead className="text-right">Variance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variances.map((variance, index) => {
                const isGain = variance.variance > 0;
                const isLoss = variance.variance < 0;
                const isNeutral = variance.variance === 0;

                return (
                  <TableRow
                    key={`${variance.date}-${variance.fuelType}-${index}`}
                  >
                    <TableCell className="font-medium">
                      {new Date(variance.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          variance.fuelType === "gasoline"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            : variance.fuelType === "diesel"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                        }
                      >
                        {variance.fuelTypeName}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {variance.openingStock.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {variance.volumeSold.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {variance.expectedClosing.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {variance.closingStock.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {isGain && (
                          <>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-green-600">
                              +{variance.variance.toLocaleString()} L
                            </span>
                          </>
                        )}
                        {isLoss && (
                          <>
                            <TrendingDown className="h-4 w-4 text-red-600" />
                            <span className="font-semibold text-red-600">
                              {variance.variance.toLocaleString()} L
                            </span>
                          </>
                        )}
                        {isNeutral && (
                          <span className="text-muted-foreground">0 L</span>
                        )}
                      </div>
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
