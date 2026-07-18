interface LiveBadgeProps {
  label: string
}

export function LiveBadge({ label }: LiveBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-card/90 py-1.5 pl-3 pr-4 text-[13px] font-medium tracking-tight text-foreground shadow-[0_1px_2px_rgba(20,109,141,0.08)] backdrop-blur">
      <span className="flex h-3.5 w-4 items-end justify-between" aria-hidden="true">
        <span className="h-full w-[3px] origin-bottom rounded-full bg-brand-green animate-equalize" />
        <span className="h-full w-[3px] origin-bottom rounded-full bg-brand-blue animate-equalize [animation-delay:180ms]" />
        <span className="h-full w-[3px] origin-bottom rounded-full bg-brand-grass animate-equalize [animation-delay:360ms]" />
        <span className="h-full w-[3px] origin-bottom rounded-full bg-brand-deep-blue animate-equalize [animation-delay:540ms]" />
      </span>
      <span className="h-3.5 w-px bg-border" />
      {label}
    </span>
  )
}
