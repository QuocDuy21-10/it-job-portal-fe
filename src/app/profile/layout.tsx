export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-background">{children}</div>;
}

type PageType =
  | "overview"
  | "my-cv"
  | "create-cv"
  | "my-jobs"
  | "email-subscription"
  | "notifications"
  | "settings";

interface ProfileSidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}
