import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Company } from "../schemas/company.schema";

interface CompanyState {
  companies: Company[];
  selectedCompany: Company | null;
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  companies: [],
  selectedCompany: null,
  loading: false,
  error: null,
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompanies: (state, action: PayloadAction<Company[]>) => {
      state.companies = action.payload;
    },
    setSelectedCompany: (state, action: PayloadAction<Company>) => {
      state.selectedCompany = action.payload;
    },
    clearSelectedCompany: (state) => {
      state.selectedCompany = null;
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
  setCompanies,
  setSelectedCompany,
  clearSelectedCompany,
  setLoading,
  setError,
} = companySlice.actions;

export default companySlice.reducer;

// Selectors
export const selectCompanies = (state: { company: CompanyState }) =>
  state.company.companies;
export const selectSelectedCompany = (state: { company: CompanyState }) =>
  state.company.selectedCompany;
export const selectCompanyLoading = (state: { company: CompanyState }) =>
  state.company.loading;
export const selectCompanyError = (state: { company: CompanyState }) =>
  state.company.error;
