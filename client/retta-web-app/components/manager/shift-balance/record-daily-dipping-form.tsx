import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DailyDippingFormData } from "@/lib/types";

interface RecordDailyDippingFormProps {
  userId: string;
  branchId: string;
  onSuccess?: () => void;
}

export function RecordDailyDippingForm({
  userId,
  branchId,
  onSuccess,
}: RecordDailyDippingFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [gasolineLiters, setGasolineLiters] = useState("");
  const [dieselLiters, setDieselLiters] = useState("");
  const [keroseneLiters, setKeroseneLiters] = useState("");
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: DailyDippingFormData) => {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        id: `dipping-${Date.now()}`,
        branchId,
        date: data.date,
        gasolineLiters: data.gasolineLiters,
        dieselLiters: data.dieselLiters,
        keroseneLiters: data.keroseneLiters,
        recordedBy: userId,
        createdAt: new Date().toISOString(),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-dippings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Daily dipping recorded successfully!", {
        description: "Tank measurements have been saved.",
      });
      // Clear form
      setGasolineLiters("");
      setDieselLiters("");
      setKeroseneLiters("");
      setDate(new Date().toISOString().split("T")[0]);
      // Call onSuccess callback to close modal
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error("Failed to record daily dipping", {
        description: error.message || "Please try again later.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const gasoline = parseFloat(gasolineLiters) || 0;
    const diesel = parseFloat(dieselLiters) || 0;
    const kerosene = parseFloat(keroseneLiters) || 0;

    if (gasoline <= 0 && diesel <= 0 && kerosene <= 0) {
      toast.error("Invalid readings", {
        description:
          "Please enter at least one tank measurement greater than 0.",
      });
      return;
    }

    createMutation.mutate({
      date,
      gasolineLiters: gasoline,
      dieselLiters: diesel,
      keroseneLiters: kerosene,
    });
  };

  const totalLiters =
    (parseFloat(gasolineLiters) || 0) +
    (parseFloat(dieselLiters) || 0) +
    (parseFloat(keroseneLiters) || 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="dipping-date">Date</Label>
        <Input
          id="dipping-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="gasoline"
            className="flex items-center justify-between"
          >
            <span>Petrol Tank Level (Liters)</span>
            <span className="text-xs text-muted-foreground">Premium</span>
          </Label>
          <Input
            id="gasoline"
            type="number"
            step="0.01"
            placeholder="e.g., 15000"
            value={gasolineLiters}
            onChange={(e) => setGasolineLiters(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="diesel" className="flex items-center justify-between">
            <span>Diesel Tank Level (Liters)</span>
            <span className="text-xs text-muted-foreground">Heavy Duty</span>
          </Label>
          <Input
            id="diesel"
            type="number"
            step="0.01"
            placeholder="e.g., 20000"
            value={dieselLiters}
            onChange={(e) => setDieselLiters(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="kerosene"
            className="flex items-center justify-between"
          >
            <span>Kerosene Tank Level (Liters)</span>
            <span className="text-xs text-muted-foreground">Domestic</span>
          </Label>
          <Input
            id="kerosene"
            type="number"
            step="0.01"
            placeholder="e.g., 8000"
            value={keroseneLiters}
            onChange={(e) => setKeroseneLiters(e.target.value)}
          />
        </div>
      </div>

      {totalLiters > 0 && (
        <div className="rounded-lg bg-primary/10 p-4 space-y-2">
          <p className="text-sm font-medium">Total Tank Inventory</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Petrol</p>
              <p className="text-lg font-bold">
                {(parseFloat(gasolineLiters) || 0).toLocaleString()} L
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Diesel</p>
              <p className="text-lg font-bold">
                {(parseFloat(dieselLiters) || 0).toLocaleString()} L
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Kerosene</p>
              <p className="text-lg font-bold">
                {(parseFloat(keroseneLiters) || 0).toLocaleString()} L
              </p>
            </div>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Total Inventory:
              </span>
              <span className="text-xl font-bold text-primary">
                {totalLiters.toLocaleString()} L
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => {
            setGasolineLiters("");
            setDieselLiters("");
            setKeroseneLiters("");
          }}
          disabled={createMutation.isPending}
        >
          Clear
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Recording..." : "Record Dipping"}
        </Button>
      </div>
    </form>
  );
}
