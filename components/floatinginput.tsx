import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  label?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function FloatingInput({
  id = "email",
  label = "Email",
  value = "",
  onChange,
  ...props
}: FloatingInputProps) {
  return (
    <div className="relative w-full">
      <Input
        id={id}
        value={value}
        onChange={onChange}
        className="h-10 px-2"
        {...props}
      />
      <Label
        htmlFor={id}
        className="absolute left-2 top-[-10px] bg-white px-1 text-xs text-gray-500 pointer-events-none"
      >
        {label}
      </Label>
    </div>
  );
}
