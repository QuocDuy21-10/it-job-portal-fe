"use client"

import { useState } from "react"
import { toast } from "sonner";
import { Copy, Share2, Check, Facebook, Twitter, Linkedin } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import * as Tooltip from "@radix-ui/react-tooltip";

interface ShareCompanyProps {
  company: any;
}

export default function ShareCompany({ company }: ShareCompanyProps) {
  const [copied, setCopied] = useState(false);
  const companyLink = typeof window !== "undefined" && window.location ? window.location.href : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(companyLink);
      setCopied(true);
      toast.success("Sao chép thành công");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Tooltip.Provider>
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Chia sẻ công ty</h2>
        </div>
        <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow duration-300 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <p className="text-sm text-slate-600 dark:text-slate-400">Chia sẻ công ty này với bạn bè của bạn</p>
          <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <input
              type="text"
              value={companyLink}
              readOnly
              className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 text-sm outline-none"
            />
            <Tooltip.Root delayDuration={200}>
              <Tooltip.Trigger asChild>
                <button 
                  onClick={handleCopyLink} 
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-600 dark:text-slate-400" />}
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                  {copied ? "Đã sao chép!" : "Sao chép liên kết"}
                  <Tooltip.Arrow className="fill-slate-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>
          <Button 
            onClick={handleCopyLink} 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Sao chép đường dẫn
          </Button>
          <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Tooltip.Root delayDuration={200}>
              <Tooltip.Trigger asChild>
                <Button variant="outline" className="flex-1 text-blue-600 hover:bg-blue-50 border-blue-200 bg-transparent dark:bg-transparent dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-950 transition-all">
                  Facebook
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                  Chia sẻ lên Facebook
                  <Tooltip.Arrow className="fill-slate-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <Tooltip.Root delayDuration={200}>
              <Tooltip.Trigger asChild>
                <Button variant="outline" className="flex-1 text-sky-500 hover:bg-sky-50 border-sky-200 bg-transparent dark:bg-transparent dark:text-sky-400 dark:border-sky-800 dark:hover:bg-sky-950 transition-all">
                  Twitter
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                  Chia sẻ lên Twitter
                  <Tooltip.Arrow className="fill-slate-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <Tooltip.Root delayDuration={200}>
              <Tooltip.Trigger asChild>
                <Button variant="outline" className="flex-1 text-blue-700 hover:bg-blue-50 border-blue-200 bg-transparent dark:bg-transparent dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-950 transition-all">
                  LinkedIn
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                  Chia sẻ lên LinkedIn
                  <Tooltip.Arrow className="fill-slate-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>
        </Card>
      </section>
    </Tooltip.Provider>
  );
}
