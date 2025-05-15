"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DatePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { formatDate } from "@/lib/date-utils"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export interface CalendarProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  disabledDates?: Date[];
  className?: string;
}

function Calendar({
  value,
  onChange,
  disabledDates,
  className,
}: CalendarProps) {
  const disabledDate = (date: Date) => {
    if (!date) return true;
    return (disabledDates ?? []).some(disabled => format(disabled, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
      <DatePicker
        value={value}
        onChange={onChange}
        disablePast
        disableFuture
        shouldDisableDate={disabledDate}
        slotProps={{
          textField: {
            fullWidth: true,
            size: 'small',
            className,
            InputProps: {
              sx: {
                backgroundColor: 'white',
              }
            }
          }
        }}
      />
    </LocalizationProvider>
  );
}

Calendar.displayName = "Calendar"

export { Calendar }
