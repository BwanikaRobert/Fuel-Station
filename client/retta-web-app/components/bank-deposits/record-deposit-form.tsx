"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockCreateBankDeposit } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, Upload, X } from "lucide-react";
import { BankDepositFormData } from "@/lib/types";

const bankDepositSchema = z.object({
  date: z.string().min(1, "Date is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  referenceNumber: z.string().min(1, "Please select an account number"),
  bankName: z.string().min(1, "Please select a bank"),
  receiptImage: z.any().optional(),
});

const banks = [
  { value: "equity-bank", label: "Equity Bank" },
  { value: "centenary-bank", label: "Centenary Bank" },
  { value: "stanbic-bank", label: "Stanbic Bank" },
];

const companyAccounts = [
  { value: "1234567890", label: "Account 1234567890 - Main Account" },
  { value: "0987654321", label: "Account 0987654321 - Operations" },
  { value: "5555666677", label: "Account 5555666677 - Reserve" },
];

interface RecordBankDepositFormProps {
  userId: string;
  branchId: string;
}

export function RecordBankDepositForm({
  userId,
  branchId,
}: RecordBankDepositFormProps) {
  const [successMessage, setSuccessMessage] = useState("");
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BankDepositFormData>({
    resolver: zodResolver(bankDepositSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: BankDepositFormData) =>
      mockCreateBankDeposit(data, userId, branchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-deposits"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setSuccessMessage("Bank deposit recorded successfully!");
      setReceiptPreview(null);
      setReceiptFile(null);
      reset({
        date: new Date().toISOString().split("T")[0],
        amount: 0,
        referenceNumber: "",
        bankName: "",
      });
      setTimeout(() => setSuccessMessage(""), 5000);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setValue("receiptImage", file);
    }
  };

  const removeReceipt = () => {
    setReceiptPreview(null);
    setReceiptFile(null);
    setValue("receiptImage", undefined);
  };

  const onSubmit = (data: BankDepositFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="space-y-4">
      {successMessage && (
        <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 mr-2" />
            <p className="text-sm text-green-600 dark:text-green-500 font-medium">
              {successMessage}
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Record Bank Deposit</CardTitle>
          <CardDescription>
            Enter bank deposit details for your branch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" {...register("date")} />
                {errors.date && (
                  <p className="text-sm text-destructive">
                    {errors.date.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (UGX)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="1"
                  placeholder="1500000"
                  {...register("amount", { valueAsNumber: true })}
                />
                {errors.amount && (
                  <p className="text-sm text-destructive">
                    {errors.amount.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Select
                  value={watch("bankName")}
                  onValueChange={(value) => setValue("bankName", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank.value} value={bank.label}>
                        {bank.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.bankName && (
                  <p className="text-sm text-destructive">
                    {errors.bankName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="referenceNumber">Company Account Number</Label>
                <Select
                  value={watch("referenceNumber")}
                  onValueChange={(value) => setValue("referenceNumber", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account number" />
                  </SelectTrigger>
                  <SelectContent>
                    {companyAccounts.map((account) => (
                      <SelectItem key={account.value} value={account.value}>
                        {account.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.referenceNumber && (
                  <p className="text-sm text-destructive">
                    {errors.referenceNumber.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiptImage">Receipt Image (Optional)</Label>
              <div className="flex flex-col gap-4">
                {!receiptPreview ? (
                  <div className="relative">
                    <Input
                      id="receiptImage"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Label
                      htmlFor="receiptImage"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span>{" "}
                          receipt image
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG, JPEG (MAX. 5MB)
                        </p>
                      </div>
                    </Label>
                  </div>
                ) : (
                  <div className="relative rounded-lg border overflow-hidden">
                    <Image
                      src={receiptPreview}
                      alt="Receipt preview"
                      width={800}
                      height={400}
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeReceipt}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
                      <p className="text-xs truncate">{receiptFile?.name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending
                ? "Recording..."
                : "Record Bank Deposit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
