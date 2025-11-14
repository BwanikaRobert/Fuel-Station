"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, CreditCard, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  AddCreditSaleForm,
  RecordPaymentForm,
  CreditsTable,
} from "@/components/manager/credits";
import { CreditSale } from "@/lib/types";

export default function CreditsPage() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState<CreditSale | null>(null);

  // Mock data - replace with actual query
  const credits: CreditSale[] = [
    {
      id: "1",
      branchId: user?.branchId || "",
      debtorName: "John Kamau",
      debtorPhone: "+256700123456",
      fuelType: "gasoline",
      quantityLiters: 50,
      pricePerLiter: 5500,
      totalAmount: 275000,
      amountPaid: 0,
      amountRemaining: 275000,
      status: "unpaid",
      saleDate: new Date("2024-11-10").toISOString(),
      dueDate: new Date("2024-11-20").toISOString(),
      recordedBy: user?.id || "",
      createdAt: new Date("2024-11-10").toISOString(),
    },
    {
      id: "2",
      branchId: user?.branchId || "",
      debtorName: "Sarah Nakato",
      debtorPhone: "+256700987654",
      fuelType: "diesel",
      quantityLiters: 100,
      pricePerLiter: 5200,
      totalAmount: 520000,
      amountPaid: 200000,
      amountRemaining: 320000,
      status: "partially_paid",
      saleDate: new Date("2024-11-08").toISOString(),
      dueDate: new Date("2024-11-18").toISOString(),
      notes: "Promised to pay balance by Friday",
      recordedBy: user?.id || "",
      createdAt: new Date("2024-11-08").toISOString(),
    },
    {
      id: "3",
      branchId: user?.branchId || "",
      debtorName: "Peter Omondi",
      debtorPhone: "+256700555444",
      fuelType: "gasoline",
      quantityLiters: 75,
      pricePerLiter: 5500,
      totalAmount: 412500,
      amountPaid: 412500,
      amountRemaining: 0,
      status: "settled",
      saleDate: new Date("2024-11-05").toISOString(),
      dueDate: new Date("2024-11-15").toISOString(),
      recordedBy: user?.id || "",
      createdAt: new Date("2024-11-05").toISOString(),
    },
    {
      id: "4",
      branchId: user?.branchId || "",
      debtorName: "Mary Achieng",
      debtorPhone: "+256700222333",
      fuelType: "kerosene",
      quantityLiters: 30,
      pricePerLiter: 4800,
      totalAmount: 144000,
      amountPaid: 50000,
      amountRemaining: 94000,
      status: "partially_paid",
      saleDate: new Date("2024-11-12").toISOString(),
      dueDate: new Date("2024-11-22").toISOString(),
      notes: "Regular customer",
      recordedBy: user?.id || "",
      createdAt: new Date("2024-11-12").toISOString(),
    },
  ];

  const unpaidCredits = credits.filter((c) => c.status === "unpaid");
  const partiallyPaidCredits = credits.filter(
    (c) => c.status === "partially_paid"
  );
  const settledCredits = credits.filter((c) => c.status === "settled");

  const totalUnpaidAmount = unpaidCredits.reduce(
    (sum, c) => sum + c.amountRemaining,
    0
  );
  const totalPartiallyPaidAmount = partiallyPaidCredits.reduce(
    (sum, c) => sum + c.amountRemaining,
    0
  );
  const totalSettledAmount = settledCredits.reduce(
    (sum, c) => sum + c.totalAmount,
    0
  );

  const handlePayment = (credit: CreditSale) => {
    setSelectedCredit(credit);
    setIsPaymentDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Credit Sales</h1>
          <p className="text-muted-foreground">
            Manage fuel sales on credit and track payments
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Credit Sale
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Record Credit Sale</DialogTitle>
              <DialogDescription>
                Add a new fuel sale on credit with debtor details
              </DialogDescription>
            </DialogHeader>
            <AddCreditSaleForm
              userId={user?.id || ""}
              branchId={user?.branchId || ""}
              onSuccess={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          {selectedCredit && (
            <RecordPaymentForm
              credit={selectedCredit}
              userId={user?.id || ""}
              onSuccess={() => {
                setIsPaymentDialogOpen(false);
                setSelectedCredit(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Debts</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unpaidCredits.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              UGX {totalUnpaidAmount.toLocaleString()} outstanding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Partially Paid
            </CardTitle>
            <CreditCard className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {partiallyPaidCredits.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              UGX {totalPartiallyPaidAmount.toLocaleString()} remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Settled Debts</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{settledCredits.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              UGX {totalSettledAmount.toLocaleString()} recovered
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Credits Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Credits</TabsTrigger>
          <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
          <TabsTrigger value="partially">Partially Paid</TabsTrigger>
          <TabsTrigger value="settled">Settled</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <CreditsTable credits={credits} onPayment={handlePayment} />
        </TabsContent>

        <TabsContent value="unpaid" className="space-y-4">
          <CreditsTable credits={unpaidCredits} onPayment={handlePayment} />
        </TabsContent>

        <TabsContent value="partially" className="space-y-4">
          <CreditsTable
            credits={partiallyPaidCredits}
            onPayment={handlePayment}
          />
        </TabsContent>

        <TabsContent value="settled" className="space-y-4">
          <CreditsTable credits={settledCredits} onPayment={handlePayment} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
