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
import { Plus, DollarSign } from "lucide-react";
import { RecordExpenseForm } from "./record-expense-form";

interface RecordExpenseModalProps {
  userId: string;
  branchId: string;
}

export function RecordExpenseModal({
  userId,
  branchId,
}: RecordExpenseModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Record Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Record New Expense</DialogTitle>
          </div>
          <DialogDescription>
            Enter expense details for your branch
          </DialogDescription>
        </DialogHeader>
        <RecordExpenseForm
          userId={userId}
          branchId={branchId}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
