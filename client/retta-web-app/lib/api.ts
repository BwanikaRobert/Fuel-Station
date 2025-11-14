import {
  User,
  Branch,
  FuelPump,
  ShiftBalance,
  Expense,
  BankDeposit,
  FuelDelivery,
  DashboardStats,
  UserRole,
  FuelType,
  BranchFormData,
  ExpenseFormData,
  BankDepositFormData,
  FuelDeliveryFormData,
  AcknowledgeFuelFormData,
} from "./types";

// Simulated network delay
const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Admin",
    email: "admin@fuelstation.com",
    role: "admin",
  },
  {
    id: "2",
    name: "Sarah Manager",
    email: "manager@fuelstation.com",
    role: "manager",
    branchId: "branch-1",
  },
  {
    id: "3",
    name: "Mike Accountant",
    email: "accountant@fuelstation.com",
    role: "accountant",
  },
  {
    id: "4",
    name: "Lisa Manager",
    email: "lisa@fuelstation.com",
    role: "manager",
    branchId: "branch-2",
  },
];

// Mock Branches
let mockBranches: Branch[] = [
  {
    id: "branch-1",
    name: "Downtown Station",
    location: "Main Street, Downtown",
    managerId: "2",
    managerName: "Sarah Manager",
    phoneNumber: "+1234567890",
    createdAt: "2024-01-15T10:00:00Z",
    status: "active",
  },
  {
    id: "branch-2",
    name: "Airport Station",
    location: "Airport Road, Terminal 2",
    managerId: "4",
    managerName: "Lisa Manager",
    phoneNumber: "+1234567891",
    createdAt: "2024-02-20T10:00:00Z",
    status: "active",
  },
  {
    id: "branch-3",
    name: "Highway Station",
    location: "Highway 101, Exit 45",
    phoneNumber: "+1234567892",
    createdAt: "2024-03-10T10:00:00Z",
    status: "active",
  },
];

// Mock Fuel Pumps
const mockPumps: FuelPump[] = [
  {
    id: "pump-1",
    branchId: "branch-1",
    pumpName: "Pump 1",
    fuelType: "gasoline",
    meterReading: 150000,
    lastUpdated: new Date().toISOString(),
    status: "active",
  },
  {
    id: "pump-2",
    branchId: "branch-1",
    pumpName: "Pump 2",
    fuelType: "diesel",
    meterReading: 120000,
    lastUpdated: new Date().toISOString(),
    status: "active",
  },
  {
    id: "pump-3",
    branchId: "branch-1",
    pumpName: "Pump 3",
    fuelType: "kerosene",
    meterReading: 80000,
    lastUpdated: new Date().toISOString(),
    status: "active",
  },
  {
    id: "pump-4",
    branchId: "branch-2",
    pumpName: "Pump 1",
    fuelType: "gasoline",
    meterReading: 200000,
    lastUpdated: new Date().toISOString(),
    status: "active",
  },
  {
    id: "pump-5",
    branchId: "branch-2",
    pumpName: "Pump 2",
    fuelType: "diesel",
    meterReading: 180000,
    lastUpdated: new Date().toISOString(),
    status: "active",
  },
];

// Mock Shift Balances
let mockShiftBalances: ShiftBalance[] = [
  {
    id: "shift-1",
    branchId: "branch-1",
    branchName: "Downtown Station",
    pumpId: "pump-1",
    pumpName: "Pump 1",
    fuelType: "gasoline",
    shiftType: "morning",
    openingMeter: 149500,
    closingMeter: 150000,
    volumeSold: 500,
    pricePerLiter: 1.5,
    totalAmount: 750,
    date: new Date().toISOString().split("T")[0],
    recordedBy: "2",
    recordedByName: "Sarah Manager",
    createdAt: new Date().toISOString(),
  },
];

// Mock Expenses
let mockExpenses: Expense[] = [
  {
    id: "expense-1",
    branchId: "branch-1",
    branchName: "Downtown Station",
    date: new Date().toISOString().split("T")[0],
    amount: 500,
    category: "utilities",
    description: "Electricity bill for November",
    recordedBy: "2",
    recordedByName: "Sarah Manager",
    createdAt: new Date().toISOString(),
  },
  {
    id: "expense-2",
    branchId: "branch-1",
    branchName: "Downtown Station",
    date: new Date().toISOString().split("T")[0],
    amount: 200,
    category: "maintenance",
    description: "Pump maintenance",
    recordedBy: "2",
    recordedByName: "Sarah Manager",
    createdAt: new Date().toISOString(),
  },
];

