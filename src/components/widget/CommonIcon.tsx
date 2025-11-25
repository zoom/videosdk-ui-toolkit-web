import React, { forwardRef, ForwardRefExoticComponent, RefAttributes } from "react";
import { LucideProps } from "lucide-react";

export const CommonIcon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<HTMLDivElement>> =
  forwardRef<HTMLDivElement, LucideProps & { children?: React.ReactNode; className?: string }>(({ children }, ref) => {
    return <>{children}</>;
  });

CommonIcon.displayName = "CommonIcon";
