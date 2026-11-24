import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BannerTab } from "./banner-tab";

const mockUpload = jest.fn();
const mockDeleteFile = jest.fn();
const mockCreate = jest.fn();
const mockActivate = jest.fn();

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));
jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key, language: "vi" }),
}));
jest.mock("@/hooks/use-file", () => ({
  useFileOperations: () => ({
    isUploading: false,
    handleUpload: mockUpload,
    handleDelete: mockDeleteFile,
  }),
}));
const mockMutation = (fn: jest.Mock) => [
  (arg: unknown) => ({ unwrap: () => fn(arg) }),
  { isLoading: false },
];
jest.mock("../redux/site-content.api", () => ({
  useGetBannersQuery: () => ({
    isLoading: false,
    isError: false,
    data: {
      data: [
        { _id: "a", name: "Active", isActive: true, imageUrl: "/a.png" },
        { _id: "b", name: "Other", isActive: false, imageUrl: "/b.png" },
      ],
    },
  }),
  useCreateBannerMutation: () => mockMutation(mockCreate),
  useActivateBannerMutation: () => mockMutation(mockActivate),
  useClearActiveBannerMutation: () => mockMutation(jest.fn()),
  useDeleteBannerMutation: () => mockMutation(jest.fn()),
}));

const choose = (file: File) =>
  fireEvent.change(
    screen.getByLabelText("adminPages.siteContent.banner.upload"),
    { target: { files: [file] } }
  );
const image = (type = "image/png", size = 10) => {
  const file = new File(["x"], "tet-2027.png", { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
};

describe("BannerTab", () => {
  beforeEach(() => jest.clearAllMocks());

  it("uploads, then adds the banner under the file's name", async () => {
    mockUpload.mockResolvedValue("uuid.png");
    mockCreate.mockResolvedValue({});
    render(<BannerTab />);

    choose(image());

    await waitFor(() =>
      expect(mockCreate).toHaveBeenCalledWith({
        name: "tet-2027",
        fileName: "uuid.png",
      })
    );
    expect(mockUpload).toHaveBeenCalledWith(expect.any(File), "banner");
  });

  it("removes the uploaded file when the banner cannot be added", async () => {
    mockUpload.mockResolvedValue("uuid.png");
    mockCreate.mockRejectedValue({ data: { message: "boom" } });
    render(<BannerTab />);

    choose(image());

    await waitFor(() =>
      expect(mockDeleteFile).toHaveBeenCalledWith("uuid.png", "banner")
    );
  });

  it.each([
    ["wrong type", image("image/gif")],
    ["over 5 MB", image("image/png", 5 * 1024 * 1024 + 1)],
  ])("refuses a file: %s", async (_label, file) => {
    render(<BannerTab />);
    choose(file);
    await Promise.resolve();
    expect(mockUpload).not.toHaveBeenCalled();
  });

  it("offers activate and delete only for banners that are not shown", () => {
    render(<BannerTab />);

    expect(
      screen.getAllByText("adminPages.siteContent.banner.activate")
    ).toHaveLength(1);
    expect(screen.getAllByText("adminPages.shared.delete")).toHaveLength(1);
    fireEvent.click(screen.getByText("adminPages.siteContent.banner.activate"));
    expect(mockActivate).toHaveBeenCalledWith("b");
  });
});
