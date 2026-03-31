import { ArrowUp, Square } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import type { ModelSummary } from '../../shared/contracts';
import { ModelSelector } from './ModelSelector';
import {
  PromptInput,
  type PromptInputMessage,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputSubmit,
} from './ai-elements/prompt-input';

type ComposerProps = {
  value: string;
  disabled: boolean;
  isStreaming: boolean;
  models: ModelSummary[];
  selectedModelId: string | null;
  onChange: (value: string) => void;
  onSend: () => void;
  onAbort: () => void;
  onSelectModel: (modelId: string) => void;
  onRefreshModels?: () => void;
  isRefreshingModels?: boolean;
};

export function Composer({
  value,
  disabled,
  isStreaming,
  models,
  selectedModelId,
  onChange,
  onSend,
  onAbort,
  onSelectModel,
  onRefreshModels,
  isRefreshingModels,
}: ComposerProps) {
  const [modelPickerOpen, setModelPickerOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const handleSubmit = (message: PromptInputMessage) => {
    if (message.text.trim() && !disabled && !isStreaming) {
      onSend();
    }
  };

  // Determine status for PromptInputSubmit
  const status = isStreaming ? 'streaming' : 'ready';

  return (
    <div className="px-4 py-4">
      <div className="mx-auto max-w-content-max">
        <PromptInput
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-xl border border-border-default bg-bg-surface transition-all focus-within:border-border-medium focus-within:bg-bg-elevated"
        >
          <PromptInputBody className="px-4 pt-3">
            <PromptInputTextarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!disabled && !isStreaming && value.trim()) onSend();
                }
              }}
              disabled={disabled}
              rows={1}
              placeholder="Message..."
              className="w-full resize-none border-0 bg-transparent text-sm leading-6 text-text-primary outline-none placeholder:text-text-muted disabled:cursor-not-allowed disabled:opacity-60"
              style={{ maxHeight: '200px' }}
              name="message"
            />
          </PromptInputBody>

          <PromptInputFooter className="flex items-center justify-between px-3 pb-3">
            <PromptInputTools className="flex items-center gap-1">
              <ModelSelector
                models={models}
                selectedModelId={selectedModelId}
                disabled={isStreaming}
                open={modelPickerOpen}
                onOpenChange={setModelPickerOpen}
                onSelect={onSelectModel}
                onRefresh={onRefreshModels}
                isRefreshing={isRefreshingModels}
              />
            </PromptInputTools>

            {isStreaming ? (
              <button
                type="button"
                onClick={onAbort}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-error/10 text-error transition hover:bg-error/20"
              >
                <Square className="h-4 w-4" />
              </button>
            ) : (
              <PromptInputSubmit
                status={status as 'ready' | 'streaming'}
                disabled={disabled || !value.trim()}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-text-primary text-bg-base transition hover:bg-text-secondary disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowUp className="h-4 w-4" />
              </PromptInputSubmit>
            )}
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
