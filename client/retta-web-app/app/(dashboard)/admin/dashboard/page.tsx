'use client';

import { useQuery } from '@tanstack/react-query';
import { mockGetDashboardData } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { StatCard } from '@/components/stat-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Fuel, Building2 } from 'lucide-react';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Pie, PieChart, Cell } from 'recharts';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: () => mockGetDashboardData('admin'),
  });

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const fuelTypeData = [
    { name: 'Gasoline', value: stats.revenueByFuelType.gasoline },
    { name: 'Diesel', value: stats.revenueByFuelType.diesel },
    { name: 'Kerosene', value: stats.revenueByFuelType.kerosene },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here is your company overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          description="All-time revenue"
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Total Expenses"
          value={`$${stats.totalExpenses.toLocaleString()}`}
          description="All-time expenses"
          icon={TrendingDown}
          trend={{ value: 4.3, isPositive: false }}
        />
        <StatCard
          title="Net Profit"
          value={`$${stats.netProfit.toLocaleString()}`}
          description="Revenue - Expenses"
          icon={TrendingUp}
          trend={{ value: 18.2, isPositive: true }}
          className="border-green-200 dark:border-green-900"
        />
        <StatCard
          title="Total Fuel Sold"
          value={`${stats.fuelVolumeSold.total.toLocaleString()} L`}
          description="All fuel types"
          icon={Fuel}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Daily Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                amount: {
                  label: 'Sales',
                  color: 'hsl(var(--chart-1))',
                },
              }}
              className="h-[300px]"
            >
              <LineChart data={stats.dailySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                />
                <Line type="monotone" dataKey="amount" stroke="hsl(var(--chart-1))" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Revenue by Fuel Type */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Fuel Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                gasoline: {
                  label: 'Gasoline',
                  color: 'hsl(var(--chart-1))',
                },
                diesel: {
                  label: 'Diesel',
                  color: 'hsl(var(--chart-2))',
                },
                kerosene: {
                  label: 'Kerosene',
                  color: 'hsl(var(--chart-3))',
                },
              }}
              className="h-[300px]"
            >
              <PieChart>
                <Pie
                  data={fuelTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="hsl(var(--chart-1))"
                  dataKey="value"
                >
                  {fuelTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Expenses by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                amount: {
                  label: 'Amount',
                  color: 'hsl(var(--chart-2))',
                },
              }}
              className="h-[300px]"
            >
              <BarChart data={stats.expensesByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                />
                <Bar dataKey="amount" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Performing Branches */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Branches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topPerformingBranches?.map((branch, index) => (
                <div key={branch.branchId} className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                    {index + 1}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{branch.branchName}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Building2 className="mr-1 h-3 w-3" />
                          Branch
                        </div>
                      </div>
                      <p className="text-sm font-bold">${branch.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
