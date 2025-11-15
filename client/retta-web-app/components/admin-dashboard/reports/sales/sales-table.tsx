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
import { BarChart3, Building2, Calendar, Fuel } from "lucide-react";
import { Pagination } from "../pagination";

interface Sale {
  id: string;
  branchName: string;
  fuelType: string;
  volumeSold: number;
  pricePerLiter: number;
  totalAmount: number;
  date: string;
}

interface SalesTableProps {
  sales: Sale[];
  currentPage: number;
  itemsPerPage?: number;
}

export function SalesTable({
  sales,
  currentPage,
  itemsPerPage = 10,
}: SalesTableProps) {
  const getFuelTypeBadgeVariant = (fuelType: string) => {
    switch (fuelType) {
      case "Petrol":
        return "default";
      case "Diesel":
        return "secondary";
      case "Premium":
        return "outline";
      default:
        return "default";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatVolume = (volume: number) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(volume);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Pagination logic
  const totalPages = Math.ceil(sales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSales = sales.slice(startIndex, endIndex);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Data</CardTitle>
        <CardDescription>Detailed breakdown of all sales</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Fuel Type</TableHead>
              <TableHead className="text-right">Volume (L)</TableHead>
              <TableHead className="text-right">Price/L</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(sale.date)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{sale.branchName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getFuelTypeBadgeVariant(sale.fuelType)}>
                    <Fuel className="h-3 w-3 mr-1" />
                    {sale.fuelType}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm font-medium">
                    {formatVolume(sale.volumeSold)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(sale.pricePerLiter)}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(sale.totalAmount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sales.length}
          itemsPerPage={itemsPerPage}
        />

        {/* Empty State */}
        {sales.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No sales found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
