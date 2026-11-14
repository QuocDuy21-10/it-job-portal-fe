import { render, screen } from "@testing-library/react";
import type { ICVProfile } from "@/shared/types/cv";
import { ClassicTemplate } from "./classic/ClassicTemplate";
import { MinimalTemplate } from "./minimal/MinimalTemplate";

const cvWithLinks = (
  personalLink: string,
  projectLink: string
): ICVProfile => ({
  personalInfo: {
    fullName: "Nguyen Van A",
    phone: "0900000000",
    email: "a@example.com",
    personalLink,
  },
  education: [],
  experience: [],
  skills: [],
  languages: [],
  projects: [
    {
      id: "p1",
      name: "DevLink",
      position: "Developer",
      description: "Job portal",
      link: projectLink,
    },
  ],
  certificates: [],
  awards: [],
});

describe.each([
  ["MinimalTemplate", MinimalTemplate],
  ["ClassicTemplate", ClassicTemplate],
])("%s links", (_name, Template) => {
  it("links http(s) URLs", () => {
    render(
      <Template
        cvData={cvWithLinks("https://a.example.com", "http://b.example.com/x")}
      />
    );

    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs).toEqual(["https://a.example.com", "http://b.example.com/x"]);
  });

  it("shows other values as plain text", () => {
    render(
      <Template
        cvData={cvWithLinks("javascript:alert(1)", "github.com/a/devlink")}
      />
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("javascript:alert(1)")).toBeInTheDocument();
    expect(screen.getByText(/github\.com\/a\/devlink$/)).toBeInTheDocument();
  });
});
