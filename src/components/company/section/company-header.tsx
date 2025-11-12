import { Button } from "@/components/ui/button";
import { Building2, Globe, Heart, Users } from "lucide-react";
import parse from "html-react-parser";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";
import * as Tooltip from "@radix-ui/react-tooltip";

interface CompanyHeaderProps {
  company: any;
}

export default function CompanyHeader({ company }: CompanyHeaderProps) {
  return (
    <Tooltip.Provider>
      <div className="bg-card border-b border-border bg-gradient-to-r from-blue-600 to-cyan-600 text-primary-foreground py-8">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
            {/* Logo & Company Info */}
            <div className="flex gap-4 flex-1">
              <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {company?.logo ? (
                <img
                  src={`${API_BASE_URL_IMAGE}/images/company/${company.logo}`}
                  alt={`${company?.name} logo`}
                  className="h-full w-full object-cover border border-gray-200 border-solid rounded-lg"
                />
              ) : (
                <Building2 className="h-6 w-6 text-gray-400" /> 
              )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-white mb-2">{company?.name}</h1>
                <div className="mb-4 text-white">
                  {parse(company?.description?.slice(0, 60) || "")}
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  {company?.website && (
                    <Tooltip.Root delayDuration={200}>
                      <Tooltip.Trigger asChild>
                        <div className="flex items-center gap-2 text-white">
                          <Globe className="w-4 h-4" />
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-cyan-200 transition-colors"
                          >
                            {company.website.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content sideOffset={6} className="z-50 rounded bg-black px-3 py-1.5 text-xs text-white shadow-lg">
                          Truy cập website công ty
                          <Tooltip.Arrow className="fill-black" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  )}
                  <div className="flex items-center gap-2 text-white">
                    <Users className="w-4 h-4" />
                    <span>{company?.numberOfEmployees ? `${company.numberOfEmployees} nhân viên` : "Chưa cập nhật"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground whitespace-nowrap">
              <Heart className="w-4 h-4 mr-2" />
              Theo dõi công ty
            </Button>
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
}
