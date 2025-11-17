"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { mockGetBranches, mockGetDashboardData } from "@/lib/api";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Fuel, AlertCircle } from "lucide-react";
import { ExpensesByCategoryChart } from "@/components/admin-dashboard";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

export default function BranchDashboardPage() {
  const params = useParams();
  const branchId = params.branchId as string;

  const { data: branches, isLoading: branchesLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: mockGetBranches,
  });

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ["dashboard", "branch", branchId],
    queryFn: () => mockGetDashboardData("manager", branchId),
    enabled: !!branchId,
  });

  const branch = branches?.find((b) => b.id === branchId);

  // Show loading state while fetching initial data
  if (branchesLoading || dashboardLoading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Only check if branch exists after data is loaded
  if (!branch) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{branch.name}</h1>
        <p className="text-muted-foreground">
          {branch.location} • Manager: {branch.managerName || "Not assigned"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              UGX {dashboardData.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">For current period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              UGX {dashboardData.netProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Revenue minus expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Fuel Sold
            </CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.fuelVolumeSold.total.toLocaleString()} L
            </div>
            <p className="text-xs text-muted-foreground">
              All fuel types combined
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              UGX {dashboardData.totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">For current period</p>
          </CardContent>
        </Card>
      </div>

      {/* Fuel Prices and Tank Levels */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Fuel Prices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Petrol</p>
                  <p className="text-2xl font-bold">
                    UGX{" "}
                    {dashboardData.currentFuelPrices.gasoline.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Diesel</p>
                  <p className="text-2xl font-bold">
                    UGX{" "}
                    {dashboardData.currentFuelPrices.diesel.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Kerosene</p>
                  <p className="text-2xl font-bold">
                    UGX{" "}
                    {dashboardData.currentFuelPrices.kerosene.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Remaining Fuel in Tanks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Petrol</p>
                  <span className="text-xs text-muted-foreground">
                    83% capacity
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">25,000 L</p>
                  <span className="text-sm text-muted-foreground">
                    / 30,000 L
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: "83%" }}
                  ></div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Diesel</p>
                  <span className="text-xs text-muted-foreground">
                    72% capacity
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">18,000 L</p>
                  <span className="text-sm text-muted-foreground">
                    / 25,000 L
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: "72%" }}
                  ></div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Kerosene</p>
                  <span className="text-xs text-muted-foreground">
                    60% capacity
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">12,000 L</p>
                  <span className="text-sm text-muted-foreground">
                    / 20,000 L
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Sales Trend (Last 7 Days)</CardTitle>
        </CardHeader>

        <ChartContainer
          config={{
            petrol: {
              label: "Petrol",
              color: "hsl(217, 91%, 60%)",
            },
            diesel: {
              label: "Diesel",
              color: "hsl(142, 76%, 36%)",
            },
            kerosene: {
              label: "Kerosene",
              color: "hsl(38, 92%, 50%)",
            },
          }}
          className="h-[350px] w-full"
        >
          <LineChart
            data={dashboardData.dailySales}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis
              tickFormatter={(value: number) => `${(value / 1000).toFixed(0)}K`}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => `UGX ${value.toLocaleString()}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="petrol"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "hsl(217, 91%, 60%)" }}
              activeDot={{ r: 6 }}
              name="Petrol"
            />
            <Line
              type="monotone"
              dataKey="diesel"
              stroke="hsl(142, 76%, 36%)"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "hsl(142, 76%, 36%)" }}
              activeDot={{ r: 6 }}
              name="Diesel"
            />
            <Line
              type="monotone"
              dataKey="kerosene"
              stroke="hsl(38, 92%, 50%)"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "hsl(38, 92%, 50%)" }}
              activeDot={{ r: 6 }}
              name="Kerosene"
            />
          </LineChart>
        </ChartContainer>
      </Card>
    </div>
  );
}
