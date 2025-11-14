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
}

interface RecordShiftBalanceFormProps {
  pumps: FuelPump[];
  userId: string;
  branchId: string;
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
      .map(([pumpId, closingMeter]) => ({
        pumpId,
        closingMeter,
      }));

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

        {/* Pumps Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pump</TableHead>
                <TableHead>Fuel Type</TableHead>
                <TableHead>Attendant</TableHead>
                <TableHead className="text-right">Opening Meter (L)</TableHead>
                <TableHead className="text-right">Closing Meter (L)</TableHead>
                <TableHead className="text-right">Volume Sold (L)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pumps.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
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
                    <TableCell className="text-sm">
                      {pump.attendantName || (
                        <span className="text-muted-foreground">
                          Not assigned
                        </span>
                      )}
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
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
