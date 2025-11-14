// User and Authentication Types
export type UserRole = "admin" | "manager" | "accountant";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branchId?: string; // Only for managers
  avatar?: string;
}

// Branch Types
export interface Branch {
  id: string;
  name: string;
  location: string;
  managerId?: string;
  managerName?: string;
  phoneNumber?: string;
  createdAt: string;
  status: "active" | "inactive";
}

// Fuel Pump Types
export type FuelType = "gasoline" | "diesel" | "kerosene";

export interface FuelPump {
  id: string;
  branchId: string;
  pumpName: string; // e.g., "Pump 1"
  fuelType: FuelType;
  meterReading: number; // Current reading
  lastUpdated: string;
  status: "active" | "maintenance" | "inactive";
}

// Shift Balance Types
export type ShiftType = "morning" | "evening";

export interface ShiftBalance {
  id: string;
  branchId: string;
  branchName?: string;
  pumpId: string;
  pumpName?: string;
  fuelType: FuelType;
  shiftType: ShiftType; // morning or evening
  openingMeter: number;
  closingMeter: number;
  volumeSold: number; // calculated: closing - opening
  pricePerLiter: number;
  totalAmount: number; // calculated: volumeSold * pricePerLiter
  date: string;
  recordedBy: string; // manager ID
  recordedByName?: string;
  createdAt: string;
}

// Expense Types
export interface Expense {
  id: string;
  branchId: string;
  branchName?: string;
  date: string;
  amount: number;
  category: "utilities" | "salaries" | "maintenance" | "supplies" | "other";
  description: string;
  recordedBy: string; // manager or admin ID
  recordedByName?: string;
  createdAt: string;
}

// Bank Deposit Types
export interface BankDeposit {
  id: string;
  branchId: string;
  branchName?: string;
  date: string;
  amount: number;
  referenceNumber: string;
  bankName: string;
  receiptImageUrl?: string;
  recordedBy: string;
  recordedByName?: string;
  createdAt: string;
}

// Fuel Delivery Types
export type DeliveryStatus = "pending" | "acknowledged" | "rejected";

export interface FuelDelivery {
  id: string;
  fromBranch?: string; // null if from supplier
  toBranchId: string;
  toBranchName?: string;
  fuelType: FuelType;
  quantityLiters: number;
  pricePerLiter: number;
  totalCost: number;
  deliveryDate: string;
  status: DeliveryStatus;
  supplierName?: string;
  acknowledgedBy?: string;
  acknowledgedByName?: string;
  acknowledgedAt?: string;
  actualQuantityReceived?: number;
  notes?: string;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
}

// Dashboard Statistics Types
export interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  currentFuelPrices: {
    gasoline: number;
    diesel: number;
    kerosene: number;
  };
  fuelVolumeSold: {
    gasoline: number;
    diesel: number;
    kerosene: number;
    total: number;
  };
  revenueByFuelType: {
    gasoline: number;
    diesel: number;
    kerosene: number;
  };
  dailySales: Array<{
    date: string;
    petrol: number;
    diesel: number;
    kerosene: number;
  }>;
  expensesByCategory: Array<{
    category: string;
    amount: number;
  }>;
  topPerformingBranches?: Array<{
    branchId: string;
    branchName: string;
    revenue: number;
  }>;
}

// Report Types
export interface ReportFilters {
  branchId?: string;
  startDate: string;
  endDate: string;
  fuelType?: FuelType;
  category?: string;
}

export interface SalesReport {
  branchId: string;
  branchName: string;
  date: string;
  totalSales: number;
  volumeSold: number;
  fuelType: FuelType;
  averagePrice: number;
}

export interface ProfitReport {
  branchId: string;
  branchName: string;
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
}

// Form Types for React Hook Form
export interface LoginFormData {
  email: string;
  password: string;
}

export interface BranchFormData {
  name: string;
  location: string;
  phoneNumber: string;
  managerId?: string;
}

export interface ShiftBalanceFormData {
  pumpId: string;
  shiftType: ShiftType;
  closingMeter: number;
  date: string;
}

export interface ExpenseFormData {
  date: string;
  amount: number;
  category: string;
  description: string;
}

export interface BankDepositFormData {
  date: string;
  amount: number;
  referenceNumber: string;
  bankName: string;
  receiptImage?: File;
}

export interface FuelDeliveryFormData {
  toBranchId: string;
  fuelType: FuelType;
  quantityLiters: number;
  pricePerLiter: number;
  deliveryDate: string;
  notes?: string;
}

export interface AcknowledgeFuelFormData {
  actualQuantityReceived: number;
  supplierName: string;
  notes?: string;
}
