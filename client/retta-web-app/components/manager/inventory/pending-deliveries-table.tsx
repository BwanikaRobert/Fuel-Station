"use client";

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
import { Badge } from "@/components/ui/badge";
import { FuelDelivery } from "@/lib/types";

interface PendingDeliveriesTableProps {
  deliveries: FuelDelivery[];
}

export function PendingDeliveriesTable({
  deliveries,
}: PendingDeliveriesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Deliveries</CardTitle>
        <CardDescription>
          Fuel deliveries awaiting acknowledgment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Fuel Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price/L</TableHead>
                <TableHead className="text-right">Total Cost</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries && deliveries.length > 0 ? (
                deliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell>
                      {new Date(delivery.deliveryDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {delivery.fuelType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {delivery.quantityLiters.toLocaleString()} L
                    </TableCell>
                    <TableCell>
                      UGX {delivery.pricePerLiter.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      UGX {delivery.totalCost.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Pending</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-8"
                  >
                    No pending deliveries
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
