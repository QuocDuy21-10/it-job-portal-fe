"use client";

import { Building2, MapPin, Users, ExternalLink, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

interface CompanyInfoProps {
  company: {
    id: string;
    name: string;
    employees: string;
    address: string;
    logo: string;
  };
  className?: string;
}

export default function CompanyInfo({ company, className }: CompanyInfoProps) {
  const { t, mounted } = useI18n();

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const logoUrl = company?.logo
    ? `${API_BASE_URL_IMAGE}/images/company/${company.logo}`
    : null;

  return (
    <div className={cn("space-y-4 sticky top-20", className)}>
      {/* Main Company Card */}
      <Card className="overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-4 space-y-0">
          {/* Company Logo & Name */}
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Logo Container with consistent size */}
            <div className="relative w-24 h-24 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50 flex items-center justify-center overflow-hidden group">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${company.name} logo`}
                  className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('bg-muted/50');
                  }}
                />
              ) : (
                <Building2 
                  className="w-10 h-10 text-muted-foreground/50" 
                  aria-label="Company logo placeholder"
                />
              )}
            </div>

            {/* Company Name */}
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground line-clamp-2 leading-tight">
                {company.name}
              </h2>
            </div>
          </div>
        </CardHeader>

        <Separator className="my-0" />

        <CardContent className="pt-5 pb-6 space-y-5">
          {/* Company Details */}
          <div className="space-y-4">
            {/* Employees Info */}
            <div className="flex items-start gap-3 group">
              <div className="mt-0.5 p-2 rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <Users className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  {t("companyInfo.employees")}
                </p>
                <p className="text-sm font-semibold text-foreground truncate">
                  {company.employees}
                </p>
              </div>
            </div>

            {/* Address Info */}
            <div className="flex items-start gap-3 group">
              <div className="mt-0.5 p-2 rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <MapPin className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  {t("companyInfo.address")}
                </p>
                <p className="text-sm font-semibold text-foreground line-clamp-2 leading-relaxed">
                  {company.address}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Button */}
          <Button 
            asChild 
           className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
            size="lg"
          >
            <a 
              href={`/companies/${company.id}`}
              className="flex items-center justify-center gap-2"
            >
              <span>{t("companyInfo.viewProfile")}</span>
              <ExternalLink 
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
                aria-hidden="true"
              />
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Tip Card */}
      <Card className="border-accent/30 bg-accent/5 shadow-sm">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="mt-0.5 p-2 rounded-lg bg-accent/20 text-accent-foreground">
              <Lightbulb className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">
                  {t("companyInfo.tip")}
                </span>
                {" "}
                {t("companyInfo.followTip")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
