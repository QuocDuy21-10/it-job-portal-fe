import {
  JOB_LEVEL_LABEL_KEYS,
  JOB_STATUS_LABEL_KEYS,
  JOB_TYPE_LABEL_KEYS,
  getTranslatedLabel,
} from "./job-labels";

const t = (key: string) => `t:${key}`;

describe("getTranslatedLabel", () => {
  it("translates a known value through its key", () => {
    expect(getTranslatedLabel("Full-time", JOB_TYPE_LABEL_KEYS, t)).toBe(
      "t:jobsPage.jobTypeOptions.fullTime"
    );
  });

  it("falls back to the raw value when no key exists", () => {
    expect(getTranslatedLabel("Contract", JOB_TYPE_LABEL_KEYS, t)).toBe(
      "Contract"
    );
  });
});

describe("job label maps", () => {
  it("include the 'all' option used by the filters", () => {
    expect(JOB_TYPE_LABEL_KEYS.all).toBe("jobsPage.jobTypeOptions.all");
    expect(JOB_LEVEL_LABEL_KEYS.all).toBe("jobsPage.jobLevelOptions.all");
  });

  it("map both status variants", () => {
    expect(JOB_STATUS_LABEL_KEYS).toEqual({
      new: "jobsPage.jobCard.statusNew",
      closing: "jobsPage.jobCard.statusClosing",
    });
  });
});
