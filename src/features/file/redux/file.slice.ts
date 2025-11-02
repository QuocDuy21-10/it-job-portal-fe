import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { File } from "../schemas/file.schema";

interface FileState {
  files: File[];
  selectedFile: File | null;
  loading: boolean;
  error: string | null;
}

const initialState: FileState = {
  files: [],
  selectedFile: null,
  loading: false,
  error: null,
};

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<File[]>) => {
      state.files = action.payload;
    },
    setSelectedFile: (state, action: PayloadAction<File>) => {
      state.selectedFile = action.payload;
    },
    clearSelectedFile: (state) => {
      state.selectedFile = null;
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
  setFiles,
  setSelectedFile,
  clearSelectedFile,
  setLoading,
  setError,
} = fileSlice.actions;

export default fileSlice.reducer;

// Selectors
export const selectFiles = (state: { file: FileState }) => state.file.files;
export const selectSelectedFile = (state: { file: FileState }) =>
  state.file.selectedFile;
export const selectFileLoading = (state: { file: FileState }) =>
  state.file.loading;
export const selectFileError = (state: { file: FileState }) => state.file.error;
