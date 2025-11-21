"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockCreateShiftBalance, mockCreateExpense } from "@/lib/api";
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
import { FuelPump, ShiftType, ExpenseFormData } from "@/lib/types";
import { Plus, Trash2, DollarSign } from "lucide-react";

interface PumpReading {
  pumpId: string;
  closingMeter: number;
  pricePerLiter: number;
}

interface ExpenseItem {
  id: string;
  amount: number;
  category: string;
  description: string;
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

const expenseCategories = [
  { value: "utilities", label: "Utilities" },
  { value: "salaries", label: "Salaries" },
  { value: "maintenance", label: "Maintenance" },
  { value: "supplies", label: "Supplies" },
  { value: "other", label: "Other" },
];

export function RecordShiftBalanceForm({
  pumps,
  userId,
  branchId,
  fuelPrices = { gasoline: 5500, diesel: 5200, kerosene: 4800 },
}: RecordShiftBalanceFormProps) {
  const [shiftType, setShiftType] = useState<ShiftType>("morning");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [pumpReadings, setPumpReadings] = useState<Record<string, number>>({});
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (readings: PumpReading[]) => {
      // Create shift balance for each pump reading
      const shiftPromises = readings.map((reading) =>
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

      // Create expenses if any
      const expensePromises = expenses.map((expense) =>
        mockCreateExpense(
          {
            date,
            amount: expense.amount,
            category: expense.category,
            description: expense.description,
          },
          userId,
          branchId
        )
      );

      return Promise.all([...shiftPromises, ...expensePromises]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shift-balances"] });
      queryClient.invalidateQueries({ queryKey: ["pumps"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Shift balances and expenses recorded successfully!", {
        description: `${shiftType} shift sales and ${expenses.length} expense(s) have been saved.`,
      });
      setPumpReadings({});
      setExpenses([]);
      setExpenseAmount("");
      setExpenseCategory("");
      setExpenseDescription("");
    },
    onError: (error: Error) => {
      toast.error("Failed to record shift data", {
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

  const calculateTotalExpenses = () => {
    return expenses.reduce((total, exp) => total + exp.amount, 0);
  };

  const calculateCashAtHand = () => {
    return calculateTotalSales() - calculateTotalExpenses();
  };

  const addExpense = () => {
    const amount = parseFloat(expenseAmount);
    if (!amount || amount <= 0) {
      toast.error("Invalid amount", {
        description: "Please enter a valid expense amount.",
      });
      return;
    }
    if (!expenseCategory) {
      toast.error("Category required", {
        description: "Please select an expense category.",
      });
      return;
    }
    if (!expenseDescription || expenseDescription.length < 3) {
      toast.error("Description required", {
        description: "Please enter a description (min 3 characters).",
      });
      return;
    }

    const newExpense: ExpenseItem = {
      id: `temp-${Date.now()}`,
      amount,
      category: expenseCategory,
      description: expenseDescription,
    };

    setExpenses([...expenses, newExpense]);
    setExpenseAmount("");
    setExpenseCategory("");
    setExpenseDescription("");
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
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

        {/* Expenses Section */}
        <div className="space-y-4 pt-6 border-t">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">Shift Expenses</h3>
          </div>

          {/* Add Expense Form */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="expense-amount">Amount (UGX)</Label>
              <Input
                id="expense-amount"
                type="number"
                step="1"
                placeholder="50000"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense-category">Category</Label>
              <Select
                value={expenseCategory}
                onValueChange={setExpenseCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense-description">Description</Label>
              <Input
                id="expense-description"
                placeholder="Enter description"
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="invisible">Action</Label>
              <Button
                type="button"
                onClick={addExpense}
                className="w-full"
                variant="secondary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </div>
          </div>

          {/* Expenses List */}
          {expenses.length > 0 && (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {expense.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell className="text-right font-medium">
                        UGX {expense.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExpense(expense.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <tfoot className="bg-muted/50 font-semibold">
                  <TableRow>
                    <TableCell colSpan={2} className="text-right">
                      Total Expenses:
                    </TableCell>
                    <TableCell className="text-right text-red-600 text-base">
                      UGX {calculateTotalExpenses().toLocaleString()}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </tfoot>
              </Table>
            </div>
          )}

          {/* Cash Summary */}
          {calculateTotalSales() > 0 && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Sales:</span>
                    <span className="text-lg font-bold text-green-600">
                      UGX {calculateTotalSales().toLocaleString()}
                    </span>
                  </div>
                  {expenses.length > 0 && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Total Expenses:
                        </span>
                        <span className="text-lg font-bold text-red-600">
                          UGX {calculateTotalExpenses().toLocaleString()}
                        </span>
                      </div>
                      <div className="pt-3 border-t border-primary/20">
                        <div className="flex justify-between items-center">
                          <span className="text-base font-semibold">
                            Cash at Hand (to be banked):
                          </span>
                          <span className="text-2xl font-bold text-primary">
                            UGX {calculateCashAtHand().toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setPumpReadings({});
              setExpenses([]);
            }}
            disabled={
              createMutation.isPending ||
              (Object.keys(pumpReadings).length === 0 && expenses.length === 0)
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
