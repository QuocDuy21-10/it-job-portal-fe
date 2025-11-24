import { Button } from "@/components/ui/button";
import { Building2, Globe, Heart, Users } from "lucide-react";
import parse from "html-react-parser";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";
import { useCompanyFollow } from "@/hooks/use-company-follow";
import { cn } from "@/lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";

interface CompanyHeaderProps {
  company: any;
}

export default function CompanyHeader({ company }: CompanyHeaderProps) {
  const { isFollowing, toggleFollowCompany } = useCompanyFollow(company?._id || "");

  return (
    <Tooltip.Provider>
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white overflow-hidden">
      {/* Decorative background */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
            {/* Logo & Company Info */}
            <div className="flex gap-6 flex-1">
              <div className="w-28 h-28 rounded-xl bg-white shadow-xl flex items-center justify-center flex-shrink-0 p-2 hover:shadow-2xl transition-shadow">
                {company?.logo ? (
                <img
                  src={`${API_BASE_URL_IMAGE}/images/company/${company.logo}`}
                  alt={`${company?.name} logo`}
                  className="h-full w-full object-contain rounded-lg"
                />
              ) : (
                <Building2 className="h-12 w-12 text-slate-400" /> 
              )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight drop-shadow-lg">{company?.name}</h1>
                <div className="mb-6 text-blue-100 text-lg">
                  {parse(company?.description?.slice(0, 80) || "")}...
                </div>
                <div className="flex flex-wrap gap-6 text-sm">
                  {company?.website && (
                    <Tooltip.Root delayDuration={200}>
                      <Tooltip.Trigger asChild>
                        <div className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/20 transition-all">
                          <Globe className="w-5 h-5" />
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-200 transition-colors font-medium"
                          >
                            {company.website.replace(/^https?:\/\//, "").substring(0, 30)}
                          </a>
                        </div>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                          Truy cập website công ty
                          <Tooltip.Arrow className="fill-slate-900" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  )}
                  <Tooltip.Root delayDuration={200}>
                    <Tooltip.Trigger asChild>
                      <div className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/20 transition-all">
                        <Users className="w-5 h-5" />
                        <span className="font-medium">{company?.numberOfEmployees ? `${company.numberOfEmployees} nhân viên` : "Chưa cập nhật"}</span>
                      </div>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                        Quy mô công ty
                        <Tooltip.Arrow className="fill-slate-900" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Tooltip.Root delayDuration={200}>
              <Tooltip.Trigger asChild>
                <Button 
                  onClick={toggleFollowCompany}
                  className={cn(
                    "font-semibold whitespace-nowrap shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95",
                    isFollowing
                      ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-2 border-blue-600 dark:border-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900"
                      : "bg-white hover:bg-blue-50 text-blue-700 border-2 border-white hover:border-blue-100"
                  )}
                >
                  <Heart 
                    className={cn(
                      "w-5 h-5 mr-2 transition-all duration-300",
                      isFollowing
                        ? "fill-blue-600 dark:fill-blue-400 text-blue-600 dark:text-blue-400"
                        : "fill-transparent text-blue-700"
                    )}
                  />
                  {isFollowing ? "Đang theo dõi" : "Theo dõi công ty"}
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                  {isFollowing ? "Bỏ theo dõi công ty" : "Theo dõi để nhận thông báo việc làm mới"}
                  <Tooltip.Arrow className="fill-slate-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
}
