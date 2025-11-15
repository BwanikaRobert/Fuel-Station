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
import { DollarSign, Building2, Calendar } from "lucide-react";
import { Pagination } from "../pagination";

interface Expense {
  id: string;
  branchName: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  recordedByName: string;
}

interface ExpensesTableProps {
  expenses: Expense[];
  currentPage: number;
  itemsPerPage?: number;
}

export function ExpensesTable({
  expenses,
  currentPage,
  itemsPerPage = 10,
}: ExpensesTableProps) {
  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case "utilities":
        return "default";
      case "salaries":
        return "secondary";
      case "maintenance":
        return "outline";
      case "supplies":
        return "default";
      case "other":
        return "secondary";
      default:
        return "outline";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Pagination logic
  const totalPages = Math.ceil(expenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedExpenses = expenses.slice(startIndex, endIndex);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses Data</CardTitle>
        <CardDescription>Detailed breakdown of all expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Recorded By</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(expense.date)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{expense.branchName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getCategoryBadgeVariant(expense.category)}>
                    {expense.category.charAt(0).toUpperCase() +
                      expense.category.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {expense.recordedByName}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(expense.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={expenses.length}
          itemsPerPage={itemsPerPage}
        />

        {/* Empty State */}
        {expenses.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No expenses found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
