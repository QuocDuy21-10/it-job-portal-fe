import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { UserForm } from "@/components/user/user-form";
import { useGetCompaniesQuery } from "@/features/company/redux/company.api";

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

jest.mock("@/features/company/redux/company.api", () => ({
  useGetCompaniesQuery: jest.fn(),
}));

jest.mock("@/components/ui/select", () => ({
  Select: ({
    children,
    value,
    onValueChange,
    disabled,
  }: {
    children: React.ReactNode;
    value?: string;
    onValueChange: (value: string) => void;
    disabled?: boolean;
  }) => (
    <select
      aria-label="role-select"
      value={value ?? ""}
      onChange={(event) => onValueChange(event.target.value)}
      disabled={disabled}
    >
      {children}
    </select>
  ),
  SelectTrigger: React.forwardRef<HTMLElement, { children: React.ReactNode }>(
    function SelectTrigger({ children }, _ref) {
      return <>{children}</>;
    }
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => (
    <option value="">{placeholder}</option>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  SelectItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <option value={value}>{children}</option>,
}));

jest.mock("@/components/combo-box", () => ({
  Combobox: React.forwardRef<
    HTMLSelectElement,
    {
      options: Array<{ label: string; value: string }>;
      value?: string;
      onChange: (value: string) => void;
      disabled?: boolean;
    }
  >(function Combobox({ options, value, onChange, disabled }, _ref) {
    return (
      <select
        aria-label="company-combobox"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        <option value="">Select company</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }),
}));

const mockUseGetCompaniesQuery = useGetCompaniesQuery as jest.Mock;

const companiesResponse = {
  data: {
    result: [
      { _id: "507f1f77bcf86cd799439021", name: "Acme HR", logo: null },
      { _id: "507f1f77bcf86cd799439022", name: "Beta Corp", logo: "beta.png" },
    ],
  },
};

const renderForm = (props: Partial<React.ComponentProps<typeof UserForm>>) =>
  render(
    <>
      <UserForm formId="f" onSubmit={jest.fn()} {...props} />
      <button type="submit" form="f">
        save
      </button>
    </>
  );

describe("UserForm", () => {
  beforeEach(() => {
    mockUseGetCompaniesQuery.mockReturnValue({ data: companiesResponse });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("submits successfully when editing a user, changing role to HR, and selecting a company with a null logo", async () => {
    const handleSubmit = jest.fn().mockResolvedValue(true);

    renderForm({
      initialData: {
        name: "Alice Admin",
        email: "alice@example.com",
        role: "SUPER ADMIN",
      },
      onSubmit: handleSubmit,
    });

    fireEvent.change(screen.getByLabelText("role-select"), {
      target: { value: "HR" },
    });
    fireEvent.change(screen.getByLabelText("company-combobox"), {
      target: { value: "507f1f77bcf86cd799439021" },
    });
    fireEvent.click(screen.getByText("save"));

    await waitFor(() => expect(handleSubmit).toHaveBeenCalledTimes(1));

    const submittedData = handleSubmit.mock.calls[0][0];

    expect(submittedData.role).toBe("HR");
    expect(submittedData.company).toEqual({
      _id: "507f1f77bcf86cd799439021",
      name: "Acme HR",
      logo: undefined,
    });
  });

  it("clears the selected company when the role changes away from HR and still submits", async () => {
    const handleSubmit = jest.fn().mockResolvedValue(true);

    renderForm({
      initialData: {
        name: "Henry Recruiter",
        email: "henry@example.com",
        role: "HR",
        company: {
          _id: "507f1f77bcf86cd799439022",
          name: "Beta Corp",
          logo: "beta.png",
        },
      },
      onSubmit: handleSubmit,
    });

    expect(screen.getByLabelText("company-combobox")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("role-select"), {
      target: { value: "NORMAL USER" },
    });

    await waitFor(() => {
      expect(
        screen.queryByLabelText("company-combobox")
      ).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("save"));

    await waitFor(() => expect(handleSubmit).toHaveBeenCalledTimes(1));
    expect(handleSubmit.mock.calls[0][0].company).toBeUndefined();
  });

  it("requires a role when creating", async () => {
    const handleSubmit = jest.fn();
    renderForm({ onSubmit: handleSubmit });
    expect(screen.getByLabelText("role-select")).toHaveValue("");
    fireEvent.click(screen.getByText("save"));
    expect(
      await screen.findByText("adminPages.users.form.errors.role")
    ).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("reports dirtiness", async () => {
    const onDirtyChange = jest.fn();
    renderForm({ onDirtyChange });
    fireEvent.change(screen.getByLabelText("adminPages.users.form.name"), {
      target: { value: "An" },
    });
    await waitFor(() => expect(onDirtyChange).toHaveBeenLastCalledWith(true));
  });
});
