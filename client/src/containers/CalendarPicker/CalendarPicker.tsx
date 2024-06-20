"use client";

import * as React from "react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button, Calendar, CalendarProps, Popover } from "@/components/ui";
import { FiCalendar } from "react-icons/fi";

interface Props extends Pick<CalendarProps, "id"> {
  value: string | undefined;
  onChange: (day: string | undefined) => void;
  onBlur?: CalendarProps["onDayBlur"];
}

export const CalendarPicker = ({
  value,
  onChange,
  onBlur,
  ...props
}: Props): JSX.Element => {
  return (
    <Popover.root>
      <Popover.trigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal px-3 border-gray-200 hover:border-brand-200",
            !value && "text-muted-foreground"
          )}
        >
          <FiCalendar className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </Popover.trigger>
      <Popover.content className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={(day) => onChange(day && day.toDateString())}
          initialFocus
          onDayBlur={onBlur}
          className="bg-white"
          {...props}
        />
      </Popover.content>
    </Popover.root>
  );
};
