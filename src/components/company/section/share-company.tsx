"use client"

import { useState } from "react"
import { toast } from "sonner";
import { Copy, Share2, Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
      toast.success("Sao chép thành công", {
        style: { background: "#2563eb", color: "#fff" },
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Chia sẻ công ty</h2>
      <Card className="p-6 space-y-4">
        <p className="text-sm text-muted-foreground">Chia sẻ công ty này với bạn bè của bạn</p>
        <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
          <input
            type="text"
            value={companyLink}
            readOnly
            className="flex-1 bg-transparent text-foreground text-sm outline-none"
          />
          <button onClick={handleCopyLink} className="p-2 hover:bg-muted rounded transition-colors">
            {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
          </button>
        </div>
        <Button onClick={handleCopyLink} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Share2 className="w-4 h-4 mr-2" />
          Sao chép đường dẫn
        </Button>
        <div className="flex gap-2 pt-4 border-t border-border">
          <Button variant="outline" className="flex-1 text-blue-600 hover:bg-blue-50 border-blue-200 bg-transparent">
            Facebook
          </Button>
          <Button variant="outline" className="flex-1 text-blue-400 hover:bg-blue-50 border-blue-200 bg-transparent">
            Twitter
          </Button>
          <Button variant="outline" className="flex-1 text-red-600 hover:bg-red-50 border-red-200 bg-transparent">
            LinkedIn
          </Button>
        </div>
      </Card>
    </section>
  );
}
