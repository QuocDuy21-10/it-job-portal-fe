import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { UserForm } from "@/components/user/user-form";
import { useGetRolesQuery } from "@/features/role/redux/role.api";
import { useGetCompaniesQuery } from "@/features/company/redux/company.api";

jest.mock("@/features/role/redux/role.api", () => ({
  useGetRolesQuery: jest.fn(),
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
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SelectValue: ({ placeholder }: { placeholder?: string }) => (
    <option value="">{placeholder}</option>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SelectItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <option value={value}>{children}</option>,
}));

jest.mock("@/components/combo-box", () => ({
  Combobox: ({
    options,
    value,
    onChange,
    disabled,
  }: {
    options: Array<{ label: string; value: string }>;
    value?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
  }) => (
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
  ),
}));

const mockUseGetRolesQuery = useGetRolesQuery as jest.Mock;
const mockUseGetCompaniesQuery = useGetCompaniesQuery as jest.Mock;

const rolesResponse = {
  data: {
    result: [
      { _id: "507f1f77bcf86cd799439011", name: "SUPER ADMIN" },
      { _id: "507f1f77bcf86cd799439012", name: "HR" },
      { _id: "507f1f77bcf86cd799439013", name: "NORMAL USER" },
    ],
  },
};

const companiesResponse = {
  data: {
    result: [
      { _id: "507f1f77bcf86cd799439021", name: "Acme HR", logo: null },
      { _id: "507f1f77bcf86cd799439022", name: "Beta Corp", logo: "beta.png" },
    ],
  },
};

describe("UserForm", () => {
  beforeEach(() => {
    mockUseGetRolesQuery.mockReturnValue({ data: rolesResponse });
    mockUseGetCompaniesQuery.mockReturnValue({ data: companiesResponse });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("submits successfully when editing a user, changing role to HR, and selecting a company with a null logo", async () => {
    const handleSubmit = jest.fn().mockResolvedValue(true);

    render(
      <UserForm
        initialData={{
          name: "Alice Admin",
          email: "alice@example.com",
          role: { _id: "507f1f77bcf86cd799439011", name: "SUPER ADMIN" },
        }}
        onSubmit={handleSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText("role-select"), {
      target: { value: "507f1f77bcf86cd799439012" },
    });
    fireEvent.change(screen.getByLabelText("company-combobox"), {
      target: { value: "507f1f77bcf86cd799439021" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Update User" }));

    await waitFor(() => expect(handleSubmit).toHaveBeenCalledTimes(1));

    const submittedData = handleSubmit.mock.calls[0][0];

    expect(submittedData.role).toBe("507f1f77bcf86cd799439012");
    expect(submittedData.company).toEqual({
      _id: "507f1f77bcf86cd799439021",
      name: "Acme HR",
      logo: undefined,
    });
  });

  it("clears the selected company when the role changes away from HR and still submits", async () => {
    const handleSubmit = jest.fn().mockResolvedValue(true);

    render(
      <UserForm
        initialData={{
          name: "Henry Recruiter",
          email: "henry@example.com",
          role: { _id: "507f1f77bcf86cd799439012", name: "HR" },
          company: {
            _id: "507f1f77bcf86cd799439022",
            name: "Beta Corp",
            logo: "beta.png",
          },
        }}
        onSubmit={handleSubmit}
      />
    );

    expect(screen.getByLabelText("company-combobox")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("role-select"), {
      target: { value: "507f1f77bcf86cd799439013" },
    });

    await waitFor(() => {
      expect(screen.queryByLabelText("company-combobox")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Update User" }));

    await waitFor(() => expect(handleSubmit).toHaveBeenCalledTimes(1));
    expect(handleSubmit.mock.calls[0][0].company).toBeUndefined();
  });
});
