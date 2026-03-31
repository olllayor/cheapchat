import type { ChatInputMessage, ModelSummary, ProviderId } from '../../../shared/contracts';

export type ProviderStreamRequest = {
  apiKey: string;
  modelId: string;
  messages: ChatInputMessage[];
  temperature?: number;
  maxOutputTokens?: number;
  signal: AbortSignal;
  onChunk: (delta: string) => void;
  onReasoningChunk?: (delta: string) => void;
};

export type ProviderStreamResult = {
  content: string;
  reasoning?: string;
  inputTokens?: number;
  outputTokens?: number;
  reasoningTokens?: number;
  latencyMs: number;
};

export interface ProviderAdapter {
  readonly providerId: ProviderId;
  validateCredential(apiKey: string): Promise<void>;
  listModels(apiKey: string): Promise<ModelSummary[]>;
  streamChat(request: ProviderStreamRequest): Promise<ProviderStreamResult>;
}
