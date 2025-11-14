"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { BankDeposit } from "@/lib/types";

interface BankDepositHistoryTableProps {
  deposits: BankDeposit[];
}

export function BankDepositHistoryTable({
  deposits,
}: BankDepositHistoryTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank Deposit History</CardTitle>
        <CardDescription>
          All bank deposits recorded for this branch
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Bank Name</TableHead>
                <TableHead>Account Number</TableHead>
                <TableHead>Recorded By</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deposits && deposits.length > 0 ? (
                deposits.map((deposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell>
                      {new Date(deposit.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{deposit.bankName}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {deposit.referenceNumber}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {deposit.recordedByName}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      UGX {deposit.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8"
                  >
                    No bank deposits recorded yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
