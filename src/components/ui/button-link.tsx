import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  intent?: "primary" | "secondary" | "ghost";
};

const intentClasses: Record<NonNullable<ButtonLinkProps["intent"]>, string> = {
  primary:
    "bg-[var(--color-accent)] !text-[#1c2338] shadow-[0_4px_14px_rgba(251,215,1,0.35)] hover:bg-[var(--color-accent-strong)] hover:!text-[#1c2338]",
  secondary:
    "border-2 border-white bg-transparent text-white hover:bg-white/10",
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
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200",
        intentClasses[intent],
        className,
      )}
      {...props}
    />
  );
}
