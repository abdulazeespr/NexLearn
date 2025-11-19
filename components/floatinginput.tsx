import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FloatingInputProps = React.ComponentProps<typeof Input> & {
  id: string;
  label: string;
};

export function FloatingInput({ id, label, className, ...props }: FloatingInputProps) {
  return (
    <div className="relative w-full">
      <Input
        id={id}
        className={cn(
          "peer h-12 px-3 pt-6",
          "focus-visible:ring-0 focus-visible:ring-offset-0",
          className
        )}
        placeholder=" "
        {...props}
      />
      <Label
        htmlFor={id}
        className={cn(
          "absolute left-3 top-3 text-gray-500 transition-all",
          "peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400",
          "peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-700",
          "pointer-events-none"
        )}
      >
        {label}
      </Label>
    </div>
  );
}
