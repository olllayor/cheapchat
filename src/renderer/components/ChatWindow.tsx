import {
  Bug,
  Check,
  Code2,
  Copy,
  FileText,
  Lightbulb,
  MessageSquare,
  PenTool,
  RefreshCw,
  Search,
  Sparkles,
} from 'lucide-react';

import type { ConversationDetail } from '../../shared/contracts';
import type { DraftStateLike } from './types';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from './ai-elements/conversation';
import { MessageResponse } from './ai-elements/message';
import { useClipboard } from '../hooks/useClipboard';

type ChatWindowProps = {
  detail: ConversationDetail | null;
  draft: DraftStateLike | null;
  hasCredential: boolean;
  onOpenSettings: () => void;
  onSuggestionClick: (prompt: string) => void;
};

const suggestions = [
  { icon: Lightbulb, text: 'Explain a concept', prompt: 'Explain quantum computing in simple terms' },
  { icon: Code2, text: 'Write code', prompt: 'Write a Python function that sorts a list' },
  { icon: Bug, text: 'Debug an error', prompt: 'Help me debug this error: ' },
  { icon: FileText, text: 'Summarize text', prompt: 'Summarize the key points of ' },
  { icon: PenTool, text: 'Help me write', prompt: 'Help me write an email that ' },
  { icon: Search, text: 'Research something', prompt: 'Tell me about ' },
];

function MessageRow({
  role,
  content,
  latencyMs,
  modelLabel,
  isLast,
  onRegenerate,
}: {
  role: 'user' | 'assistant' | 'system';
  content: string;
  latencyMs?: number | null;
  modelLabel?: string | null;
  isLast: boolean;
  onRegenerate?: () => void;
}) {
  const { copied, copy } = useClipboard();
  const isAssistant = role === 'assistant';

  if (!isAssistant) {
    // User message - right-aligned, bubble style
    return (
      <div className="group flex w-full justify-end">
        <div className="max-w-[85%]">
          <div className="rounded-2xl bg-bg-active px-4 py-2.5">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-primary">
              {content}
            </p>
          </div>
          <div className="mt-1 flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => void copy(content)}
              className="rounded-md p-1 text-text-muted transition hover:bg-bg-hover hover:text-text-primary"
              title={copied ? 'Copied!' : 'Copy'}
            >
              {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Assistant message - left-aligned with avatar
  return (
    <div className="group flex w-full gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg-hover">
        <Sparkles className="h-3.5 w-3.5 text-text-muted" />
      </div>

      <div className="min-w-0 flex-1">
        <MessageResponse className="text-sm leading-7 text-text-primary">
          {content}
        </MessageResponse>

        {(latencyMs || modelLabel) && (
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-text-faint">
            {latencyMs && <span>{latencyMs}ms</span>}
            {latencyMs && modelLabel && <span>·</span>}
            {modelLabel && <span>{modelLabel}</span>}
          </div>
        )}

        <div className="mt-1 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={() => void copy(content)}
            className="rounded-md p-1 text-text-muted transition hover:bg-bg-hover hover:text-text-primary"
            title={copied ? 'Copied!' : 'Copy'}
          >
            {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              className="rounded-md p-1 text-text-muted transition hover:bg-bg-hover hover:text-text-primary"
              title="Regenerate"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StreamingRow({
  content,
  modelLabel,
  errorMessage,
  status,
}: {
  content: string;
  modelLabel?: string;
  errorMessage?: string;
  status: 'streaming' | 'error' | 'aborted';
}) {
  const displayContent =
    content || (status === 'streaming' ? '_Thinking..._' : `_${errorMessage ?? 'Stopped.'}_`);

  return (
    <div className="group flex w-full gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg-hover">
        <Sparkles className="h-3.5 w-3.5 text-text-muted" />
      </div>

      <div className="min-w-0 flex-1">
        <MessageResponse className="text-sm leading-7 text-text-primary" isAnimating={status === 'streaming'}>
          {displayContent}
        </MessageResponse>

        <div className="mt-2 flex items-center gap-2 text-[11px] text-text-faint">
          {modelLabel && <span>{modelLabel}</span>}
          {status === 'streaming' && (
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success [animation-delay:300ms]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ChatWindow({ detail, draft, hasCredential, onOpenSettings, onSuggestionClick }: ChatWindowProps) {
  if (!detail) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Conversation className="mx-auto w-full max-w-content-max">
          <ConversationContent className="items-center justify-center">
            <ConversationEmptyState
              icon={<MessageSquare className="h-12 w-12 text-text-muted" />}
              title="What can I help with?"
              description="Start a new conversation or select one from the sidebar."
            >
              <div className="mt-6 grid w-full max-w-lg grid-cols-2 gap-3">
                {suggestions.map(({ icon: Icon, text, prompt }) => (
                  <button
                    key={text}
                    type="button"
                    onClick={() => onSuggestionClick(prompt)}
                    className="flex items-center gap-3 rounded-xl border border-border-medium bg-bg-hover px-4 py-3 text-left text-sm text-text-tertiary transition hover:bg-bg-active hover:text-text-primary"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-text-muted" />
                    <span className="truncate">{text}</span>
                  </button>
                ))}
              </div>
            </ConversationEmptyState>
          </ConversationContent>
        </Conversation>
      </div>
    );
  }

  const showSetupPrompt = !hasCredential && detail.messages.length === 0;

  if (showSetupPrompt) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Conversation className="mx-auto w-full max-w-content-max">
          <ConversationContent className="items-center justify-center">
            <div className="mx-auto w-full max-w-2xl rounded-xl border border-warning-border bg-warning-bg p-6 text-center">
              <h2 className="text-lg font-medium text-text-primary">Add your API key to start</h2>
              <p className="mt-2 text-sm text-text-tertiary">
                Credentials are stored in your OS keychain. Nothing leaves your machine.
              </p>
              <button
                type="button"
                onClick={onOpenSettings}
                className="btn-primary mt-4 px-4 py-2 text-sm"
              >
                Open Settings
              </button>
            </div>
          </ConversationContent>
        </Conversation>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Conversation className="mx-auto w-full max-w-content-max">
        <ConversationContent className="gap-6 px-6 py-6">
          {detail.messages.map((message, i) => {
            const isLast = i === detail.messages.length - 1 && !draft;
            return (
              <MessageRow
                key={message.id}
                role={message.role}
                content={message.content}
                latencyMs={message.status === 'complete' ? message.latencyMs : null}
                modelLabel={message.role === 'assistant' ? message.modelId : undefined}
                isLast={isLast}
              />
            );
          })}

          {draft && (
            <StreamingRow
              content={draft.content}
              modelLabel={draft.modelId}
              errorMessage={draft.errorMessage}
              status={draft.status}
            />
          )}
        </ConversationContent>
        <ConversationScrollButton className="border-border-medium bg-bg-elevated shadow-elevated hover:bg-bg-active" />
      </Conversation>
    </div>
  );
}
