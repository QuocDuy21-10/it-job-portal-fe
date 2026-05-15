import { IJob } from "./backend";

export type ChatIntent =
  | "job_search"
  | "company"
  | "cv_review"
  | "job_matching"
  | "faq"
  | "recruiter_support"
  | "general";

export type ChatToolActionType = "save_job";

export interface IChatToolActionPayload {
  jobId: string;
}

export interface IChatToolAction {
  actionId: string;
  type: ChatToolActionType;
  payload: IChatToolActionPayload;
  expiresAt?: string;
}

export interface IChatRecommendationMetadata {
  recommendedJobs?: IJob[];
  recommendedJobIds?: string[];
  pendingToolActions?: IChatToolAction[];
  intent?: ChatIntent;
}

export interface IChatQuotaStatus {
  remainingQuota: number | null;
  nextResetTime: number;
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
  timestamp?: string;
  suggestedActions?: string[];
  quota?: IChatQuotaStatus;
}

export interface IChatHistoryResponse {
  messages: IChatTransportMessage[];
  total: number;
  title?: string;
  quota?: IChatQuotaStatus;
}

export interface IClearChatResponse {
  message: string;
}

export interface IChatToolActionResponse {
  message: string;
}

export interface IStreamDoneEvent extends IChatRecommendationMetadata {
  conversationId: string;
  response: string;
  suggestedActions?: string[];
  quota?: IChatQuotaStatus;
}

export interface INormalizedStreamDoneEvent extends IChatRecommendationMetadata {
  conversationId: string;
  response: string;
  suggestedActions?: string[];
  quota?: IChatQuotaStatus;
}
