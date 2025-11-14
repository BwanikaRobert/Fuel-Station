'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mockCreateShiftBalance } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CheckCircle2 } from 'lucide-react';
import { ShiftBalanceFormData, FuelPump, ShiftType } from '@/lib/types';

const shiftBalanceSchema = z.object({
  pumpId: z.string().min(1, 'Please select a pump'),
  shiftType: z.enum(['morning', 'evening'], {
    message: 'Please select a shift type',
  }),
  closingMeter: z.number().min(0, 'Closing meter must be positive'),
  date: z.string().min(1, 'Date is required'),
});

interface RecordShiftBalanceFormProps {
  pumps: FuelPump[];
  userId: string;
  branchId: string;
}

export function RecordShiftBalanceForm({ pumps, userId, branchId }: RecordShiftBalanceFormProps) {
  const [successMessage, setSuccessMessage] = useState('');
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ShiftBalanceFormData>({
    resolver: zodResolver(shiftBalanceSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      shiftType: 'morning',
    },
  });

  const selectedPumpId = watch('pumpId');
  const selectedPump = pumps?.find((p) => p.id === selectedPumpId);

  const createMutation = useMutation({
    mutationFn: (data: ShiftBalanceFormData) =>
      mockCreateShiftBalance(
        {
          pumpId: data.pumpId,
          shiftType: data.shiftType,
          closingMeter: data.closingMeter,
          date: data.date,
        },
        userId,
        branchId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shift-balances'] });
      queryClient.invalidateQueries({ queryKey: ['pumps'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setSuccessMessage('Shift balance recorded successfully!');
      reset({
        pumpId: '',
        shiftType: 'morning',
        closingMeter: 0,
        date: new Date().toISOString().split('T')[0],
      });
      setTimeout(() => setSuccessMessage(''), 5000);
    },
  });

  const onSubmit = (data: ShiftBalanceFormData) => {
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
          <CardTitle>Record Shift Balance</CardTitle>
          <CardDescription>
            Select a pump and enter the closing meter reading
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register('date')} />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>
        <div className='flex justify-between'>
            <div className="space-y-2">
              <Label htmlFor="shiftType">Shift Type</Label>
              <Select
                value={watch('shiftType')}
                onValueChange={(value) => setValue('shiftType', value as ShiftType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning Shift</SelectItem>
                  <SelectItem value="evening">Evening Shift</SelectItem>
                </SelectContent>
              </Select>
              {errors.shiftType && (
                <p className="text-sm text-destructive">{errors.shiftType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pumpId">Select Pump</Label>
              <Select
                value={watch('pumpId')}
                onValueChange={(value) => setValue('pumpId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a pump" />
                </SelectTrigger>
                <SelectContent>
                  {pumps?.map((pump) => (
                    <SelectItem key={pump.id} value={pump.id}>
                      {pump.pumpName} - {pump.fuelType} (Current: {pump.meterReading.toLocaleString()} L)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.pumpId && (
                <p className="text-sm text-destructive">{errors.pumpId.message}</p>
              )}
            </div>
           </div>
            {selectedPump && (
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pump:</span>
                  <span className="font-medium">{selectedPump.pumpName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fuel Type:</span>
                  <Badge variant="secondary" className="capitalize">
                    {selectedPump.fuelType}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Opening Meter:</span>
                  <span className="font-medium">
                    {selectedPump.meterReading.toLocaleString()} L
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="closingMeter">Closing Meter Reading (Liters)</Label>
              <Input
                id="closingMeter"
                type="number"
                step="0.01"
                placeholder="150500.00"
                {...register('closingMeter', { valueAsNumber: true })}
              />
              {errors.closingMeter && (
                <p className="text-sm text-destructive">{errors.closingMeter.message}</p>
              )}
            </div>

            {selectedPump && watch('closingMeter') > 0 && (
              <div className="rounded-lg bg-primary/10 p-4 space-y-2">
                <p className="text-sm font-medium">Calculation Preview:</p>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Volume Sold:</span>
                  <span className="font-bold">
                    {(watch('closingMeter') - selectedPump.meterReading).toLocaleString()} L
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price per Liter:</span>
                  <span className="font-medium">
                    ${selectedPump.fuelType === 'gasoline' ? '1.50' : selectedPump.fuelType === 'diesel' ? '1.40' : '1.30'}
                  </span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-bold text-lg">
                    ${((watch('closingMeter') - selectedPump.meterReading) * 
                      (selectedPump.fuelType === 'gasoline' ? 1.5 : selectedPump.fuelType === 'diesel' ? 1.4 : 1.3)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Recording...' : 'Record Shift Balance'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
