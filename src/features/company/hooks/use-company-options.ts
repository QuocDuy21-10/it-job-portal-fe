import { useGetCompaniesQuery } from "@/features/company/redux/company.api";

type CompanyOptionSource = {
  _id: string;
  name: string;
  logo?: string | null;
};

type CurrentCompany = {
  _id?: string;
  name?: string;
  logo?: string | null;
} | null;

// shortcut: first 100 companies only, switch to server search when there are more.
export function useCompanyOptions(current?: CurrentCompany) {
  const { data } = useGetCompaniesQuery({ page: 1, limit: 100 });
  const loaded: CompanyOptionSource[] = data?.data?.result ?? [];
  // The saved company may be outside the loaded page.
  const companies =
    current?._id && !loaded.some((company) => company._id === current._id)
      ? [
          { _id: current._id, name: current.name ?? "", logo: current.logo },
          ...loaded,
        ]
      : loaded;

  return {
    companies,
    options: companies.map(({ _id, name }) => ({ label: name, value: _id })),
  };
}
