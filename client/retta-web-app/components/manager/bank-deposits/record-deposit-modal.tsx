"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Landmark } from "lucide-react";
import { RecordBankDepositForm } from "./record-deposit-form";

interface RecordBankDepositModalProps {
  userId: string;
  branchId: string;
}

export function RecordBankDepositModal({
  userId,
  branchId,
}: RecordBankDepositModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Record Deposit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Record Bank Deposit</DialogTitle>
          </div>
        </DialogHeader>
        <RecordBankDepositForm
          userId={userId}
          branchId={branchId}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