// Mock Bank Deposits
let mockBankDeposits: BankDeposit[] = [
  {
    id: "deposit-1",
    branchId: "branch-1",
    branchName: "Downtown Station",
    date: new Date().toISOString().split("T")[0],
    amount: 5000,
    referenceNumber: "REF-2024-001",
    bankName: "First National Bank",
    recordedBy: "2",
    recordedByName: "Sarah Manager",
    createdAt: new Date().toISOString(),
  },
];

// Mock Fuel Deliveries
let mockFuelDeliveries: FuelDelivery[] = [
  {
    id: "delivery-1",
    toBranchId: "branch-1",
    toBranchName: "Downtown Station",
    fuelType: "gasoline",
    quantityLiters: 10000,
    pricePerLiter: 1.2,
    totalCost: 12000,
    deliveryDate: new Date().toISOString().split("T")[0],
    status: "pending",
    createdBy: "1",
    createdByName: "John Admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "delivery-2",
    toBranchId: "branch-2",
    toBranchName: "Airport Station",
    fuelType: "diesel",
    quantityLiters: 8000,
    pricePerLiter: 1.3,
    totalCost: 10400,
    deliveryDate: new Date().toISOString().split("T")[0],
    status: "acknowledged",
    actualQuantityReceived: 8000,
    acknowledgedBy: "4",
    acknowledgedByName: "Lisa Manager",
    acknowledgedAt: new Date().toISOString(),
    createdBy: "1",
    createdByName: "John Admin",
    createdAt: new Date().toISOString(),
  },
];

// Authentication
export async function mockLogin(
  email: string,
  password: string
): Promise<User> {
  await delay(800);

  const user = mockUsers.find((u) => u.email === email);

  if (!user || password !== "password123") {
    throw new Error("Invalid credentials");
  }

  return user;
}

export async function mockGetCurrentUser(userId: string): Promise<User> {
  await delay(300);

  const user = mockUsers.find((u) => u.id === userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

// Dashboard Data
export async function mockGetDashboardData(
  role: UserRole,
  branchId?: string
): Promise<DashboardStats> {
  await delay();

  // Filter data based on role and branch
  const relevantShifts = branchId
    ? mockShiftBalances.filter((s) => s.branchId === branchId)
    : mockShiftBalances;

  const relevantExpenses = branchId
    ? mockExpenses.filter((e) => e.branchId === branchId)
    : mockExpenses;

  const totalRevenue = relevantShifts.reduce(
    (sum, shift) => sum + shift.totalAmount,
    0
  );
  const totalExpenses = relevantExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const fuelVolumeSold = {
    gasoline: relevantShifts
      .filter((s) => s.fuelType === "gasoline")
      .reduce((sum, s) => sum + s.volumeSold, 0),
    diesel: relevantShifts
      .filter((s) => s.fuelType === "diesel")
      .reduce((sum, s) => sum + s.volumeSold, 0),
    kerosene: relevantShifts
      .filter((s) => s.fuelType === "kerosene")
      .reduce((sum, s) => sum + s.volumeSold, 0),
    total: 0,
  };

  fuelVolumeSold.total =
    fuelVolumeSold.gasoline + fuelVolumeSold.diesel + fuelVolumeSold.kerosene;

  const revenueByFuelType = {
    gasoline: relevantShifts
      .filter((s) => s.fuelType === "gasoline")
      .reduce((sum, s) => sum + s.totalAmount, 0),
    diesel: relevantShifts
      .filter((s) => s.fuelType === "diesel")
      .reduce((sum, s) => sum + s.totalAmount, 0),
    kerosene: relevantShifts
      .filter((s) => s.fuelType === "kerosene")
      .reduce((sum, s) => sum + s.totalAmount, 0),
  };

  // Generate daily sales for the last 7 days
  const dailySales = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toISOString().split("T")[0],
      amount: Math.floor(Math.random() * 5000) + 2000,
    };
  });

  const expensesByCategory = [
    { category: "Utilities", amount: 1200 },
    { category: "Salaries", amount: 5000 },
    { category: "Maintenance", amount: 800 },
    { category: "Supplies", amount: 400 },
    { category: "Other", amount: 300 },
  ];

  const topPerformingBranches =
    role === "admin"
      ? [
          {
            branchId: "branch-1",
            branchName: "Downtown Station",
            revenue: 15000,
          },
          {
            branchId: "branch-2",
            branchName: "Airport Station",
            revenue: 12000,
          },
          {
            branchId: "branch-3",
            branchName: "Highway Station",
            revenue: 8000,
          },
        ]
      : undefined;

  return {
    totalRevenue,
    totalExpenses,
    netProfit: totalRevenue - totalExpenses,
    currentFuelPrices: {
      gasoline: 5850,
      diesel: 6200,
      kerosene: 4750,
    },
    fuelVolumeSold,
    revenueByFuelType,
    dailySales,
    expensesByCategory,
    topPerformingBranches,
  };
}

