import { fireEvent, render, screen, within } from "@testing-library/react";
import { BannerTab } from "./banner-tab";

const mockVisibility = jest.fn();
const mockReorder = jest.fn();
const mockDelete = jest.fn();
let mockBanners: object[] = [];

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));
jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key, language: "vi" }),
}));
jest.mock("./banner-drawer", () => ({
  BannerDrawer: ({
    open,
    banner,
  }: {
    open: boolean;
    banner: { name: string } | null;
  }) => (open ? <div data-testid="drawer">{banner?.name ?? "new"}</div> : null),
}));
const mockMutation = (fn: jest.Mock) => [
  (arg: unknown) => ({ unwrap: () => fn(arg) }),
  { isLoading: false },
];
jest.mock("../redux/site-content.api", () => ({
  useGetBannersQuery: () => ({
    isLoading: false,
    isError: false,
    data: { data: mockBanners },
    refetch: jest.fn(),
  }),
  useSetBannerVisibilityMutation: () => mockMutation(mockVisibility),
  useReorderBannersMutation: () => mockMutation(mockReorder),
  useDeleteBannerMutation: () => mockMutation(mockDelete),
}));

const slide = (id: string, overrides: object = {}) => ({
  _id: id,
  name: `Slide ${id}`,
  fileName: `${id}.png`,
  mobileFileName: null,
  content: null,
  isActive: false,
  order: 0,
  startAt: null,
  endAt: null,
  imageUrl: `/${id}.png`,
  mobileImageUrl: null,
  status: "hidden",
  createdAt: "2026-11-01T00:00:00Z",
  ...overrides,
});
const row = (name: string) =>
  screen.getByText(name).closest("li") as HTMLElement;

describe("BannerTab", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBanners = [
      slide("a", { isActive: true, status: "live" }),
      slide("b"),
      slide("c", {
        isActive: true,
        status: "scheduled",
        startAt: "2027-01-30T17:00:00.000Z",
      }),
    ];
  });

  it("lists slides in order with their status and the active count", () => {
    render(<BannerTab />);

    const names = screen
      .getAllByRole("listitem")
      .map((item) => within(item).getByText(/Slide/).textContent);
    expect(names).toEqual(["Slide a", "Slide b", "Slide c"]);
    expect(
      within(row("Slide a")).getByText(
        "adminPages.siteContent.banner.status.live"
      )
    ).toBeInTheDocument();
    expect(
      within(row("Slide c")).getByText(
        "adminPages.siteContent.banner.status.scheduled"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("adminPages.siteContent.banner.activeCount")
    ).toBeInTheDocument();
  });

  it("hides and shows a slide", () => {
    render(<BannerTab />);

    fireEvent.click(
      within(row("Slide a")).getByRole("button", {
        name: "adminPages.siteContent.banner.hide",
      })
    );
    fireEvent.click(
      within(row("Slide b")).getByRole("button", {
        name: "adminPages.siteContent.banner.show",
      })
    );

    expect(mockVisibility).toHaveBeenCalledWith({ id: "a", isActive: false });
    expect(mockVisibility).toHaveBeenCalledWith({ id: "b", isActive: true });
  });

  it("disables Show when 5 slides are on", () => {
    mockBanners = [
      ...["1", "2", "3", "4", "5"].map((id) =>
        slide(id, { isActive: true, status: "live" })
      ),
      slide("6"),
    ];
    render(<BannerTab />);

    expect(
      within(row("Slide 6")).getByRole("button", {
        name: "adminPages.siteContent.banner.show",
      })
    ).toBeDisabled();
  });

  it("sends the whole new order when a slide moves", () => {
    render(<BannerTab />);

    fireEvent.click(
      within(row("Slide a")).getByRole("button", {
        name: "adminPages.siteContent.banner.moveDown",
      })
    );

    expect(mockReorder).toHaveBeenCalledWith(["b", "a", "c"]);
    expect(
      within(row("Slide a")).getByRole("button", {
        name: "adminPages.siteContent.banner.moveUp",
      })
    ).toBeDisabled();
  });

  it("deletes a slide after confirmation", async () => {
    render(<BannerTab />);

    fireEvent.click(
      within(row("Slide a")).getByRole("button", {
        name: "adminPages.shared.delete",
      })
    );
    expect(
      screen.getByText("adminPages.siteContent.banner.deleteLiveWarning")
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", {
        name: "adminPages.siteContent.banner.deleteConfirm",
      })
    );

    expect(mockDelete).toHaveBeenCalledWith("a");
  });

  it("opens the drawer to add or edit", () => {
    render(<BannerTab />);

    fireEvent.click(
      screen.getByRole("button", { name: "adminPages.siteContent.banner.add" })
    );
    expect(screen.getByTestId("drawer")).toHaveTextContent("new");
  });

  it("explains that the default image shows when no slide is live", () => {
    mockBanners = [slide("b")];
    render(<BannerTab />);

    expect(
      screen.getByText("adminPages.siteContent.banner.noneLive")
    ).toBeInTheDocument();
  });
});
