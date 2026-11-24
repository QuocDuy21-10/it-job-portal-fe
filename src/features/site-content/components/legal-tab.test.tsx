import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LegalTab } from "./legal-tab";

const mockUpdate = jest.fn().mockResolvedValue({});
const mockQuery = jest.fn();
const mockEditor = jest.fn();

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));
jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key, language: "vi" }),
}));
jest.mock("@/components/rich-text-editor", () => ({
  RichTextEditor: (props: any) => {
    mockEditor(props);
    return (
      <textarea
        aria-label="editor"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value, null, "user")}
      />
    );
  },
}));
jest.mock("../redux/site-content.api", () => ({
  useGetLegalPageQuery: (ref: unknown) => mockQuery(ref),
  useUpdateLegalPageMutation: () => [
    (arg: unknown) => ({ unwrap: () => mockUpdate(arg) }),
    { isLoading: false },
  ],
}));

const loaded = {
  data: {
    data: {
      title: "Điều khoản",
      description: "Mô tả",
      contentHtml: "<p>Cũ</p>",
      isPublished: false,
    },
  },
};
const save = () =>
  fireEvent.click(screen.getByText("adminPages.siteContent.legal.save"));
const setup = () => {
  const onDirtyChange = jest.fn();
  render(
    <LegalTab guard={(action) => action()} onDirtyChange={onDirtyChange} />
  );
  return { onDirtyChange };
};

describe("LegalTab", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery.mockReturnValue(loaded);
  });

  it("saves the edited text of the selected page", async () => {
    const { onDirtyChange } = setup();

    fireEvent.change(screen.getByLabelText("editor"), {
      target: { value: "<p>Mới</p>" },
    });
    expect(onDirtyChange).toHaveBeenLastCalledWith(true);
    save();

    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith({
        page: "terms",
        locale: "vi",
        data: {
          title: "Điều khoản",
          description: "Mô tả",
          contentHtml: "<p>Mới</p>",
          isPublished: false,
        },
      })
    );
    expect(onDirtyChange).toHaveBeenLastCalledWith(false);
  });

  it("refuses text that is only empty markup", () => {
    setup();
    fireEvent.change(screen.getByLabelText("editor"), {
      target: { value: "<p><br></p>" },
    });
    save();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("starts empty when the page was never written", () => {
    mockQuery.mockReturnValue({ isError: true, error: { status: 404 } });
    setup();
    expect(screen.getByLabelText("editor")).toHaveValue("");
  });

  it("shows an error instead of an empty form on other failures", () => {
    mockQuery.mockReturnValue({ isError: true, error: { status: 500 } });
    setup();
    expect(screen.queryByLabelText("editor")).toBeNull();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("does not allow images in the editor", () => {
    setup();
    expect(mockEditor.mock.calls[0][0].allowImages).toBe(false);
  });
});
