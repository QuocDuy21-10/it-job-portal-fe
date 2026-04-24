import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import ChatWidget from "@/components/chatbot/chat-widget";

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
