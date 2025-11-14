"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fuel } from "lucide-react";
import { ShiftBalance } from "@/lib/types";

interface RecentShiftBalancesProps {
  shiftBalances: ShiftBalance[];
}

export function RecentShiftBalances({
  shiftBalances,
}: RecentShiftBalancesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Shift Balances</CardTitle>
        <CardDescription>
          Latest recorded shift balances for this branch
        </CardDescription>
      </CardHeader>
      <CardContent>
        {shiftBalances && shiftBalances.length > 0 ? (
          <div className="space-y-4">
            {shiftBalances.slice(0, 5).map((balance) => (
              <div
                key={balance.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Fuel className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{balance.pumpName}</p>
                      <Badge
                        variant="outline"
                        className="capitalize text-[10px] px-1.5 py-0"
                      >
                        {balance.shiftType}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {balance.volumeSold.toLocaleString()} L sold
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">
                    UGX {balance.totalAmount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(balance.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No shift balances recorded yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}
