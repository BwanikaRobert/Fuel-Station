"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { BankDeposit } from "@/lib/types";

interface RecentBankDepositsProps {
  deposits: BankDeposit[];
}

export function RecentBankDeposits({ deposits }: RecentBankDepositsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bank Deposits</CardTitle>
        <CardDescription>
          Latest 5 bank deposits with account numbers
        </CardDescription>
      </CardHeader>
      <CardContent>
        {deposits && deposits.length > 0 ? (
          <div className="space-y-4">
            {deposits.slice(0, 5).map((deposit) => (
              <div
                key={deposit.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{deposit.bankName}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {deposit.referenceNumber}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">
                    UGX {deposit.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(deposit.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No bank deposits recorded yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}
