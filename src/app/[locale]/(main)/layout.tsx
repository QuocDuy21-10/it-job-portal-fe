import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import ChatWidget from "@/features/chatbot/components/chat-widget";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatWidget />
    </>
  );
}
