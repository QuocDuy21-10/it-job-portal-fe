"use client";

import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatAiDisclaimerProps {
  children: string;
  variant?: "welcome" | "footer";
}

const ChatAiDisclaimer = ({
  children,
  variant = "footer",
}: ChatAiDisclaimerProps) => (
  <p
    className={cn(
      "flex items-start gap-2 text-xs leading-5 text-muted-foreground",
      variant === "welcome" &&
        "rounded-lg border border-border bg-card px-3 py-2 shadow-sm",
      variant === "footer" && "mt-2 px-1"
    )}
  >
    <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
    <span>{children}</span>
  </p>
);

export default ChatAiDisclaimer;
