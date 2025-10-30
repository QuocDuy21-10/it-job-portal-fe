import { Job } from "./../schemas/job.schema";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface JobState {
  jobs: Job[];
  selectedJob: Job | null;
  loading: boolean;
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  selectedJob: null,
  loading: false,
  error: null,
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload;
    },
    setSelectedJob: (state, action: PayloadAction<Job>) => {
      state.selectedJob = action.payload;
    },
    clearSelectedJob: (state) => {
      state.selectedJob = null;
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
  setJobs,
  setSelectedJob,
  clearSelectedJob,
  setLoading,
  setError,
} = jobSlice.actions;

export default jobSlice.reducer;

// Selectors
export const selectCompanies = (state: { job: JobState }) => state.job.jobs;
export const selectSelectedJob = (state: { job: JobState }) =>
  state.job.selectedJob;
export const selectJobLoading = (state: { job: JobState }) => state.job.loading;
export const selectJobError = (state: { job: JobState }) => state.job.error;
