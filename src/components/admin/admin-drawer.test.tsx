import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useState } from "react";
import { AdminDrawer, AdminDrawerFormFooter } from "./admin-drawer";

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

const flush = () => act(() => new Promise((resolve) => setTimeout(resolve, 0)));

function Harness({ isDirty = false, isBusy = false }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>opener</button>
      <div data-sonner-toaster="">toast</div>
      <AdminDrawer
        open={open}
        onOpenChange={setOpen}
        title="Edit user"
        isDirty={isDirty}
        isBusy={isBusy}
        footer={<AdminDrawerFormFooter formId="f" submitLabel="Save" />}
      >
        <form id="f">
          <input aria-label="name" />
        </form>
      </AdminDrawer>
    </>
  );
}

const openDrawer = async (props = {}) => {
  render(<Harness {...props} />);
  const opener = screen.getByText("opener");
  opener.focus();
  fireEvent.click(opener);
  await flush();
  return opener;
};

const escape = () => fireEvent.keyDown(document, { key: "Escape" });

describe("AdminDrawer", () => {
  it("focuses the first field and returns focus to the opener", async () => {
    const opener = await openDrawer();
    expect(screen.getByLabelText("name")).toHaveFocus();
    escape();
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(opener).toHaveFocus());
  });

  it("closes a clean drawer from Cancel", async () => {
    await openDrawer();
    fireEvent.click(screen.getByText("common.cancel"));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("asks before closing a dirty drawer", async () => {
    await openDrawer({ isDirty: true });
    escape();
    const alert = await screen.findByRole("alertdialog");
    fireEvent.click(
      Array.from(alert.querySelectorAll("button")).find(
        (button) => button.textContent === "common.cancel"
      )!
    );
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByText("common.cancel"));
    fireEvent.click(await screen.findByText("adminPages.shared.discard"));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("does not close while busy", async () => {
    await openDrawer({ isBusy: true });
    escape();
    await flush();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("common.cancel")).toBeDisabled();
  });

  it("stays open when a toast is clicked", async () => {
    await openDrawer();
    fireEvent.pointerDown(screen.getByText("toast"));
    await flush();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("warns on tab close only while dirty", async () => {
    await openDrawer({ isDirty: true });
    const event = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });
});
