/**
 * @jest-environment node
 */
import {
  fetchAllPublicCompanies,
  fetchAllPublicJobs,
  fetchPublicCompanies,
  fetchPublicCompanyById,
  fetchPublicExternalJobById,
  fetchPublicJobById,
  fetchPublicJobs,
  fetchPublicJobSearch,
  fetchPublicJobSearchStrict,
  fetchPublicTopHiringCompanies,
} from "./public-content";

// React 18.2 (the version Jest loads) has no `cache`; Next.js brings its own React at runtime.
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  cache: <T>(fn: T) => fn,
}));

const API = "http://localhost:8081/api/v1";
const fetchMock = jest.fn();

const respondWith = (data: unknown, status = 200) => {
  fetchMock.mockResolvedValue({
    ok: status < 400,
    status,
    json: async () => ({ data }),
  });
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
      expect(fetchMock).toHaveBeenCalledWith(
        url,
        expect.objectContaining({
          next: { revalidate },
          signal: expect.any(AbortSignal),
        })
      );
    }
  );

  it("returns the data field of the response", async () => {
    const companies = [{ _id: "c1", name: "Acme", totalOpenJobs: 3 }];
    respondWith(companies);

    await expect(fetchPublicTopHiringCompanies(8)).resolves.toEqual(companies);
  });

  it("listing fetchers return null when the backend answers 500", async () => {
    respondWith(null, 500);

    await expect(fetchPublicTopHiringCompanies(8)).resolves.toBeNull();
  });

  it("returns null when the backend cannot be reached", async () => {
    fetchMock.mockRejectedValue(new Error("ECONNREFUSED"));

    await expect(fetchPublicTopHiringCompanies(8)).resolves.toBeNull();
  });

  describe("detail fetchers", () => {
    it.each([404, 400])(
      "return null when the backend answers %s",
      async (status) => {
        respondWith(null, status);

        await expect(fetchPublicJobById("j1")).resolves.toBeNull();
      }
    );

    it("throw when the backend answers 500, so the page is not a 404", async () => {
      respondWith(null, 500);

      await expect(fetchPublicJobById("j1")).rejects.toThrow(
        "Backend answered 500 for /jobs/j1"
      );
    });

    it("throw when the request times out", async () => {
      fetchMock.mockRejectedValue(
        new DOMException("The operation timed out.", "TimeoutError")
      );

      await expect(fetchPublicCompanyById("c1")).rejects.toThrow("timed out");
    });
  });

  describe("fetchAllPublic*", () => {
    const page = (ids: string[], totalPages: number) => ({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          result: ids.map((_id) => ({ _id })),
          meta: { pagination: { total_pages: totalPages } },
        },
      }),
    });

    it("walks every page at the backend's maximum page size", async () => {
      fetchMock
        .mockResolvedValueOnce(page(["a", "b"], 3))
        .mockResolvedValueOnce(page(["c"], 3))
        .mockResolvedValueOnce(page(["d"], 3));

      await expect(fetchAllPublicJobs()).resolves.toEqual([
        { _id: "a" },
        { _id: "b" },
        { _id: "c" },
        { _id: "d" },
      ]);
      expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
        `${API}/jobs?page=1&limit=100`,
        `${API}/jobs?page=2&limit=100`,
        `${API}/jobs?page=3&limit=100`,
      ]);
    });

    it("reads companies the same way", async () => {
      fetchMock.mockResolvedValueOnce(page(["c1"], 1));

      await expect(fetchAllPublicCompanies()).resolves.toEqual([{ _id: "c1" }]);
      expect(fetchMock).toHaveBeenCalledWith(
        `${API}/companies?page=1&limit=100`,
        expect.objectContaining({ next: { revalidate: 3600 } })
      );
    });

    it("throws instead of returning a partial list", async () => {
      fetchMock
        .mockResolvedValueOnce(page(["a"], 2))
        .mockRejectedValueOnce(new Error("ECONNREFUSED"));

      await expect(fetchAllPublicJobs()).rejects.toThrow("ECONNREFUSED");
    });
  });

  it("fetchPublicJobSearchStrict throws on a backend error instead of returning null", async () => {
    respondWith(null, 500);

    await expect(
      fetchPublicJobSearchStrict({
        skills: "React",
        sort: "newest",
        page: 1,
        limit: 20,
      })
    ).rejects.toThrow(
      "Backend answered 500 for /job-search?skills=React&sort=newest&page=1&limit=20"
    );
  });
});
