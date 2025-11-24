
"use client";
import { useMemo, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useGetCompanyQuery } from "@/features/company/redux/company.api";
import CompanyHeader from "@/components/company/section/company-header";
import CompanyDescription from "@/components/company/section/company-description";
import JobListing from "@/components/company/section/job-listing";
import CompanyContact from "@/components/company/section/company-contact";
import ShareCompany from "@/components/company/section/share-company";

export default function CompanyDetailPage() {
  const params = useParams();
  const companyId = useMemo(() => params?.id as string, [params]);
  const { data, isLoading, error } = useGetCompanyQuery(companyId, { skip: !companyId });

  // UI state for job search/filter
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  // Memoize company data to avoid unnecessary rerenders
  const company = useMemo(() => data?.data, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-muted-foreground">Đang tải thông tin công ty...</span>
      </div>
    );
  }
  if (error || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-destructive">Không tìm thấy công ty.</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Breadcrumb Navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  href="/"
                  className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                >
                  Trang chủ
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  href="/companies"
                  className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                >
                  Công ty
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-slate-900 dark:text-slate-100 font-medium line-clamp-1">
                  {company.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Header Section */}
      <CompanyHeader company={company} />

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Side - Description */}
          <div className="lg:col-span-2 space-y-8">
            <CompanyDescription company={company} />

            {/* Job Listing Section */}
            <section className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Các việc làm đang tuyển dụng</h2>
                </div>
                <p className="text-slate-600 dark:text-slate-400 ml-4">Khám phá các cơ hội nghề nghiệp hiện có từ công ty này</p>
              </div>

              {/* Filter Section */}
              <Card className="p-6 hover:shadow-lg transition-shadow duration-300 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Tìm kiếm theo tên công việc..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-11 border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500 transition-colors "
                    />
                  </div>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="px-4 py-2.5 h-11 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer hover:border-blue-400"
                  >
                    <option value="all">Tất cả vị trí</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                  </select>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-11 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                    <Search className="w-4 h-4 mr-2" />
                    Tìm kiếm
                  </Button>
                </div>
              </Card>

              <JobListing
                companyId={company._id}
                searchQuery={debouncedSearchQuery}
                selectedLocation={selectedLocation}
              />
            </section>
          </div>

          {/* Right Side - Company Info & Share */}
          <div className="space-y-8">
            <CompanyContact company={company} />
            <ShareCompany company={company} />
          </div>
        </div>
      </div>
    </main>
  );
}
