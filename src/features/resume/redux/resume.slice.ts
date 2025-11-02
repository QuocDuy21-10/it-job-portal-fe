import { Resume } from "../schemas/resume.schema";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ResumeState {
  resumes: Resume[];
  selectedResume: Resume | null;
  loading: boolean;
  error: string | null;
}

const initialState: ResumeState = {
  resumes: [],
  selectedResume: null,
  loading: false,
  error: null,
};

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    setResumes: (state, action: PayloadAction<Resume[]>) => {
      state.resumes = action.payload;
    },
    setSelectedResume: (state, action: PayloadAction<Resume>) => {
      state.selectedResume = action.payload;
    },
    clearSelectedResume: (state) => {
      state.selectedResume = null;
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
  setResumes,
  setSelectedResume,
  clearSelectedResume,
  setLoading,
  setError,
} = resumeSlice.actions;

export default resumeSlice.reducer;

// Selectors
export const selectCompanies = (state: { resume: ResumeState }) =>
  state.resume.resumes;
export const selectSelectedResume = (state: { resume: ResumeState }) =>
  state.resume.selectedResume;
export const selectResumeLoading = (state: { resume: ResumeState }) =>
  state.resume.loading;
export const selectResumeError = (state: { resume: ResumeState }) =>
  state.resume.error;
