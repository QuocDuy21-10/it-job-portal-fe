"use client"

import { useGetCompaniesQuery } from "@/features/company/redux/company.api";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import parse from "html-react-parser";

export default function CompanyListPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 9;
  const debouncedSearch = useDebounce(searchQuery, 400);

  // Build filter string for API
  const filter = debouncedSearch
    ? `name=/${encodeURIComponent(debouncedSearch)}/i`
    : "";

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useGetCompaniesQuery({ page, limit, filter });

  const companies = response?.data?.result || [];
  const total = response?.data?.meta?.pagination?.total || 0;
  const totalPages = response?.data?.meta?.pagination?.total_pages || 1;

  useEffect(() => {
    setPage(1); // Reset page when search changes
  }, [debouncedSearch]);

  const truncateDescription = (text: string, lines = 2) => {
    const lineArray = text.split("\n");
    if (lineArray.length > lines) {
      return lineArray.slice(0, lines).join("\n") + "...";
    }
    const maxLength = lines * 100; // Approximate character limit
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Find Your Next Employer</h1>
          <p className="text-muted-foreground text-lg">
            Browse top companies and explore exciting career opportunities
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search companies by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {total > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              Found {total} compan{total !== 1 ? "ies" : "y"}
            </p>
          )}
        </div>

        {/* Companies Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <span className="text-muted-foreground">Loading companies...</span>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <span className="text-destructive">Error loading companies.</span>
          </div>
        ) : companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company: any) => (
              <Card
                key={company._id}
                onClick={() => router.push(`/companies/${company._id}`)}
                className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border ${
                  selectedCompany === company._id
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                {/* Company Logo */}
                <div className="mb-4 flex items-center gap-3">
                  <img
                    src={company.logo ? `${API_BASE_URL_IMAGE}/images/company/${company.logo}` : "/placeholder.svg"}
                    alt={company.name}
                    className="w-12 h-12 rounded-lg bg-secondary object-cover"
                  />
                  <h3 className="text-lg font-semibold text-foreground line-clamp-2">{company.name}</h3>
                </div>

                {/* Description */}
                <div className="text-muted-foreground text-sm line-clamp-2 mb-4 leading-relaxed">
                  {parse(truncateDescription(company.description || ""))}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-4">
              <Search className="w-16 h-16 mx-auto text-muted-foreground opacity-20" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No companies found</h3>
            <p className="text-muted-foreground">Try adjusting your search query to find what you're looking for</p>
            <Button variant="outline" className="mt-6 bg-transparent" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        )}
      </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p: number) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="px-3 py-2 text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p: number) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
    </div>
  )
}
