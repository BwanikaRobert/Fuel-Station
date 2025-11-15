"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { mockUsers, mockGetBranches } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Users,
  Building2,
  Mail,
  UserPlus,
  Plus,
  Copy,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export default function UsersPage() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);

  // Form states
  const [newUser, setNewUser] = useState({
    name: "",
    role: "manager" as "admin" | "manager" | "accountant",
    branchId: "",
  });

  // Generate email from name and role
  const generateEmail = (name: string, role: string) => {
    if (!name.trim()) return "";
    const firstName = name.trim().split(" ")[0].toLowerCase();
    return `${firstName}@${role}.rettasolutions.com`;
  };

  const [newBranch, setNewBranch] = useState({
    name: "",
    location: "",
    phoneNumber: "",
    managerId: "",
  });

  const { data: branches, isLoading: branchesLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: mockGetBranches,
  });

  // Using mockUsers directly since there's no async function
  const users = mockUsers;
  const isLoading = branchesLoading;

  // Mock new users with default passwords - replace with actual API call
  const [newUsersWithDefaultPassword] = useState([
    {
      id: "temp-1",
      name: "Alice Johnson",
      email: "alice@manager.rettasolutions.com",
      role: "manager" as const,
      branchId: "branch-1",
      resetLink: "https://fuelstation.app/reset-password/abc123def456",
      createdAt: "2024-11-14T10:30:00Z",
    },
    {
      id: "temp-2",
      name: "Bob Smith",
      email: "bob@accountant.rettasolutions.com",
      role: "accountant" as const,
      resetLink: "https://fuelstation.app/reset-password/xyz789ghi012",
      createdAt: "2024-11-15T08:15:00Z",
    },
  ]);

  const copyToClipboard = (link: string, userName: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied", {
      description: `Password reset link for ${userName} copied to clipboard.`,
    });
  };

  const handleAddUser = () => {
    // Generate email automatically
    const email = generateEmail(newUser.name, newUser.role);

    // Mock save - replace with actual API call
    toast.success("User added", {
      description: `${newUser.name} (${email}) has been added successfully.`,
    });
    setIsAddUserOpen(false);
    setNewUser({ name: "", role: "manager", branchId: "" });
  };

  const handleAddBranch = () => {
    // Mock save - replace with actual API call
    toast.success("Branch added", {
      description: `${newBranch.name} has been added successfully.`,
    });
    setIsAddBranchOpen(false);
    setNewBranch({ name: "", location: "", phoneNumber: "", managerId: "" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading data...</p>
        </div>
      </div>
    );
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default";
      case "manager":
        return "secondary";
      case "accountant":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    return status === "active" ? "default" : "secondary";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Users & Branches
          </h1>
          <p className="text-muted-foreground">
            Manage system users and branch information
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setIsAddUserOpen(true)}
          >
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
          <Button className="gap-2" onClick={() => setIsAddBranchOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Branch
          </Button>
        </div>
      </div>

      {/* New Users with Default Passwords */}
      {newUsersWithDefaultPassword.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
              Pending Password Reset
            </CardTitle>
            <CardDescription className="text-amber-800 dark:text-amber-200">
              New users who haven&apos;t changed their default password. Copy
              and send the reset link to each user.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-amber-100/50 dark:hover:bg-amber-900/20">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Reset Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newUsersWithDefaultPassword.map((user) => {
                  const userBranch = branches?.find(
                    (b) => b.id === user.branchId
                  );
                  const createdDate = new Date(
                    user.createdAt
                  ).toLocaleDateString();

                  return (
                    <TableRow
                      key={user.id}
                      className="hover:bg-amber-100/50 dark:hover:bg-amber-900/20"
                    >
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {userBranch ? (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{userBranch.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            All Branches
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {createdDate}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() =>
                            copyToClipboard(user.resetLink, user.name)
                          }
                        >
                          <Copy className="h-3 w-3" />
                          Copy Link
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            System Users
          </CardTitle>
          <CardDescription>
            Users who have access to the fuel station management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const userBranch = branches?.find(
                  (b) => b.id === user.branchId
                );
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {userBranch ? (
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{userBranch.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          All Branches
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        disabled={user.role === "admin"}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Empty State */}
          {users.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No users found</p>
              <p className="text-sm text-muted-foreground">
                Add users to manage the system
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Branches Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Branches</CardTitle>
          <CardDescription>
            All fuel station branches in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches?.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      {branch.name}
                    </div>
                  </TableCell>
                  <TableCell>{branch.location}</TableCell>
                  <TableCell>
                    {branch.managerName ? (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{branch.managerName}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No Manager
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-mono">
                      {branch.phoneNumber}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(branch.status)}>
                      {branch.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Empty State */}
          {(!branches || branches.length === 0) && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No branches found</p>
              <p className="text-sm text-muted-foreground">
                Add branches to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Add New User
            </DialogTitle>
            <DialogDescription>
              Create a new user account for the system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">Name</Label>
              <Input
                id="user-name"
                placeholder="Enter full name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role">Role</Label>
              <Select
                value={newUser.role}
                onValueChange={(value: "admin" | "manager" | "accountant") =>
                  setNewUser({ ...newUser, role: value })
                }
              >
                <SelectTrigger id="user-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="accountant">Accountant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Auto-generated email preview */}
            {newUser.name && (
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">
                  Generated Email
                </Label>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-mono">
                    {generateEmail(newUser.name, newUser.role)}
                  </span>
                </div>
              </div>
            )}
            {newUser.role === "manager" && (
              <div className="space-y-2">
                <Label htmlFor="user-branch">Branch</Label>
                <Select
                  value={newUser.branchId}
                  onValueChange={(value) =>
                    setNewUser({ ...newUser, branchId: value })
                  }
                >
                  <SelectTrigger id="user-branch">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches?.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Branch Modal */}
      <Dialog open={isAddBranchOpen} onOpenChange={setIsAddBranchOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Add New Branch
            </DialogTitle>
            <DialogDescription>
              Create a new fuel station branch
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="branch-name">Branch Name</Label>
              <Input
                id="branch-name"
                placeholder="e.g., Downtown Station"
                value={newBranch.name}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch-location">Location</Label>
              <Input
                id="branch-location"
                placeholder="e.g., Main Street, Downtown"
                value={newBranch.location}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, location: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch-phone">Phone Number</Label>
              <Input
                id="branch-phone"
                placeholder="+1234567890"
                value={newBranch.phoneNumber}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, phoneNumber: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch-manager">Manager (Optional)</Label>
              <Select
                value={newBranch.managerId || "none"}
                onValueChange={(value) =>
                  setNewBranch({
                    ...newBranch,
                    managerId: value === "none" ? "" : value,
                  })
                }
              >
                <SelectTrigger id="branch-manager">
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Manager</SelectItem>
                  {users
                    .filter((u) => u.role === "manager")
                    .map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddBranchOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBranch}>Add Branch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
