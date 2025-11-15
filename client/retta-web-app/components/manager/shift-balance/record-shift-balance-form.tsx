"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockCreateShiftBalance } from "@/lib/api";
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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { FuelPump, ShiftType } from "@/lib/types";

interface PumpReading {
  pumpId: string;
  closingMeter: number;
  pricePerLiter: number;
}

interface RecordShiftBalanceFormProps {
  pumps: FuelPump[];
  userId: string;
  branchId: string;
  fuelPrices?: {
    gasoline: number;
    diesel: number;
    kerosene: number;
  };
}

const fuelTypeLabels: Record<string, string> = {
  gasoline: "Petrol",
  diesel: "Diesel",
  kerosene: "Kerosene",
};

export function RecordShiftBalanceForm({
  pumps,
  userId,
  branchId,
  fuelPrices = { gasoline: 5500, diesel: 5200, kerosene: 4800 },
}: RecordShiftBalanceFormProps) {
  const [shiftType, setShiftType] = useState<ShiftType>("morning");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [pumpReadings, setPumpReadings] = useState<Record<string, number>>({});
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (readings: PumpReading[]) => {
      // Create shift balance for each pump reading
      const promises = readings.map((reading) =>
        mockCreateShiftBalance(
          {
            pumpId: reading.pumpId,
            shiftType,
            closingMeter: reading.closingMeter,
            pricePerLiter: reading.pricePerLiter,
            date,
          },
          userId,
          branchId
        )
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shift-balances"] });
      queryClient.invalidateQueries({ queryKey: ["pumps"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Shift balances recorded successfully!", {
        description: `All pump readings for ${shiftType} shift have been saved.`,
      });
      setPumpReadings({});
    },
    onError: (error: Error) => {
      toast.error("Failed to record shift balances", {
        description: error.message || "Please try again later.",
      });
    },
  });

  const handleSubmit = () => {
    const readings: PumpReading[] = Object.entries(pumpReadings)
      .filter(([_, value]) => value > 0)
      .map(([pumpId, closingMeter]) => {
        const pump = pumps.find((p) => p.id === pumpId);
        return {
          pumpId,
          closingMeter,
          pricePerLiter: fuelPrices[pump?.fuelType || "gasoline"],
        };
      });

    if (readings.length === 0) {
      toast.error("No readings entered", {
        description:
          "Please enter closing meter readings for at least one pump.",
      });
      return;
    }

    createMutation.mutate(readings);
  };

  const updateReading = (pumpId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setPumpReadings((prev) => ({
      ...prev,
      [pumpId]: numValue,
    }));
  };

  const calculateVolumeSold = (pump: FuelPump) => {
    const closingMeter = pumpReadings[pump.id] || 0;
    if (closingMeter <= 0) return 0;
    return Math.max(0, closingMeter - pump.meterReading);
  };

  const calculateSalesAmount = (pump: FuelPump) => {
    const volumeSold = calculateVolumeSold(pump);
    const price = fuelPrices[pump.fuelType] || 0;
    return volumeSold * price;
  };

  const calculateTotalSales = () => {
    return pumps.reduce((total, pump) => {
      return total + calculateSalesAmount(pump);
    }, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Shift Balance</CardTitle>
        <CardDescription>
          Enter closing meter readings for all pumps at the end of the shift
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Shift Controls */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shiftType">Shift Type</Label>
            <Select
              value={shiftType}
              onValueChange={(value) => setShiftType(value as ShiftType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning Shift</SelectItem>
                <SelectItem value="evening">Evening Shift</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pump</TableHead>
                <TableHead>Fuel Type</TableHead>
                <TableHead className="text-right">Price/L (UGX)</TableHead>
                <TableHead className="text-right">Opening Meter (L)</TableHead>
                <TableHead className="text-right">Closing Meter (L)</TableHead>
                <TableHead className="text-right">Volume Sold (L)</TableHead>
                <TableHead className="text-right">Sales Amount (UGX)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pumps.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground"
                  >
                    No pumps available
                  </TableCell>
                </TableRow>
              ) : (
                pumps.map((pump) => (
                  <TableRow key={pump.id}>
                    <TableCell className="font-medium">
                      {pump.pumpName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {fuelTypeLabels[pump.fuelType]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium text-primary">
                      {fuelPrices[pump.fuelType].toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {pump.meterReading.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter closing"
                        value={pumpReadings[pump.id] || ""}
                        onChange={(e) => updateReading(pump.id, e.target.value)}
                        className="text-right"
                      />
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {calculateVolumeSold(pump) > 0 ? (
                        <span className="text-primary">
                          {calculateVolumeSold(pump).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {calculateSalesAmount(pump) > 0 ? (
                        <span className="text-green-600">
                          {calculateSalesAmount(pump).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            {pumps.length > 0 && (
              <tfoot className="bg-muted/50 font-semibold">
                <TableRow>
                  <TableCell colSpan={5} className="text-right">
                    Total Sales:
                  </TableCell>
                  <TableCell className="text-right">
                    {pumps
                      .reduce(
                        (total, pump) => total + calculateVolumeSold(pump),
                        0
                      )
                      .toLocaleString()}{" "}
                    L
                  </TableCell>
                  <TableCell className="text-right text-green-600 text-lg font-bold">
                    UGX {calculateTotalSales().toLocaleString()}
                  </TableCell>
                </TableRow>
              </tfoot>
            )}
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {pumps.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pumps available
            </div>
          ) : (
            <>
              {pumps.map((pump) => (
                <Card key={pump.id} className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-base">
                        {pump.pumpName}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {fuelTypeLabels[pump.fuelType]}
                      </Badge>
                    </div>

                    {/* Price */}
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-xs text-muted-foreground">
                        Price per Liter
                      </span>
                      <span className="font-medium text-primary text-sm">
                        UGX {fuelPrices[pump.fuelType].toLocaleString()}
                      </span>
                    </div>

                    {/* Opening Meter */}
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-xs text-muted-foreground">
                        Opening Meter
                      </span>
                      <span className="font-medium text-sm">
                        {pump.meterReading.toLocaleString()} L
                      </span>
                    </div>

                    {/* Closing Meter Input */}
                    <div className="space-y-2">
                      <Label htmlFor={`closing-${pump.id}`} className="text-xs">
                        Closing Meter (L)
                      </Label>
                      <Input
                        id={`closing-${pump.id}`}
                        type="number"
                        step="0.01"
                        placeholder="Enter closing meter"
                        value={pumpReadings[pump.id] || ""}
                        onChange={(e) => updateReading(pump.id, e.target.value)}
                        className="text-right text-base"
                      />
                    </div>

                    {/* Calculated Values */}
                    {pumpReadings[pump.id] && calculateVolumeSold(pump) > 0 && (
                      <div className="pt-3 mt-3 border-t space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium">
                            Volume Sold
                          </span>
                          <span className="text-primary font-semibold text-sm">
                            {calculateVolumeSold(pump).toLocaleString()} L
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium">
                            Sales Amount
                          </span>
                          <span className="text-green-600 font-bold text-base">
                            UGX {calculateSalesAmount(pump).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}

              {/* Total Sales Card */}
              {pumps.length > 0 && calculateTotalSales() > 0 && (
                <Card className="p-4 bg-muted/50">
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-muted-foreground">
                      TOTAL SALES
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">Total Volume</span>
                      <span className="text-primary font-semibold text-base">
                        {pumps
                          .reduce(
                            (total, pump) => total + calculateVolumeSold(pump),
                            0
                          )
                          .toLocaleString()}{" "}
                        L
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-semibold text-sm">
                        Total Amount
                      </span>
                      <span className="text-green-600 font-bold text-xl">
                        UGX {calculateTotalSales().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Card>
              )}
            </>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPumpReadings({})}
            disabled={
              createMutation.isPending || Object.keys(pumpReadings).length === 0
            }
          >
            Clear All
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              createMutation.isPending || Object.keys(pumpReadings).length === 0
            }
          >
            {createMutation.isPending ? "Recording..." : "Record Shift Balance"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
