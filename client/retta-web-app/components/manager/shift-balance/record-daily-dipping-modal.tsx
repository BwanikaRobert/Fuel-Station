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
import { Fuel, Plus } from "lucide-react";
import { RecordDailyDippingForm } from "./record-daily-dipping-form";

interface RecordDailyDippingModalProps {
  userId: string;
  branchId: string;
}

export function RecordDailyDippingModal({
  userId,
  branchId,
}: RecordDailyDippingModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Record Daily Dippings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Daily Tank Dipping</DialogTitle>
          </div>
          <DialogDescription>
            Record actual fuel levels in storage tanks (measured once daily)
          </DialogDescription>
        </DialogHeader>
        <RecordDailyDippingForm
          userId={userId}
          branchId={branchId}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
