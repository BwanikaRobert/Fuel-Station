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
import { Plus, ArrowRightLeft } from "lucide-react";
import { InitiateTransferForm } from "./initiate-transfer-form";
import { Branch } from "@/lib/types";

interface InitiateTransferModalProps {
  userId: string;
  branchId: string;
  branches: Branch[];
}

export function InitiateTransferModal({
  userId,
  branchId,
  branches,
}: InitiateTransferModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Initiate Transfer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            <DialogTitle>Initiate Fuel Transfer</DialogTitle>
          </div>
          <DialogDescription>
            Transfer fuel from your branch to another branch
          </DialogDescription>
        </DialogHeader>
        <InitiateTransferForm
          userId={userId}
          branchId={branchId}
          branches={branches}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
