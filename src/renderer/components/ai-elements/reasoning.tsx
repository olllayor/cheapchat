"use client";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { BrainCircuit, ChevronDown } from "lucide-react";
import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { MessageResponse } from "./message";

type ReasoningContextValue = {
  duration?: number;
  isOpen: boolean;
  isStreaming: boolean;
  setIsOpen: (open: boolean) => void;
};

const ReasoningData = createContext<ReasoningContextValue | null>(null);

export function useReasoning() {
  const value = useContext(ReasoningData);

  if (!value) {
    throw new Error("Reasoning components must be used within <Reasoning>.");
  }

  return value;
}

function formatDuration(duration?: number) {
  if (duration == null || Number.isNaN(duration)) {
    return undefined;
  }

  if (duration < 60) {
    return `${duration}s`;
  }

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
}

export type ReasoningProps = ComponentProps<typeof Collapsible> & {
  duration?: number;
  isStreaming?: boolean;
};

export const Reasoning = ({
  children,
  className,
  defaultOpen = false,
  duration: durationProp,
  isStreaming = false,
  onOpenChange,
  open,
  ...props
}: ReasoningProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [liveDuration, setLiveDuration] = useState<number | undefined>(durationProp);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncontrolledOpen;

  const setIsOpen = (nextOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  };

  useEffect(() => {
    if (durationProp != null) {
      setLiveDuration(durationProp);
    }
  }, [durationProp]);

  useEffect(() => {
    if (!isStreaming) {
      setIsOpen(false);
      return;
    }

    setIsOpen(true);

    const startedAt = Date.now();
    setLiveDuration(0);

    const interval = window.setInterval(() => {
      setLiveDuration(Math.max(1, Math.floor((Date.now() - startedAt) / 1000)));
    }, 1000);

    return () => {
      window.clearInterval(interval);
      setLiveDuration(Math.max(1, Math.round((Date.now() - startedAt) / 1000)));
    };
  }, [isStreaming]);

  const value = useMemo<ReasoningContextValue>(
    () => ({
      duration: durationProp ?? liveDuration,
      isOpen,
      isStreaming,
      setIsOpen,
    }),
    [durationProp, isOpen, isStreaming, liveDuration]
  );

  return (
    <ReasoningData.Provider value={value}>
      <Collapsible onOpenChange={setIsOpen} open={isOpen} {...props}>
        <div
          className={cn(
            "w-full rounded-[18px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]",
            className
          )}
        >
          {children}
        </div>
      </Collapsible>
    </ReasoningData.Provider>
  );
};

export type ReasoningTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
  getThinkingMessage?: (isStreaming: boolean, duration?: number) => ReactNode;
};

export const ReasoningTrigger = ({
  children,
  className,
  getThinkingMessage,
  ...props
}: ReasoningTriggerProps) => {
  const { duration, isOpen, isStreaming } = useReasoning();
  const durationLabel = formatDuration(duration);

  const defaultLabel = getThinkingMessage?.(isStreaming, duration) ?? (
    <>
      <span className="inline-flex items-center gap-2 text-white/72">
        {isStreaming ? <Spinner className="size-3.5 text-[#90a6ff]" /> : <BrainCircuit className="size-3.5 text-[#90a6ff]" />}
        <span>{isStreaming ? "Reasoning" : "Thought process"}</span>
      </span>
      {durationLabel ? (
        <span className="rounded-full border border-white/8 bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium tabular-nums text-white/46">
          {durationLabel}
        </span>
      ) : null}
    </>
  );

  return (
    <CollapsibleTrigger
      className={cn(
        "flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-[11px] font-medium tracking-[0.01em] transition hover:bg-white/[0.025]",
        className
      )}
      {...props}
    >
      {children ?? defaultLabel}
      <ChevronDown
        className={cn(
          "size-3.5 shrink-0 text-white/38 transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </CollapsibleTrigger>
  );
};

export type ReasoningContentProps = Omit<ComponentProps<typeof CollapsibleContent>, "children"> & {
  children: string;
};

export const ReasoningContent = ({
  children,
  className,
  ...props
}: ReasoningContentProps) => (
  <CollapsibleContent
    className={cn("overflow-hidden border-t border-white/7 px-3.5 pb-3.5 pt-2.5", className)}
    {...props}
  >
    <MessageResponse className="text-[13px] leading-6 text-white/60 [&_p]:my-1 [&_p+_p]:mt-1.5 [&_[data-streamdown='inline-code']]:bg-white/[0.03] [&_[data-streamdown='inline-code']]:text-white/78 [&_pre]:text-[12.5px]">
      {children}
    </MessageResponse>
  </CollapsibleContent>
);

export type ReasoningBodyProps = HTMLAttributes<HTMLDivElement>;

export const ReasoningBody = ({ className, ...props }: ReasoningBodyProps) => (
  <div className={cn("px-3.5 py-3", className)} {...props} />
);
