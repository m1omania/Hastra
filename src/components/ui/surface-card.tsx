import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type SurfaceCardProps = ComponentPropsWithoutRef<"div">;

export function SurfaceCard({ className, ...props }: SurfaceCardProps) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border border-white/10 bg-white/[0.04] p-6",
        className,
      )}
      {...props}
    />
  );
}
