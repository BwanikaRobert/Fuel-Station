'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Fuel } from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      href: '/manager/shift-balancing',
      icon: Fuel,
      title: 'Record Shift Balance',
      description: 'Enter pump readings',
    },
    {
      href: '/manager/expenses',
      icon: DollarSign,
      title: 'Record Expense',
      description: 'Add new expense',
    },
    {
      href: '/manager/fuel-receipts',
      icon: TrendingUp,
      title: 'Fuel Receipts',
      description: 'Acknowledge deliveries',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {actions.map((action) => (
            <a
              key={action.href}
              href={action.href}
              className="flex flex-col items-center justify-center p-6 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <action.icon className="h-8 w-8 mb-2 text-primary" />
              <p className="font-medium">{action.title}</p>
              <p className="text-xs text-muted-foreground text-center mt-1">
                {action.description}
              </p>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
