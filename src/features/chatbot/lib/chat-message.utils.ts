import { jobApi } from "@/features/job/redux/job.api";
import { Job } from "@/features/job/schemas/job.schema";
import { AppDispatch } from "@/lib/redux/store";
import { IJob } from "@/shared/types/backend";
import {
  IChatToolAction,
  ChatToolActionType,
  IChatQuotaStatus,
  IChatRecommendationMetadata,
  IChatResponse,
  IChatTransportMessage,
  IMessage,
  INormalizedStreamDoneEvent,
  IStreamDoneEvent,
} from "@/shared/types/chat";
import { v4 as uuidv4 } from "uuid";

const dedupeStringValues = (
  values: Array<string | undefined | null>
): string[] => {
  const seenValues = new Set<string>();

  return values.filter((value): value is string => {
    if (!value || seenValues.has(value)) {
      return false;
    }

    seenValues.add(value);
    return true;
  });
};

const dedupeJobs = (jobs?: IJob[]): IJob[] => {
  const seenJobIds = new Set<string>();
  const normalizedJobs: IJob[] = [];

  for (const job of jobs ?? []) {
    if (!job?._id || seenJobIds.has(job._id)) {
      continue;
    }

    seenJobIds.add(job._id);
    normalizedJobs.push(job);
  }

  return normalizedJobs;
};

const dedupePendingToolActions = (
  actions?: IChatToolAction[]
): IChatToolAction[] => {
  const seenActionIds = new Set<string>();
  const normalizedActions: IChatToolAction[] = [];

  for (const action of actions ?? []) {
    if (
      !action?.actionId ||
      seenActionIds.has(action.actionId) ||
      !action.payload?.jobId
    ) {
      continue;
    }

    seenActionIds.add(action.actionId);
    normalizedActions.push(action);
  }

  return normalizedActions;
};

export const isChatToolActionExpired = (
  action: Pick<IChatToolAction, "expiresAt">,
  now: number = Date.now()
): boolean => {
  if (!action.expiresAt) {
    return false;
  }

  const expiresAt = Date.parse(action.expiresAt);

  return Number.isFinite(expiresAt) && expiresAt <= now;
};

export const normalizeRecommendationMetadata = (
  metadata?: IChatRecommendationMetadata
): IChatRecommendationMetadata => {
  const recommendedJobs = dedupeJobs(metadata?.recommendedJobs);
  const recommendedJobIds = dedupeStringValues([
    ...(metadata?.recommendedJobIds ?? []),
    ...recommendedJobs.map((job) => job._id),
  ]);
  const pendingToolActions = dedupePendingToolActions(
    metadata?.pendingToolActions
  );

  return {
    recommendedJobs: recommendedJobs.length > 0 ? recommendedJobs : undefined,
    recommendedJobIds:
      recommendedJobIds.length > 0 ? recommendedJobIds : undefined,
    pendingToolActions:
      pendingToolActions.length > 0 ? pendingToolActions : undefined,
    intent: metadata?.intent,
  };
};

export const normalizeChatQuotaStatus = (
  quota?: unknown
): IChatQuotaStatus | undefined => {
  if (!quota || typeof quota !== "object") {
    return undefined;
  }

  const candidate = quota as Partial<IChatQuotaStatus>;
  const remainingQuota = candidate.remainingQuota;
  const nextResetTime = candidate.nextResetTime;
  const limit = candidate.limit;
  const hasValidRemaining =
    remainingQuota === null ||
    (typeof remainingQuota === "number" &&
      Number.isFinite(remainingQuota) &&
      remainingQuota >= 0);
  const hasValidResetTime =
    typeof nextResetTime === "number" && Number.isFinite(nextResetTime);
  const hasValidLimit =
    limit === undefined ||
    limit === null ||
    (typeof limit === "number" && Number.isFinite(limit) && limit >= 0);

  if (!hasValidRemaining || !hasValidResetTime || !hasValidLimit) {
    return undefined;
  }

  return {
    remainingQuota,
    nextResetTime,
    ...(limit !== undefined ? { limit } : {}),
  };
};

