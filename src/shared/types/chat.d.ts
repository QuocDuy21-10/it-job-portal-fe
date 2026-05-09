import { IJob } from "./backend";

export interface IChatRecommendationMetadata {
  recommendedJobs?: IJob[];
  recommendedJobIds?: string[];
}

export interface IChatTransportMessage extends IChatRecommendationMetadata {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO Date string (serializable for Redux)
}

export interface IMessage extends IChatTransportMessage {
  id: string;
  isLoading?: boolean;
}

export interface ISendMessageRequest {
  message: string;
}

export interface IChatResponse extends IChatRecommendationMetadata {
  conversationId: string;
  response: string; // Markdown text
  timestamp: string;
  suggestedActions?: string[];
}

export interface IChatHistoryResponse {
  messages: IChatTransportMessage[];
  total: number;
  title?: string;
}

export interface IClearChatResponse {
  message: string;
}

// SSE Streaming types
export interface IStreamInitResponse {
  streamId: string;
}

export interface IStreamDoneEvent extends IChatRecommendationMetadata {
  conversationId: string;
  suggestedActions?: string[];
}

export interface INormalizedStreamDoneEvent extends IChatRecommendationMetadata {
  conversationId: string;
  suggestedActions?: string[];
}