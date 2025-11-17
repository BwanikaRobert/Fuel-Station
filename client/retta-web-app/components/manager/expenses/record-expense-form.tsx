"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockCreateExpense } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, Plus, Trash2, Save } from "lucide-react";
import { ExpenseFormData } from "@/lib/types";

const expenseSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(3, "Description must be at least 3 characters"),
});

const expenseCategories = [
  { value: "utilities", label: "Utilities" },
  { value: "salaries", label: "Salaries" },
  { value: "maintenance", label: "Maintenance" },
  { value: "supplies", label: "Supplies" },
  { value: "other", label: "Other" },
];

interface ExpenseItem extends ExpenseFormData {
  id: string;
}

interface RecordExpenseFormProps {
  userId: string;
  branchId: string;
  onSuccess?: () => void;
}

const truncateText = (text: string, maxLength: number = 15): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export function RecordExpenseForm({
  userId,
  branchId,
  onSuccess,
}: RecordExpenseFormProps) {
  const [successMessage, setSuccessMessage] = useState("");
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Omit<ExpenseFormData, "date">>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      category: "",
      description: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (expensesList: ExpenseItem[]) => {
      // Save all expenses with the same date
      const promises = expensesList.map((expense) =>
        mockCreateExpense(
          {
            date: expense.date,
            amount: expense.amount,
            category: expense.category,
            description: expense.description,
          },
          userId,
          branchId
        )
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setSuccessMessage(`${expenses.length} expense(s) recorded successfully!`);
      setExpenses([]);
      setDate(new Date().toISOString().split("T")[0]);
      reset({
        amount: 0,
        category: "",
        description: "",
      });
      setTimeout(() => setSuccessMessage(""), 5000);
      onSuccess?.();
    },
  });

  const onAddExpense = (data: Omit<ExpenseFormData, "date">) => {
    const newExpense: ExpenseItem = {
      id: `temp-${Date.now()}`,
      date,
      amount: data.amount,
      category: data.category,
      description: data.description,
    };
    setExpenses([...expenses, newExpense]);
    reset({
      amount: 0,
      category: "",
      description: "",
    });
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  const handleSaveAll = () => {
    if (expenses.length > 0) {
      createMutation.mutate(expenses);
    }
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

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

      {/* Date Selection */}
      <div className="space-y-2">
        <Label htmlFor="expense-date">Date</Label>
        <Input
          id="expense-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          All expenses will be recorded for this date
        </p>
      </div>

      {/* Add Expense Form */}
      <form
        onSubmit={handleSubmit(onAddExpense)}
        className="space-y-4 rounded-lg"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (UGX)</Label>
            <Input
              id="amount"
              type="number"
              step="1"
              placeholder="150000"
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={watch("category")}
              onValueChange={(value) => setValue("category", value)}
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
            {errors.category && (
              <p className="text-sm text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="Enter description"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" variant="secondary">
          <Plus className="h-4 w-4 mr-2" />
          Add to List
        </Button>
      </form>

      {/* Expenses List */}
      {expenses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              Expenses to Record ({expenses.length})
            </h3>
            <Badge variant="outline" className="text-lg">
              Total: UGX {totalAmount.toLocaleString()}
            </Badge>
          </div>

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
                    <TableCell title={expense.description}>
                      {truncateText(expense.description)}
                    </TableCell>
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
            </Table>
          </div>

          <Button
            onClick={handleSaveAll}
            className="w-full"
            size="lg"
            disabled={createMutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {createMutation.isPending
              ? "Saving..."
              : `Save All ${expenses.length} Expense(s)`}
          </Button>
        </div>
      )}

      {expenses.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No expenses added yet. Use the form above to add expenses.</p>
        </div>
      )}
    </div>
  );
}
