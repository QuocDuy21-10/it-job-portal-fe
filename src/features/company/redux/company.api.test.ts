import { configureStore } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios/axios-instance";
import { baseApi } from "@/lib/redux/api";
import type { CreateCompanyFormData } from "../schemas/company.schema";
import { companyApi } from "./company.api";

jest.mock("@/lib/axios/axios-instance", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockAxios = axiosInstance as unknown as jest.Mock;

const company: CreateCompanyFormData = {
  name: "Acme",
  description: "A company that builds things",
  address: "Hà Nội",
  website: "",
  numberOfEmployees: 5,
};

const makeStore = () =>
  configureStore({
    reducer: { [baseApi.reducerPath]: baseApi.reducer },
    middleware: (getDefault) => getDefault().concat(baseApi.middleware),
  });

const sentBody = async (
  mutation: "createCompany" | "updateCompany",
  logo?: string
) => {
  const data = { ...company, logo };
  const store = makeStore();
  const { createCompany, updateCompany } = companyApi.endpoints;
  await (mutation === "createCompany"
    ? store.dispatch(createCompany.initiate(data))
    : store.dispatch(updateCompany.initiate({ id: "1", data })));
  return mockAxios.mock.calls[0][0].data;
};

describe.each(["createCompany", "updateCompany"] as const)(
  "%s logo",
  (mutation) => {
    beforeEach(() => mockAxios.mockReset().mockResolvedValue({ data: {} }));

    // The API refuses "" with 400; null means "no logo" and clears a stored one.
    it("sends null for an empty logo", async () => {
      expect(await sentBody(mutation, "")).toEqual({ ...company, logo: null });
    });

    it("sends an uploaded logo unchanged", async () => {
      expect((await sentBody(mutation, "new.png")).logo).toBe("new.png");
    });

    it("leaves an absent logo out, so the stored one is kept", async () => {
      expect((await sentBody(mutation)).logo).toBeUndefined();
    });
  }
);