// Branches
export async function mockGetBranches(): Promise<Branch[]> {
  await delay();
  return [...mockBranches];
}

export async function mockGetBranch(id: string): Promise<Branch> {
  await delay();
  const branch = mockBranches.find((b) => b.id === id);
  if (!branch) throw new Error("Branch not found");
  return branch;
}

export async function mockCreateBranch(data: BranchFormData): Promise<Branch> {
  await delay(800);

  const manager = data.managerId
    ? mockUsers.find((u) => u.id === data.managerId)
    : undefined;

  const newBranch: Branch = {
    id: `branch-${Date.now()}`,
    name: data.name,
    location: data.location,
    phoneNumber: data.phoneNumber,
    managerId: data.managerId,
    managerName: manager?.name,
    createdAt: new Date().toISOString(),
    status: "active",
  };

  mockBranches.push(newBranch);
  return newBranch;
}

export async function mockUpdateBranch(
  id: string,
  data: BranchFormData
): Promise<Branch> {
  await delay(800);

  const index = mockBranches.findIndex((b) => b.id === id);
  if (index === -1) throw new Error("Branch not found");

  const manager = data.managerId
    ? mockUsers.find((u) => u.id === data.managerId)
    : undefined;

  mockBranches[index] = {
    ...mockBranches[index],
    name: data.name,
    location: data.location,
    phoneNumber: data.phoneNumber,
    managerId: data.managerId,
    managerName: manager?.name,
  };

  return mockBranches[index];
}

export async function mockDeleteBranch(id: string): Promise<void> {
  await delay(800);
  mockBranches = mockBranches.filter((b) => b.id !== id);
}

// Fuel Pumps
export async function mockGetPumps(branchId?: string): Promise<FuelPump[]> {
  await delay();
  return branchId
    ? mockPumps.filter((p) => p.branchId === branchId)
    : mockPumps;
}

// Shift Balances
export async function mockGetShiftBalances(
  branchId?: string
): Promise<ShiftBalance[]> {
  await delay();
  return branchId
    ? mockShiftBalances.filter((s) => s.branchId === branchId)
    : mockShiftBalances;
}

export async function mockCreateShiftBalance(
  data: {
    pumpId: string;
    shiftType: "morning" | "evening";
    closingMeter: number;
    date: string;
  },
  userId: string,
  branchId: string
): Promise<ShiftBalance> {
  await delay(800);

  const pump = mockPumps.find((p) => p.id === data.pumpId);
  if (!pump) throw new Error("Pump not found");

  const branch = mockBranches.find((b) => b.id === branchId);
  const user = mockUsers.find((u) => u.id === userId);

  const openingMeter = pump.meterReading;
  const volumeSold = data.closingMeter - openingMeter;
  const pricePerLiter =
    pump.fuelType === "gasoline" ? 1.5 : pump.fuelType === "diesel" ? 1.4 : 1.3;

  const newShiftBalance: ShiftBalance = {
    id: `shift-${Date.now()}`,
    branchId,
    branchName: branch?.name,
    pumpId: data.pumpId,
    pumpName: pump.pumpName,
    fuelType: pump.fuelType,
    shiftType: data.shiftType,
    openingMeter,
    closingMeter: data.closingMeter,
    volumeSold,
    pricePerLiter,
    totalAmount: volumeSold * pricePerLiter,
    date: data.date,
    recordedBy: userId,
    recordedByName: user?.name,
    createdAt: new Date().toISOString(),
  };

  mockShiftBalances.push(newShiftBalance);

  // Update pump meter reading
  pump.meterReading = data.closingMeter;
  pump.lastUpdated = new Date().toISOString();

  return newShiftBalance;
}

