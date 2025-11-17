"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { mockGetDashboardData } from "@/lib/api";
import {
  SalesFilters,
  SalesSummaryCard,
  SalesTable,
} from "@/components/admin-dashboard/reports/sales";
import {
  BranchesSalesChart,
  RevenueByFuelChart,
} from "@/components/admin-dashboard";

// Mock data - replace with actual API call
const mockSales = [
  {
    id: "1",
    branchName: "Downtown Station",
    fuelType: "Petrol",
    volumeSold: 1500.5,
    pricePerLiter: 1.45,
    totalAmount: 2175.73,
    date: "2024-11-10",
  },
  {
    id: "2",
    branchName: "Airport Station",
    fuelType: "Diesel",
    volumeSold: 2300.75,
    pricePerLiter: 1.55,
    totalAmount: 3566.16,
    date: "2024-11-10",
  },
  {
    id: "3",
    branchName: "Downtown Station",
    fuelType: "Premium",
    volumeSold: 800.0,
    pricePerLiter: 1.75,
    totalAmount: 1400.0,
    date: "2024-11-11",
  },
  {
    id: "4",
    branchName: "Highway Station",
    fuelType: "Petrol",
    volumeSold: 1800.25,
    pricePerLiter: 1.45,
    totalAmount: 2610.36,
    date: "2024-11-11",
  },
  {
    id: "5",
    branchName: "Airport Station",
    fuelType: "Premium",
    volumeSold: 950.0,
    pricePerLiter: 1.75,
    totalAmount: 1662.5,
    date: "2024-11-12",
  },
  {
    id: "6",
    branchName: "Highway Station",
    fuelType: "Diesel",
    volumeSold: 2100.5,
    pricePerLiter: 1.55,
    totalAmount: 3255.78,
    date: "2024-11-12",
  },
];

export default function SalesReportsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SalesReportsContent />
    </Suspense>
  );
}

function SalesReportsContent() {
  const searchParams = useSearchParams();

  // Fetch dashboard data for charts
  const { data: stats } = useQuery({
    queryKey: ["dashboard", "admin"],
    queryFn: () => mockGetDashboardData("admin"),
  });

  // Get filter values from URL
  const selectedBranch = searchParams.get("branch") || "all";
  const selectedFuelType = searchParams.get("fuelType") || "all";
  const startDate = searchParams.get("start") || "";
  const endDate = searchParams.get("end") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Filter sales
  const filteredSales = mockSales.filter((sale) => {
    const matchesBranch =
      selectedBranch === "all" || sale.branchName === selectedBranch;
    const matchesFuelType =
      selectedFuelType === "all" || sale.fuelType === selectedFuelType;

    // Date range filter
    const saleDate = new Date(sale.date);
    const matchesStartDate = !startDate || saleDate >= new Date(startDate);
    const matchesEndDate = !endDate || saleDate <= new Date(endDate);

    return (
      matchesBranch && matchesFuelType && matchesStartDate && matchesEndDate
    );
  });

  // Calculate totals
  const totalRevenue = filteredSales.reduce(
    (sum, sale) => sum + sale.totalAmount,
    0
  );
  const totalVolume = filteredSales.reduce(
    (sum, sale) => sum + sale.volumeSold,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          Sales Reports
        </h1>
        <p className="text-muted-foreground">
          View and analyze sales data across all branches
        </p>
      </div>

      {/* Filters and Summary Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <SalesFilters resultCount={filteredSales.length} />
        <SalesSummaryCard
          totalRevenue={totalRevenue}
          totalVolume={totalVolume}
        />
      </div>

      {/* Sales Table */}
      <SalesTable sales={filteredSales} currentPage={currentPage} />

      {/* Charts Row */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2">
          <RevenueByFuelChart revenueByFuelType={stats.revenueByFuelType} />
          <BranchesSalesChart branches={stats.topPerformingBranches} />
        </div>
      )}
    </div>
  );
}
