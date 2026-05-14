import { IJob } from "./backend";

export type ChatIntent =
  | "job_search"
  | "company"
  | "cv_review"
  | "job_matching"
  | "faq"
  | "recruiter_support"
  | "general";

export interface IChatRecommendationMetadata {
  recommendedJobs?: IJob[];
  recommendedJobIds?: string[];
  intent?: ChatIntent;
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
  jobId?: string;
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

export interface IStreamDoneEvent extends IChatRecommendationMetadata {
  conversationId: string;
  suggestedActions?: string[];
}

export interface INormalizedStreamDoneEvent extends IChatRecommendationMetadata {
  conversationId: string;
  suggestedActions?: string[];
}