// Expenses
export async function mockGetExpenses(branchId?: string): Promise<Expense[]> {
  await delay();
  return branchId
    ? mockExpenses.filter((e) => e.branchId === branchId)
    : mockExpenses;
}

export async function mockCreateExpense(
  data: ExpenseFormData,
  userId: string,
  branchId: string
): Promise<Expense> {
  await delay(800);

  const branch = mockBranches.find((b) => b.id === branchId);
  const user = mockUsers.find((u) => u.id === userId);

  const newExpense: Expense = {
    id: `expense-${Date.now()}`,
    branchId,
    branchName: branch?.name,
    date: data.date,
    amount: data.amount,
    category: data.category as any,
    description: data.description,
    recordedBy: userId,
    recordedByName: user?.name,
    createdAt: new Date().toISOString(),
  };

  mockExpenses.push(newExpense);
  return newExpense;
}

// Bank Deposits
export async function mockGetBankDeposits(
  branchId?: string
): Promise<BankDeposit[]> {
  await delay();
  return branchId
    ? mockBankDeposits.filter((d) => d.branchId === branchId)
    : mockBankDeposits;
}

export async function mockCreateBankDeposit(
  data: BankDepositFormData,
  userId: string,
  branchId: string
): Promise<BankDeposit> {
  await delay(800);

  const branch = mockBranches.find((b) => b.id === branchId);
  const user = mockUsers.find((u) => u.id === userId);

  const newDeposit: BankDeposit = {
    id: `deposit-${Date.now()}`,
    branchId,
    branchName: branch?.name,
    date: data.date,
    amount: data.amount,
    referenceNumber: data.referenceNumber,
    bankName: data.bankName,
    recordedBy: userId,
    recordedByName: user?.name,
    createdAt: new Date().toISOString(),
  };

  mockBankDeposits.push(newDeposit);
  return newDeposit;
}

// Fuel Deliveries
export async function mockGetFuelDeliveries(
  branchId?: string
): Promise<FuelDelivery[]> {
  await delay();
  return branchId
    ? mockFuelDeliveries.filter((d) => d.toBranchId === branchId)
    : mockFuelDeliveries;
}

export async function mockCreateFuelDelivery(
  data: FuelDeliveryFormData,
  userId: string
): Promise<FuelDelivery> {
  await delay(800);

  const branch = mockBranches.find((b) => b.id === data.toBranchId);
  const user = mockUsers.find((u) => u.id === userId);

  const newDelivery: FuelDelivery = {
    id: `delivery-${Date.now()}`,
    toBranchId: data.toBranchId,
    toBranchName: branch?.name,
    fuelType: data.fuelType,
    quantityLiters: data.quantityLiters,
    pricePerLiter: data.pricePerLiter,
    totalCost: data.quantityLiters * data.pricePerLiter,
    deliveryDate: data.deliveryDate,
    status: "pending",
    notes: data.notes,
    createdBy: userId,
    createdByName: user?.name,
    createdAt: new Date().toISOString(),
  };

  mockFuelDeliveries.push(newDelivery);
  return newDelivery;
}

export async function mockAcknowledgeFuelDelivery(
  deliveryId: string,
  data: AcknowledgeFuelFormData,
  userId: string
): Promise<FuelDelivery> {
  await delay(800);

  const index = mockFuelDeliveries.findIndex((d) => d.id === deliveryId);
  if (index === -1) throw new Error("Delivery not found");

  const user = mockUsers.find((u) => u.id === userId);

  mockFuelDeliveries[index] = {
    ...mockFuelDeliveries[index],
    status: "acknowledged",
    actualQuantityReceived: data.actualQuantityReceived,
    supplierName: data.supplierName,
    acknowledgedBy: userId,
    acknowledgedByName: user?.name,
    acknowledgedAt: new Date().toISOString(),
    notes: data.notes || mockFuelDeliveries[index].notes,
  };

  return mockFuelDeliveries[index];
}

// Managers (for dropdown in branch form)
export async function mockGetManagers(): Promise<User[]> {
  await delay();
  return mockUsers.filter((u) => u.role === "manager");
}
