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
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Thông tin về công ty</h2>
      </div>
      <Card className="p-8 space-y-4 hover:shadow-lg transition-shadow duration-300 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="text-slate-700 dark:text-slate-300 leading-relaxed prose prose-slate dark:prose-invert max-w-none">
          {parse(isExpanded ? fullDescription : shortDescription)}
        </div>
        {fullDescription.length > 500 && (
          <Button 
            onClick={() => setIsExpanded(!isExpanded)} 
            variant="outline" 
            className="w-full sm:w-auto border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950 transition-all"
          >
            {isExpanded ? "Thu gọn" : "Xem thêm"}
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </Button>
        )}
      </Card>
    </section>
  );
}
