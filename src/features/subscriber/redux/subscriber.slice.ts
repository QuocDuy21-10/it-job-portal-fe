import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Subscriber } from "../schemas/subscriber.schema";

interface SubscriberState {
  subscribers: Subscriber[];
  selectedSubscriber: Subscriber | null;
  loading: boolean;
  error: string | null;
}

const initialState: SubscriberState = {
  subscribers: [],
  selectedSubscriber: null,
  loading: false,
  error: null,
};

const subscriberSlice = createSlice({
  name: "subscriber",
  initialState,
  reducers: {
    setSubscribers: (state, action: PayloadAction<Subscriber[]>) => {
      state.subscribers = action.payload;
    },
    setSelectedSubscriber: (state, action: PayloadAction<Subscriber>) => {
      state.selectedSubscriber = action.payload;
    },
    clearSelectedSubscriber: (state) => {
      state.selectedSubscriber = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSubscribers,
  setSelectedSubscriber,
  clearSelectedSubscriber,
  setLoading,
  setError,
} = subscriberSlice.actions;

export default subscriberSlice.reducer;

// Selectors
export const selectCompanies = (state: { subscriber: SubscriberState }) =>
  state.subscriber.subscribers;
export const selectSelectedSubscriber = (state: {
  subscriber: SubscriberState;
}) => state.subscriber.selectedSubscriber;
export const selectSubscriberLoading = (state: {
  subscriber: SubscriberState;
}) => state.subscriber.loading;
export const selectSubscriberError = (state: { subscriber: SubscriberState }) =>
  state.subscriber.error;
