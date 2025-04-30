"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { CirclePlus, Trash } from "lucide-react";
import InfoField from "@/components/boilerplate/InfoField";
import { LucideIcon } from "lucide-react";

interface DynamicFieldProps {
  fields: { value: string }[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, value: string) => void;
  label: string;
  icon: LucideIcon;
  placeholder: string;
  maxFields?: number;
  addButtonLabel?: string;
}

export function DynamicField({
  fields,
  onAdd,
  onRemove,
  onChange,
  label,
  icon,
  placeholder,
  maxFields = Infinity,
  addButtonLabel = "Adicionar",
}: DynamicFieldProps) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <FormLabel>
          <InfoField icon={icon} value={label} className="text-sm" />
        </FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="flex items-center gap-1"
          disabled={fields.length >= maxFields}
        >
          <CirclePlus size={16} />
          {addButtonLabel}
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              placeholder={`${placeholder} ${index + 1}`}
              value={field.value}
              onChange={(e) => onChange(index, e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => onRemove(index)}
              disabled={fields.length === 1}
            >
              <Trash size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
