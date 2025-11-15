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
import { IdCard, Building2, Calendar, User, Fuel } from "lucide-react";
import { Pagination } from "../pagination";

interface Credit {
  id: string;
  branchName: string;
  debtorName: string;
  fuelType: string;
  amount: number;
  amountPaid: number;
  amountRemaining: number;
  status: "unpaid" | "partially-paid" | "settled";
  date: string;
}

interface CreditsTableProps {
  credits: Credit[];
  currentPage: number;
  itemsPerPage?: number;
}

export function CreditsTable({
  credits,
  currentPage,
  itemsPerPage = 10,
}: CreditsTableProps) {
  const getStatusBadgeVariant = (
    status: "unpaid" | "partially-paid" | "settled"
  ) => {
    switch (status) {
      case "unpaid":
        return "destructive";
      case "partially-paid":
        return "default";
      case "settled":
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

  const formatStatus = (status: string) => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Pagination logic
  const totalPages = Math.ceil(credits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCredits = credits.slice(startIndex, endIndex);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credits Data</CardTitle>
        <CardDescription>
          Detailed breakdown of all credit sales
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Debtor</TableHead>
              <TableHead>Fuel Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Paid</TableHead>
              <TableHead className="text-right">Remaining</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCredits.map((credit) => (
              <TableRow key={credit.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(credit.date)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{credit.branchName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{credit.debtorName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{credit.fuelType}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(credit.amount)}
                </TableCell>
                <TableCell className="text-right text-green-600">
                  {formatCurrency(credit.amountPaid)}
                </TableCell>
                <TableCell className="text-right font-medium text-amber-600">
                  {formatCurrency(credit.amountRemaining)}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(credit.status)}>
                    {formatStatus(credit.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={credits.length}
          itemsPerPage={itemsPerPage}
        />

        {/* Empty State */}
        {credits.length === 0 && (
          <div className="text-center py-12">
            <IdCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No credits found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
