import Link from "next/link";
import { Building2, MapPin, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";
import { Job } from "@/features/job/schemas/job.schema";
import { useJobFavorite } from "@/hooks/use-job-favorite";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  variant?: "default" | "compact" | "detailed";
  className?: string;
}

// Tách nút Heart ra component riêng để tái sử dụng và dễ quản lý logic UI
const FavoriteButton = ({
  isSaved,
  onClick,
  disabled,
  className,
}: {
  isSaved: boolean;
  onClick: (e: React.MouseEvent) => void;
  disabled: boolean;
  className?: string;
}) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "rounded-full hover:bg-primary/10 transition-all duration-300 active:scale-95", // Hiệu ứng click
        className
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={isSaved ? "Bỏ lưu công việc" : "Lưu công việc"}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-colors duration-300",
          isSaved
            ? "fill-primary text-primary" // Active: Lõi màu Primary, Viền Primary
            : "fill-transparent text-muted-foreground hover:text-primary" // Inactive: Lõi trong suốt, Viền xám (hover chuyển primary)
        )}
      />
    </Button>
  );
};

export function JobCard({ job, variant = "default", className }: JobCardProps) {
  const { isSaved, toggleSaveJob, isLoading } = useJobFavorite(job._id);

  // Render cho variant Compact
  if (variant === "compact") {
    return (
      <Card className={cn("hover:shadow-md transition-shadow group", className)}>
        <CardContent className="p-4">
          <Link href={`/jobs/${job._id}`} className="block">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden border border-border">
                {job.company?.logo ? (
                  <img
                    src={`${API_BASE_URL_IMAGE}/images/company/${job.company.logo}`}
                    alt={`${job.company?.name} logo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                  {job.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {job.company?.name}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs font-normal">
                    <MapPin className="h-3 w-3 mr-1" />
                    {job.location}
                  </Badge>
                  <span className="text-sm font-semibold text-primary">
                    ${job.salary?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Nút Save đã được tối ưu UI */}
              <FavoriteButton 
                isSaved={isSaved} 
                onClick={toggleSaveJob} 
                disabled={isLoading} 
                className="h-8 w-8 -mt-1 -mr-1"
              />
            </div>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Render cho variant Detailed
  if (variant === "detailed") {
    return (
      <Card className={cn("hover:shadow-md transition-shadow group", className)}>
        <CardContent className="p-6">
          <Link href={`/jobs/${job._id}`} className="block">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden border border-border">
                {job.company?.logo ? (
                  <img
                    src={`${API_BASE_URL_IMAGE}/images/company/${job.company.logo}`}
                    alt={`${job.company.name} logo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-xl mb-1 group-hover:text-primary transition-colors">
                  {job.name}
                </h3>
                <p className="text-muted-foreground mb-3">{job.company?.name}</p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    {job.location}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {job.formOfWork}
                  </Badge>
                  {job.level && (
                    <Badge variant="outline" className="text-xs capitalize">
                      {job.level}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:min-w-[120px]">
                {job.createdAt && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(job.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}

                <div className="flex items-center gap-2 mt-auto">
                  <span className="text-sm font-semibold text-primary">
                    ${job.salary?.toLocaleString()}
                  </span>
                  
                  <FavoriteButton 
                    isSaved={isSaved} 
                    onClick={toggleSaveJob} 
                    disabled={isLoading} 
                  />
                </div>
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={cn("hover:shadow-lg transition-all duration-300 relative group border-transparent hover:border-primary/20", className)}>
      <CardContent className="p-6">
        {/* Position absolute cho nút tim ở góc phải */}
        <div className="absolute top-4 right-4 z-10">
           <FavoriteButton 
              isSaved={isSaved} 
              onClick={toggleSaveJob} 
              disabled={isLoading} 
            />
        </div>

        <Link href={`/jobs/${job._id}`} className="block space-y-4">
          <div className="flex items-start gap-4 pr-8">
            <div className="h-14 w-14 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 overflow-hidden border border-border p-1">
              {job.company?.logo ? (
                <img
                  src={`${API_BASE_URL_IMAGE}/images/company/${job.company.logo}`}
                  alt={`${job.company?.name} logo`}
                  className="h-full w-full object-contain rounded-lg"
                />
              ) : (
                <Building2 className="h-7 w-7 text-muted-foreground" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                {job.name}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">{job.company?.name}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs bg-secondary/50 hover:bg-secondary">
              <MapPin className="h-3 w-3 mr-1" aria-hidden="true" />
              {job.location}
            </Badge>
            <Badge variant="outline" className="text-xs capitalize border-primary/20 text-primary/80">
              {job.formOfWork}
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-dashed">
            <span className="text-base font-bold text-primary">
              ${job.salary?.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              {job.createdAt &&
                new Date(job.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}
            </span>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}