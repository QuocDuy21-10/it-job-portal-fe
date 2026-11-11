import { fireEvent, render, screen } from "@testing-library/react";
import { en } from "@/locales/en";
import MobileSaveBar from "@/features/cv-builder/components/create-cv-page/mobile-save-bar";

function translate(key: string) {
  const message = key
    .split(".")
    .reduce<unknown>(
      (node, part) => (node as Record<string, unknown> | undefined)?.[part],
      en
    );
  return typeof message === "string" ? message : key;
}

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: translate }),
}));

describe("MobileSaveBar", () => {
  it("renders translated labels and wires both buttons", () => {
    const onSave = jest.fn();
    const onPreview = jest.fn();
    render(
      <MobileSaveBar
        onSave={onSave}
        isSaving={false}
        canPreview
        onPreview={onPreview}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Save CV" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Preview & Download PDF" })
    );

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onPreview).toHaveBeenCalledTimes(1);
  });

  it("disables preview below the completion threshold", () => {
    render(
      <MobileSaveBar
        onSave={jest.fn()}
        isSaving={false}
        canPreview={false}
        onPreview={jest.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: "Preview & Download PDF" })
    ).toBeDisabled();
  });
});
