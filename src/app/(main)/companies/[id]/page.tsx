
"use client";
import { useMemo, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
    <main className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/companies" className="text-muted-foreground hover:text-foreground">
              Companies
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{company.name}</span>
          </nav>
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
                <h2 className="text-2xl font-bold text-foreground mb-2">Các việc làm đang tuyển dụng</h2>
                <p className="text-muted-foreground">Khám phá các cơ hội nghề nghiệp hiện có từ công ty này</p>
              </div>

              {/* Filter Section */}
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Tìm kiếm theo tên công việc..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">Tất cả vị trí</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                  </select>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
