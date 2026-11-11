import { act, renderHook } from "@testing-library/react";
import { toast } from "sonner";
import { useCvItemModal } from "@/features/cv-builder/hooks/use-cv-item-modal";

jest.mock("sonner", () => ({
  toast: { success: jest.fn() },
}));

interface DemoRequest {
  name: string;
  issuer: string;
  note?: string;
}
interface DemoItem extends DemoRequest {
  id: string;
}

const setup = () => {
  const onAdd = jest.fn();
  const onUpdate = jest.fn();
  const hook = renderHook(() =>
    useCvItemModal<DemoRequest, DemoItem>({
      onAdd,
      onUpdate,
      toFieldUpdates: (data) => ({
        name: data.name,
        issuer: data.issuer,
        note: data.note || "",
      }),
      addToast: (data) => ({ title: "added", description: `+${data.name}` }),
      editToast: (data) => ({ title: "edited", description: `~${data.name}` }),
    })
  );
  return { ...hook, onAdd, onUpdate };
};

describe("useCvItemModal", () => {
  beforeEach(() => jest.clearAllMocks());

  it("adds a new item with a generated id, toasts and closes", () => {
    const { result, onAdd, onUpdate } = setup();

    act(() => result.current.openAddModal());
    expect(result.current.isOpen).toBe(true);
    expect(result.current.mode).toBe("add");

    act(() => result.current.handleSubmit({ name: "AWS", issuer: "Amazon" }));

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd.mock.calls[0][0]).toEqual({
      id: expect.stringMatching(/^\d+-[a-z0-9]+$/),
      name: "AWS",
      issuer: "Amazon",
    });
    expect(onUpdate).not.toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("added", {
      description: "+AWS",
      duration: 2000,
    });
    expect(result.current.isOpen).toBe(false);
    expect(result.current.currentItem).toBeUndefined();
  });

  it("updates each field in declaration order when editing", () => {
    const { result, onAdd, onUpdate } = setup();
    const item: DemoItem = { id: "c-1", name: "Old", issuer: "Org" };

    act(() => result.current.openEditModal(item));
    expect(result.current.mode).toBe("edit");
    expect(result.current.currentItem).toBe(item);

    act(() => result.current.handleSubmit({ name: "New", issuer: "Org2" }));

    expect(onAdd).not.toHaveBeenCalled();
    expect(onUpdate.mock.calls).toEqual([
      ["c-1", "name", "New"],
      ["c-1", "issuer", "Org2"],
      ["c-1", "note", ""],
    ]);
    expect(toast.success).toHaveBeenCalledWith("edited", {
      description: "~New",
      duration: 2000,
    });
    expect(result.current.isOpen).toBe(false);
  });

  it("closeModal clears the current item", () => {
    const { result } = setup();

    act(() =>
      result.current.openEditModal({ id: "x", name: "a", issuer: "b" })
    );
    act(() => result.current.closeModal());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.currentItem).toBeUndefined();
  });
});
