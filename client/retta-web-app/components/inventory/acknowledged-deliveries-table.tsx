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

interface AcknowledgedDeliveriesTableProps {
  deliveries: FuelDelivery[];
}

export function AcknowledgedDeliveriesTable({
  deliveries,
}: AcknowledgedDeliveriesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acknowledged Deliveries</CardTitle>
        <CardDescription>
          Fuel deliveries that have been received and confirmed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Fuel Type</TableHead>
                <TableHead>Expected</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Acknowledged By</TableHead>
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
                    <TableCell className="font-medium">
                      {delivery.actualQuantityReceived?.toLocaleString() || "-"}{" "}
                      L
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {delivery.acknowledgedByName || "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      UGX {delivery.totalCost.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-600">
                        Acknowledged
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground py-8"
                  >
                    No acknowledged deliveries yet
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
