import { IJob } from "./backend";


export interface IMessage {
  id: string; 
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO Date string (serializable for Redux)
  isLoading?: boolean;
  recommendedJobs?: IJob[];
}

export interface ISendMessageRequest {
  message: string; 
}

export interface IChatResponse {
  conversationId: string;
  response: string; // Markdown text
  timestamp: string;
  suggestedActions?: string[];
  recommendedJobs?: IJob[]; 
}

export interface IChatHistoryResponse {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    recommendedJobs?: IJob[];
  }>;
  total: number;
}

export interface IClearChatResponse {
  message: string;
}