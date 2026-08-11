import type { ReactNode } from "react";

import { cx } from "@/lib/format";

export function Tag({
  children,
  emphasis = false,
}: {
  children: ReactNode;
  emphasis?: boolean;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        emphasis
          ? "border-transparent bg-accent-soft text-accent"
          : "bg-surface text-muted",
      )}
    >
      {children}
    </span>
  );
}

export function TagList({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item}>
          <Tag>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}
