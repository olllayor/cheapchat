import { BrushSpinner } from "@/components/ui/brush-spinner"

type SidebarConversationRowProps = {
  isActive: boolean;
  isCollapsed: boolean;
  isRunning: boolean;
  primaryLabel: string;
  secondaryLabel: string | null;
  timestampLabel: string | null;
  jumpLabel?: string | null;
  showJumpHint?: boolean;
  status: 'idle' | 'streaming' | 'error' | 'aborted';
  hideTimestamp?: boolean;
};

function getCollapsedGlyph(label: string) {
  const match = label.trim().match(/[A-Za-z0-9]/);
  return (match?.[0] ?? '•').toUpperCase();
}

export function SidebarConversationRow({
  isActive,
  isCollapsed,
  isRunning,
  primaryLabel,
  secondaryLabel,
  timestampLabel,
  jumpLabel,
  showJumpHint = false,
  status,
  hideTimestamp = false,
}: SidebarConversationRowProps) {
  if (isCollapsed) {
    const glyph = getCollapsedGlyph(primaryLabel);

    return (
      <div className="relative flex items-center justify-center">
        <span
          aria-hidden="true"
          className={`flex h-8 w-8 items-center justify-center rounded-xl border text-[11px] font-semibold tracking-[0.01em] transition ${
            isActive
              ? 'border-white/12 bg-white/[0.08] text-white/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
              : 'border-white/6 bg-white/[0.03] text-white/58 group-hover:border-white/10 group-hover:bg-white/[0.05] group-hover:text-white/74'
          }`}
          title={primaryLabel}
        >
          {glyph}
        </span>

        {isRunning ? (
          <BrushSpinner size={10} strokeWidth={1.5} color="#22d3ee" glowColor="rgba(34,211,238,0.3)" speed={1.5} className="absolute right-0 top-0" />
        ) : null}
      </div>
    );
  }

  return (
    <>
      {isRunning ? (
        <BrushSpinner size={12} strokeWidth={1.5} color="#22d3ee" glowColor="rgba(34,211,238,0.3)" speed={1.5} />
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-medium leading-[18px] text-white/92" title={primaryLabel}>
          {primaryLabel}
        </div>
        {secondaryLabel ? (
          <div
            className={`truncate pt-0.5 text-[11px] leading-4 ${
              status === 'streaming'
                ? 'animate-pulse text-white/48'
                : status === 'error'
                  ? 'text-error-text/80'
                  : status === 'aborted'
                    ? 'text-text-muted'
                    : 'text-text-muted'
            }`}
            title={secondaryLabel}
          >
            {secondaryLabel}
          </div>
        ) : null}
      </div>

      <div className="relative ml-2 h-4 w-5 shrink-0 self-start">
        {timestampLabel ? (
          <span
            className={`absolute inset-0 text-right text-[10px] font-medium leading-4 tabular-nums text-white/34 transition-opacity group-hover:opacity-0 ${
              hideTimestamp || showJumpHint ? 'opacity-0' : ''
            }`}
          >
            {timestampLabel}
          </span>
        ) : null}
        {showJumpHint && jumpLabel ? (
          <span className="absolute right-0 top-0 inline-flex h-5 items-center rounded-full border border-white/10 bg-white/[0.07] px-1.5 font-mono text-[10px] leading-none text-white/62 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            {jumpLabel}
          </span>
        ) : null}
      </div>
    </>
  );
}
