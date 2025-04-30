// components/boilerplate/InfoField.tsx

import React from "react";

interface InfoFieldProps {
  icon?: React.ComponentType<{ className?: string }>;
  label?: string;
  value?: string | null;
  className?: string;
}

const InfoField: React.FC<InfoFieldProps> = ({
  icon: Icon,
  label,
  value,
  className = "",
}) => (
  <div className={`flex items-center gap-2 ${className}`}>
    {Icon && (
      <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
    )}
    {label && <strong className="mr-1 text-sm text-gray-700">{label}:</strong>}
    {value || "N/A"}
  </div>
);

export default InfoField;
