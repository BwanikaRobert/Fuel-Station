"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
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

interface SalesFiltersProps {
  resultCount: number;
}

export function SalesFilters({ resultCount }: SalesFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get values from URL
  const selectedBranch = searchParams.get("branch") || "all";
  const selectedFuelType = searchParams.get("fuelType") || "all";
  const startDate = searchParams.get("start") || "";
  const endDate = searchParams.get("end") || "";

  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const handleClearFilters = () => {
    router.push(window.location.pathname);
  };

  return (
    <Card className="lg:col-span-2">
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="branch-filter">Branch</Label>
            <Select
              value={selectedBranch}
              onValueChange={(value) => updateURL("branch", value)}
            >
              <SelectTrigger id="branch-filter">
                <SelectValue placeholder="All Branches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="Downtown Station">
                  Downtown Station
                </SelectItem>
                <SelectItem value="Airport Station">Airport Station</SelectItem>
                <SelectItem value="Highway Station">Highway Station</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fuelType-filter">Fuel Type</Label>
            <Select
              value={selectedFuelType}
              onValueChange={(value) => updateURL("fuelType", value)}
            >
              <SelectTrigger id="fuelType-filter">
                <SelectValue placeholder="All Fuel Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fuel Types</SelectItem>
                <SelectItem value="Petrol">Petrol</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => updateURL("start", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date">End Date</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => updateURL("end", e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={handleClearFilters}>
            Clear Filters
          </Button>
          <div className="text-sm text-muted-foreground">
            {resultCount} sale{resultCount !== 1 ? "s" : ""} found
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
