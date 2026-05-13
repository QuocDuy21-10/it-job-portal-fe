import authReducer, {
  addSavedJobId,
  removeSavedJobId,
  selectSavedJobIds,
  setUserLoginInfo,
} from "./auth.slice";
import type { AuthState, UserInfo } from "../schemas/auth.schema";

jest.mock("@/shared/constants/roles", () => ({
  isAdminRole: jest.fn(() => false),
  isSuperAdmin: jest.fn(() => false),
}));

const createBaseState = (): AuthState => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  isRefreshToken: false,
  errorRefreshToken: "",
});

const createUser = (overrides: Partial<UserInfo> = {}): UserInfo => ({
  _id: "user-1",
  email: "user@example.com",
  avatar: null,
  name: "Test User",
  role: {
    _id: "role-1",
    name: "NORMAL USER",
  },
  ...overrides,
});

describe("auth slice saved jobs", () => {
  it("normalizes saved jobs from savedJobs into canonical auth state", () => {
    const state = authReducer(
      createBaseState(),
      setUserLoginInfo(createUser({ savedJobs: ["job-1"] }))
    );

    expect(state.user?.savedJobIds).toEqual(["job-1"]);
    expect(state.user?.savedJobs).toEqual(["job-1"]);
    expect(state.user?.jobFavorites).toEqual(["job-1"]);
  });

  it("normalizes saved jobs from jobFavorites into canonical auth state", () => {
    const state = authReducer(
      createBaseState(),
      setUserLoginInfo(createUser({ jobFavorites: ["job-2"] }))
    );

    expect(state.user?.savedJobIds).toEqual(["job-2"]);
    expect(state.user?.savedJobs).toEqual(["job-2"]);
    expect(state.user?.jobFavorites).toEqual(["job-2"]);
  });

  it("merges all saved job fields deterministically without duplicates", () => {
    const state = authReducer(
      createBaseState(),
      setUserLoginInfo(
        createUser({
          savedJobIds: ["job-1"],
          savedJobs: ["job-2", "job-1"],
          jobFavorites: ["job-3", "job-2"],
        })
      )
    );

    expect(state.user?.savedJobIds).toEqual(["job-1", "job-2", "job-3"]);
    expect(state.user?.savedJobs).toEqual(["job-1", "job-2", "job-3"]);
    expect(state.user?.jobFavorites).toEqual(["job-1", "job-2", "job-3"]);
  });

  it("keeps canonical and compatibility fields aligned during optimistic updates", () => {
    const loggedInState = authReducer(
      createBaseState(),
      setUserLoginInfo(createUser({ savedJobIds: ["job-1"] }))
    );

    const afterAdd = authReducer(loggedInState, addSavedJobId("job-2"));
    expect(afterAdd.user?.savedJobIds).toEqual(["job-1", "job-2"]);
    expect(afterAdd.user?.savedJobs).toEqual(["job-1", "job-2"]);
    expect(afterAdd.user?.jobFavorites).toEqual(["job-1", "job-2"]);

    const afterRemove = authReducer(afterAdd, removeSavedJobId("job-1"));
    expect(afterRemove.user?.savedJobIds).toEqual(["job-2"]);
    expect(afterRemove.user?.savedJobs).toEqual(["job-2"]);
    expect(afterRemove.user?.jobFavorites).toEqual(["job-2"]);
  });

  it("selects saved jobs from legacy persisted auth state", () => {
    const legacyState = {
      auth: {
        ...createBaseState(),
        user: createUser({ jobFavorites: ["legacy-job"] }),
      },
    };

    expect(selectSavedJobIds(legacyState)).toEqual(["legacy-job"]);
  });
});
