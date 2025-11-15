"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { mockGetBranches } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Building2,
  Save,
  DollarSign,
  Lock,
  Power,
} from "lucide-react";
import { toast } from "sonner";

interface BranchSettings {
  branchId: string;
  canChangeFuelPrice: boolean;
  managerLoginEnabled: boolean;
  isActive: boolean;
}

export default function SettingsPage() {
  const { data: branches, isLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: mockGetBranches,
  });

  // Mock settings data - replace with actual API call
  const [branchSettings, setBranchSettings] = useState<
    Record<string, BranchSettings>
  >({
    "branch-1": {
      branchId: "branch-1",
      canChangeFuelPrice: true,
      managerLoginEnabled: true,
      isActive: true,
    },
    "branch-2": {
      branchId: "branch-2",
      canChangeFuelPrice: false,
      managerLoginEnabled: true,
      isActive: true,
    },
    "branch-3": {
      branchId: "branch-3",
      canChangeFuelPrice: true,
      managerLoginEnabled: false,
      isActive: false,
    },
  });

  const updateSetting = (
    branchId: string,
    key: keyof Omit<BranchSettings, "branchId">,
    value: boolean
  ) => {
    setBranchSettings((prev) => ({
      ...prev,
      [branchId]: {
        ...prev[branchId],
        [key]: value,
      },
    }));
  };

  const handleSaveBranchSettings = (branchId: string) => {
    // Mock save - replace with actual API call
    const branch = branches?.find((b) => b.id === branchId);
    toast.success("Settings saved", {
      description: `${branch?.name} settings have been updated successfully.`,
    });
  };

  const handleSaveAllSettings = () => {
    // Mock save all - replace with actual API call
    toast.success("All settings saved", {
      description: "Settings for all branches have been updated successfully.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Branch Settings
          </h1>
        </div>
        <Button onClick={handleSaveAllSettings} className="gap-2">
          <Save className="h-4 w-4" />
          Save All Settings
        </Button>
      </div>

      {/* Branch Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {branches?.map((branch) => {
          const settings = branchSettings[branch.id];
          if (!settings) return null;

          return (
            <Card key={branch.id} className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div>
                      <CardTitle className="text-lg">{branch.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {branch.location}
                      </p>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {branch.managerName || "No Manager"}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Change Fuel Price Permission */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span>Change Fuel Prices</span>
                  </div>
                  <div className="flex items-center justify-between pl-6">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor={`fuel-price-${branch.id}`}
                        className="text-sm font-normal"
                      >
                        Allow manager to update prices
                      </Label>
                    </div>
                    <Switch
                      id={`fuel-price-${branch.id}`}
                      checked={settings.canChangeFuelPrice}
                      onCheckedChange={(checked) =>
                        updateSetting(branch.id, "canChangeFuelPrice", checked)
                      }
                    />
                  </div>
                  <div className="pl-6">
                    <Badge
                      variant={
                        settings.canChangeFuelPrice ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {settings.canChangeFuelPrice ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>

                <div className="border-t" />

                {/* Manager Login Access */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Lock className="h-4 w-4 text-primary" />
                    <span>Manager Login</span>
                  </div>
                  <div className="flex items-center justify-between pl-6">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor={`manager-login-${branch.id}`}
                        className="text-sm font-normal"
                      >
                        Enable manager access
                      </Label>
                    </div>
                    <Switch
                      id={`manager-login-${branch.id}`}
                      checked={settings.managerLoginEnabled}
                      onCheckedChange={(checked) =>
                        updateSetting(branch.id, "managerLoginEnabled", checked)
                      }
                    />
                  </div>
                  <div className="pl-6">
                    <Badge
                      variant={
                        settings.managerLoginEnabled ? "default" : "destructive"
                      }
                      className="text-xs"
                    >
                      {settings.managerLoginEnabled
                        ? "Login Enabled"
                        : "Login Disabled"}
                    </Badge>
                  </div>
                </div>

                <div className="border-t" />

                {/* Station Status */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Power className="h-4 w-4 text-primary" />
                    <span>Station Status</span>
                  </div>
                  <div className="flex items-center justify-between pl-6">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor={`station-active-${branch.id}`}
                        className="text-sm font-normal"
                      >
                        Station operational status
                      </Label>
                    </div>
                    <Switch
                      id={`station-active-${branch.id}`}
                      checked={settings.isActive}
                      onCheckedChange={(checked) =>
                        updateSetting(branch.id, "isActive", checked)
                      }
                    />
                  </div>
                  <div className="pl-6">
                    <Badge
                      variant={settings.isActive ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {settings.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                {/* Save Button */}
                <Button
                  onClick={() => handleSaveBranchSettings(branch.id)}
                  variant="outline"
                  className="w-full mt-4"
                  size="sm"
                >
                  <Save className="h-3 w-3 mr-2" />
                  Save {branch.name} Settings
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {!branches || branches.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No branches found</p>
            <p className="text-sm text-muted-foreground">
              Add branches to configure their settings
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
