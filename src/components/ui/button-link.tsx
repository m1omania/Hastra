import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  intent?: "primary" | "secondary" | "ghost";
};

const intentClasses: Record<NonNullable<ButtonLinkProps["intent"]>, string> = {
  primary:
    "btn-shimmer relative overflow-hidden bg-[var(--color-accent)] !text-[#1c2338] shadow-[0_4px_14px_rgba(251,215,1,0.35)] hover:bg-[var(--color-accent-strong)] hover:!text-[#1c2338]",
  secondary:
    "relative border-2 border-white/70 bg-white/10 backdrop-blur-md text-white hover:bg-white/15",
  ghost: "text-[var(--color-muted)] hover:text-white",
};

export function ButtonLink({
  className,
  intent = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-transform duration-200 ease-out hover:scale-[1.04] active:scale-[0.97] active:translate-y-0.5",
        intentClasses[intent],
        className,
      )}
      {...props}
    />
  );
}
