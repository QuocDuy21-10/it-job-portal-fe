import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CompanyDrawer } from "./company-drawer";

const mockDelete = jest.fn();
jest.mock("@/hooks/use-file", () => ({
  useFileOperations: () => ({ handleDelete: mockDelete }),
}));
jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));
jest.mock("@/components/rich-text-editor", () => {
  const { forwardRef } = jest.requireActual("react");
  return { RichTextEditor: forwardRef(() => <div />) };
});
jest.mock("@/components/logo-upload", () => ({
  LogoUpload: ({ onChange, onNewFileUploaded }: any) => (
    <button
      type="button"
      onClick={() => {
        onNewFileUploaded(null, "new.png");
        onChange("new.png");
      }}
    >
      upload
    </button>
  ),
}));
jest.mock("@/hooks/use-skill-catalog", () => ({
  useSkillCatalog: () => ({
    skillOptions: [{ label: "React", value: "React" }],
    isLoading: false,
  }),
}));
jest.mock("@/features/site-content/components/banner-image-field", () => ({
  BannerImageField: ({
    onUploaded,
  }: {
    onUploaded: (name: string) => void;
  }) => (
    <button type="button" onClick={() => onUploaded("cover.webp")}>
      upload cover
    </button>
  ),
}));

const company = {
  _id: "1",
  name: "Acme",
  description: "<p>Long enough</p>",
  address: "Hà Nội",
  website: "",
  numberOfEmployees: 5,
  logo: "old.png",
  coverImage: null,
  industry: null,
  techStack: [],
  benefits: [],
};

const setup = (onSubmit = jest.fn()) => {
  const onOpenChange = jest.fn();
  render(
    <CompanyDrawer
      open
      onOpenChange={onOpenChange}
      editingCompany={company}
      onSubmit={onSubmit}
    />
  );
  return onOpenChange;
};

beforeEach(() => mockDelete.mockClear());

it("deletes an uploaded logo only after the user agrees to discard", async () => {
  const onOpenChange = setup();
  fireEvent.click(screen.getByText("upload"));
  fireEvent.click(screen.getByText("common.cancel"));
  const discard = await screen.findByText("adminPages.shared.discard");
  expect(mockDelete).not.toHaveBeenCalled();
  fireEvent.click(discard);
  expect(mockDelete).toHaveBeenCalledWith("new.png", "company");
  expect(onOpenChange).toHaveBeenCalledWith(false);
});

it("keeps the uploaded logo after a save", async () => {
  const onSubmit = jest.fn().mockResolvedValue(true);
  setup(onSubmit);
  fireEvent.click(screen.getByText("upload"));
  fireEvent.click(screen.getByText("adminPages.drawer.saveChanges"));
  await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  expect(onSubmit.mock.calls[0][0].logo).toBe("new.png");
  expect(mockDelete).not.toHaveBeenCalled();
});

it("deletes an uploaded cover when the drawer is discarded", async () => {
  const onOpenChange = setup();
  fireEvent.click(screen.getByText("upload cover"));
  fireEvent.click(screen.getByText("common.cancel"));
  fireEvent.click(await screen.findByText("adminPages.shared.discard"));

  expect(mockDelete).toHaveBeenCalledWith("cover.webp", "company");
  expect(onOpenChange).toHaveBeenCalledWith(false);
});

it("saves the cover, industry and benefits", async () => {
  const onSubmit = jest.fn().mockResolvedValue(true);
  setup(onSubmit);

  fireEvent.click(screen.getByText("upload cover"));
  fireEvent.click(
    screen.getByLabelText("companyProfile.benefit.REMOTE_HYBRID")
  );
  fireEvent.change(
    screen.getByLabelText("adminPages.companies.form.benefitNote"),
    {
      target: { value: "2 ngày/tuần" },
    }
  );
  fireEvent.click(
    screen.getByLabelText("companyProfile.benefit.HEALTH_INSURANCE")
  );
  fireEvent.click(screen.getByText("adminPages.drawer.saveChanges"));

  await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  expect(onSubmit.mock.calls[0][0]).toMatchObject({
    coverImage: "cover.webp",
    benefits: [
      { type: "HEALTH_INSURANCE", note: null },
      { type: "REMOTE_HYBRID", note: "2 ngày/tuần" },
    ],
  });
  expect(mockDelete).not.toHaveBeenCalled();
});
