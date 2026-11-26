import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BannerDrawer } from "./banner-drawer";
import type { Banner } from "../schemas/site-content.schema";

const mockUpload = jest.fn();
const mockDeleteFile = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));
// The date picker reads the page locale.
jest.mock("next-intl", () => ({ useLocale: () => "vi" }));
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
  useCreateBannerMutation: () => mockMutation(mockCreate),
  useUpdateBannerMutation: () => mockMutation(mockUpdate),
}));

const image = () => new File(["x"], "tet.png", { type: "image/png" });
const chooseDesktop = () =>
  fireEvent.change(
    screen.getByLabelText("adminPages.siteContent.banner.form.desktopImage"),
    {
      target: { files: [image()] },
    }
  );
const save = () =>
  fireEvent.click(
    screen.getByRole("button", {
      name: "adminPages.siteContent.banner.form.save",
    })
  );

const stored = {
  _id: "b1",
  name: "Tết",
  fileName: "old.png",
  mobileFileName: null,
  content: null,
  isActive: true,
  order: 0,
  startAt: null,
  endAt: null,
  imageUrl: "/old.png",
  mobileImageUrl: null,
  status: "live",
  createdAt: "2026-11-01T00:00:00Z",
} as Banner;

describe("BannerDrawer", () => {
  beforeEach(() => jest.clearAllMocks());

  it("creates an image-only slide", async () => {
    mockUpload.mockResolvedValue("uuid.png");
    mockCreate.mockResolvedValue({});
    const onOpenChange = jest.fn();
    render(<BannerDrawer open onOpenChange={onOpenChange} banner={null} />);

    fireEvent.change(
      screen.getByLabelText("adminPages.siteContent.banner.form.name"),
      {
        target: { value: "Tết 2027" },
      }
    );
    chooseDesktop();
    await waitFor(() =>
      expect(mockUpload).toHaveBeenCalledWith(expect.any(File), "banner")
    );
    save();

    await waitFor(() =>
      expect(mockCreate).toHaveBeenCalledWith({
        name: "Tết 2027",
        fileName: "uuid.png",
        mobileFileName: null,
        content: null,
        startAt: null,
        endAt: null,
      })
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(mockDeleteFile).not.toHaveBeenCalled();
  });

  it("marks the language tab that has errors and does not save", async () => {
    render(<BannerDrawer open onOpenChange={jest.fn()} banner={stored} />);

    fireEvent.click(
      screen.getByLabelText("adminPages.siteContent.banner.form.hasContent")
    );
    fireEvent.change(
      screen.getByLabelText("adminPages.siteContent.banner.form.title"),
      {
        target: { value: "Tết" },
      }
    );
    save();

    expect(
      await screen.findByLabelText(
        "adminPages.siteContent.banner.form.tabHasErrors"
      )
    ).toBeInTheDocument();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("deletes the images uploaded in a drawer that closes without saving", async () => {
    mockUpload.mockResolvedValue("uuid.png");
    const onOpenChange = jest.fn();
    const { rerender } = render(
      <BannerDrawer open onOpenChange={onOpenChange} banner={stored} />
    );

    chooseDesktop();
    await waitFor(() => expect(mockUpload).toHaveBeenCalled());
    fireEvent.click(screen.getByRole("button", { name: "common.cancel" }));
    // The form is dirty, so the drawer asks first.
    fireEvent.click(
      await screen.findByRole("button", { name: "adminPages.shared.discard" })
    );

    await waitFor(() =>
      expect(mockDeleteFile).toHaveBeenCalledWith("uuid.png", "banner")
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
    rerender(
      <BannerDrawer open={false} onOpenChange={onOpenChange} banner={stored} />
    );
  });

  it("keeps the new image when saving an edit", async () => {
    mockUpload.mockResolvedValue("new.png");
    mockUpdate.mockResolvedValue({});
    render(<BannerDrawer open onOpenChange={jest.fn()} banner={stored} />);

    chooseDesktop();
    await waitFor(() => expect(mockUpload).toHaveBeenCalled());
    save();

    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith({
        id: "b1",
        data: expect.objectContaining({ fileName: "new.png" }),
      })
    );
    expect(mockDeleteFile).not.toHaveBeenCalled();
  });
});
