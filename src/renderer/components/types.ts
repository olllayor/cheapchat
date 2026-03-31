export type DraftStateLike = {
  requestId: string;
  modelId: string;
  providerId: string;
  content: string;
  reasoning: string;
  status: 'streaming' | 'error' | 'aborted';
  errorMessage?: string;
  inputTokens?: number;
  outputTokens?: number;
  reasoningTokens?: number;
  latencyMs?: number;
  startedAt: string;
};
