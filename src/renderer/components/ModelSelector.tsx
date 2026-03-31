import { Check, ChevronDown } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';

import {
  ModelSelector as AIModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorName,
  ModelSelectorTrigger,
} from '@/components/ai-elements/model-selector';

import type { ModelSummary } from '../../shared/contracts';

type ModelSelectorProps = {
  models: ModelSummary[];
  selectedModelId: string | null;
  disabled: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (modelId: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
};

const extractProvider = (modelId: string): string => {
  const parts = modelId.split('/');
  return parts.length > 1 ? parts[0] : 'other';
};

const extractModelName = (modelId: string): string => {
  const parts = modelId.split('/');
  return parts.length > 1 ? parts.slice(1).join('/') : modelId;
};

export function ModelSelector({
  models,
  selectedModelId,
  disabled,
  open,
  onOpenChange,
  onSelect,
  onRefresh,
  isRefreshing,
}: ModelSelectorProps) {
  const [showFreeOnly, setShowFreeOnly] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedModel = useMemo(() => models.find((m) => m.id === selectedModelId) ?? null, [models, selectedModelId]);

  const grouped = useMemo(() => {
    const filtered = models.filter((model) => {
      if (showFreeOnly && !model.isFree) return false;
      return true;
    });

    const groups = new Map<string, ModelSummary[]>();

    for (const model of filtered) {
      const provider = extractProvider(model.id);
      if (!groups.has(provider)) groups.set(provider, []);
      groups.get(provider)!.push(model);
    }

    return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [models, showFreeOnly]);

  const totalCount = useMemo(() => grouped.reduce((sum, [, list]) => sum + list.length, 0), [grouped]);

  const handleSelect = useCallback(
    (modelId: string) => {
      onSelect(modelId);
      onOpenChange(false);
    },
    [onSelect, onOpenChange]
  );

  const providerSlug = selectedModel ? extractProvider(selectedModel.id) : null;

  return (
    <AIModelSelector open={open} onOpenChange={onOpenChange}>
      <ModelSelectorTrigger asChild>
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition hover:bg-bg-hover disabled:cursor-not-allowed disabled:opacity-50"
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          {providerSlug && <ModelSelectorLogo provider={providerSlug} className="dark:invert-0" />}
          <ModelSelectorName className="truncate text-text-tertiary">
            {selectedModel ? extractModelName(selectedModel.id) : 'Model'}
          </ModelSelectorName>
          <ChevronDown className={`h-3 w-3 text-text-faint transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </ModelSelectorTrigger>

      <ModelSelectorContent
        title="Model Selector"
        className="max-w-sm overflow-hidden rounded-xl border border-border-medium bg-bg-elevated shadow-elevated"
      >
        <ModelSelectorInput 
          placeholder="Search models..." 
          className="border-b border-border-subtle px-4 py-3 text-sm"
        />

        <div className="flex items-center gap-2 border-b border-border-subtle px-3 py-2">
          <button
            type="button"
            onClick={() => setShowFreeOnly((prev) => !prev)}
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition ${
              showFreeOnly ? 'bg-success-bg text-success' : 'bg-bg-hover text-text-muted hover:text-text-tertiary'
            }`}
          >
            Free
          </button>
          <span className="ml-auto text-[10px] text-text-faint">
            {totalCount} model{totalCount === 1 ? '' : 's'}
          </span>
        </div>

        <ModelSelectorList className="max-h-72">
          <ModelSelectorEmpty className="flex flex-col items-center justify-center px-4 py-8 text-center">
            <p className="text-sm text-text-muted">No models found</p>
            {onRefresh ? (
              <button
                type="button"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="mt-3 rounded-md bg-bg-hover px-3 py-1.5 text-xs text-text-secondary transition hover:bg-bg-active disabled:opacity-50"
              >
                {isRefreshing ? 'Loading...' : 'Refresh catalog'}
              </button>
            ) : null}
          </ModelSelectorEmpty>

          {grouped.map(([provider, providerModels]) => (
            <ModelSelectorGroup key={provider} heading={provider}>
              {providerModels.map((model) => {
                const isSelected = model.id === selectedModelId;

                return (
                  <ModelSelectorItem key={model.id} value={model.id} onSelect={() => handleSelect(model.id)}>
                    <ModelSelectorLogo provider={provider} className="dark:invert-0" />
                    <div className="min-w-0 flex-1">
                      <ModelSelectorName>{model.label}</ModelSelectorName>
                      <p className="truncate text-[10px] text-text-faint">{extractModelName(model.id)}</p>
                    </div>
                    {model.isFree ? (
                      <span className="shrink-0 rounded-full bg-success-bg px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-success">
                        Free
                      </span>
                    ) : null}
                    {isSelected ? <Check className="ml-auto h-4 w-4 text-success" /> : <div className="ml-auto h-4 w-4" />}
                  </ModelSelectorItem>
                );
              })}
            </ModelSelectorGroup>
          ))}
        </ModelSelectorList>
      </ModelSelectorContent>
    </AIModelSelector>
  );
}
