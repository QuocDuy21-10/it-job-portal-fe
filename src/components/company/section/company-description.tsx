"use client"

import { useState } from "react"
import parse from "html-react-parser";
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface CompanyDescriptionProps {
  company: any;
}

export default function CompanyDescription({ company }: CompanyDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const fullDescription = company?.description || "";
  const shortDescription = fullDescription.length > 500 ? fullDescription.slice(0, 500) + "..." : fullDescription;

  return (
    <section>
      <h2 className="text-2xl font-bold text-foreground mb-6">Thông tin về công ty</h2>
      <Card className="p-6 space-y-4">
        <div className="text-foreground leading-relaxed">
          {parse(isExpanded ? fullDescription : shortDescription)}
        </div>
        {fullDescription.length > 500 && (
          <Button onClick={() => setIsExpanded(!isExpanded)} variant="outline" className="w-full sm:w-auto">
            {isExpanded ? "Thu gọn" : "Xem thêm"}
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </Button>
        )}
      </Card>
    </section>
  );
}
