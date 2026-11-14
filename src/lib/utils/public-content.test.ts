import {
  fetchPublicCompanies,
  fetchPublicCompanyById,
  fetchPublicExternalJobById,
  fetchPublicJobById,
  fetchPublicJobs,
  fetchPublicJobSearch,
  fetchPublicTopHiringCompanies,
} from "./public-content";

// React 18.2 (the version Jest loads) has no `cache`; Next.js brings its own React at runtime.
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  cache: <T>(fn: T) => fn,
}));

const API = "http://localhost:8081/api/v1";
const fetchMock = jest.fn();

const respondWith = (data: unknown, ok = true) => {
  fetchMock.mockResolvedValue({ ok, json: async () => ({ data }) });
};

describe("public-content", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it.each([
    [
      "fetchPublicJobs",
      () =>
        fetchPublicJobs({
          page: 1,
          limit: 6,
          filter: "isActive=true",
          sort: "sort=-createdAt",
        }),
      `${API}/jobs?page=1&limit=6&isActive=true&sort=-createdAt`,
      60,
    ],
    [
      "fetchPublicJobSearch",
      () => fetchPublicJobSearch({ sort: "newest", page: 1, limit: 10 }),
      `${API}/job-search?sort=newest&page=1&limit=10`,
      60,
    ],
    [
      "fetchPublicJobById",
      () => fetchPublicJobById("j1"),
      `${API}/jobs/j1`,
      60,
    ],
    [
      "fetchPublicCompanies",
      () => fetchPublicCompanies({ page: 2, limit: 12 }),
      `${API}/companies?page=2&limit=12`,
      3600,
    ],
    [
      "fetchPublicCompanyById",
      () => fetchPublicCompanyById("c1"),
      `${API}/companies/c1`,
      3600,
    ],
    [
      "fetchPublicTopHiringCompanies",
      () => fetchPublicTopHiringCompanies(8),
      `${API}/companies/top-hiring?limit=8`,
      3600,
    ],
    [
      "fetchPublicExternalJobById",
      () => fetchPublicExternalJobById("e1"),
      `${API}/job-search/external/e1`,
      3600,
    ],
  ])(
    "%s caches its response for the right time",
    async (_name, call, url, revalidate) => {
      respondWith({});

      await call();

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(url, { next: { revalidate } });
    }
  );

  it("returns the data field of the response", async () => {
    const companies = [{ _id: "c1", name: "Acme", totalOpenJobs: 3 }];
    respondWith(companies);

    await expect(fetchPublicTopHiringCompanies(8)).resolves.toEqual(companies);
  });

  it("returns null when the backend answers with an error status", async () => {
    respondWith(null, false);

    await expect(fetchPublicTopHiringCompanies(8)).resolves.toBeNull();
  });

  it("returns null when the backend cannot be reached", async () => {
    fetchMock.mockRejectedValue(new Error("ECONNREFUSED"));

    await expect(fetchPublicTopHiringCompanies(8)).resolves.toBeNull();
  });
});