export const normalizeChatMessage = (
  message: IChatTransportMessage,
  id: string = uuidv4()
): IMessage => ({
  id,
  role: message.role,
  content: message.content,
  timestamp: message.timestamp,
  ...normalizeRecommendationMetadata(message),
});

export const normalizeAssistantResponseMessage = (
  response: IChatResponse,
  id: string = uuidv4()
): IMessage => ({
  id,
  role: "assistant",
  content: response.response,
  timestamp: response.timestamp || new Date().toISOString(),
  ...normalizeRecommendationMetadata(response),
});

export const normalizeStreamDoneEvent = (
  event: IStreamDoneEvent
): INormalizedStreamDoneEvent => ({
  conversationId: event.conversationId,
  response: event.response || "",
  suggestedActions: event.suggestedActions,
  quota: normalizeChatQuotaStatus(event.quota),
  ...normalizeRecommendationMetadata(event),
});

export const getPendingToolActionForJob = (
  message: IMessage,
  jobId: string,
  actionType: ChatToolActionType = "save_job"
): IChatToolAction | undefined =>
  message.pendingToolActions?.find(
    (action) =>
      action.type === actionType && action.payload.jobId === jobId
  );

export const getMissingRecommendedJobIds = (message: IMessage): string[] => {
  const hydratedJobIds = new Set(
    (message.recommendedJobs ?? [])
      .map((job) => job._id)
      .filter((jobId): jobId is string => Boolean(jobId))
  );

  return (message.recommendedJobIds ?? []).filter(
    (jobId) => !hydratedJobIds.has(jobId)
  );
};

export const getMessagesNeedingRecommendationHydration = (
  messages: IMessage[]
): IMessage[] =>
  messages.filter(
    (message) =>
      message.role === "assistant" &&
      getMissingRecommendedJobIds(message).length > 0
  );

const toRecommendedJob = (job: Job): IJob => ({
  _id: job._id,
  name: job.name,
  skills: job.skills,
  startDate: new Date(job.startDate),
  endDate: new Date(job.endDate),
  location: job.location,
  locationCode: job.locationCode,
  salary: job.salary,
  quantity: job.quantity,
  level: job.level,
  description: job.description,
  isActive: job.isActive,
  approvalStatus: job.approvalStatus,
  approvalNote: job.approvalNote,
  approvedBy: job.approvedBy,
  approvedAt: job.approvedAt ? new Date(job.approvedAt) : undefined,
  createdAt: job.createdAt,
  updatedAt: job.updatedAt,
  company: job.company
    ? {
        ...job.company,
        logo: job.company.logo ?? undefined,
      }
    : undefined,
});

const fetchJobById = async (
  dispatch: AppDispatch,
  jobId: string
): Promise<IJob | undefined> => {
  const request = dispatch(
    jobApi.endpoints.getJob.initiate(jobId, { subscribe: false })
  );

  try {
    const response = await request.unwrap();
    return response.data ? toRecommendedJob(response.data) : undefined;
  } catch {
    return undefined;
  } finally {
    request.unsubscribe();
  }
};

export const hydrateRecommendedJobsForMessages = async (
  dispatch: AppDispatch,
  messages: IMessage[]
): Promise<Array<{ messageId: string; recommendedJobs?: IJob[] }>> => {
  const missingJobIds = dedupeStringValues(
    messages.flatMap((message) => getMissingRecommendedJobIds(message))
  );

  if (missingJobIds.length === 0) {
    return [];
  }

  const hydratedEntries = await Promise.all(
    missingJobIds.map(async (jobId) => {
      const job = await fetchJobById(dispatch, jobId);
      return job ? ([jobId, job] as const) : null;
    })
  );

  const hydratedJobsById = new Map<string, IJob>(
    hydratedEntries.filter(
      (entry): entry is readonly [string, IJob] => entry !== null
    )
  );

  return messages.map((message) => {
    const recommendedJobs = dedupeJobs([
      ...(message.recommendedJobs ?? []),
      ...getMissingRecommendedJobIds(message)
        .map((jobId) => hydratedJobsById.get(jobId))
        .filter((job): job is IJob => Boolean(job)),
    ]);

    return {
      messageId: message.id,
      recommendedJobs: recommendedJobs.length > 0 ? recommendedJobs : undefined,
    };
  });
};
