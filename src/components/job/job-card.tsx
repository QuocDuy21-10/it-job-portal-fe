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

/**
 * JobCard Component - Reusable job card với save/unsave functionality
 * 
 * Features:
 * - Optimistic UI updates
 * - Heart icon để save/unsave
 * - Responsive design
 * - Multiple variants
 */
export function JobCard({ job, variant = "default", className }: JobCardProps) {
  const { isSaved, toggleSaveJob, isLoading } = useJobFavorite(job._id);

  if (variant === "compact") {
    return (
      <Card className={cn("hover:shadow-md transition-shadow", className)}>
        <CardContent className="p-4">
          <Link href={`/jobs/${job._id}`} className="block">
            <div className="flex items-start gap-3">
              {/* Company Logo */}
              <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {job.company?.logo ? (
                  <img
                    src={`${API_BASE_URL_IMAGE}/images/company/${job.company.logo}`}
                    alt={`${job.company?.name} logo`}
                    className="h-full w-full object-cover border border-gray-200 border-solid rounded-lg"
                  />
                ) : (
                  <Building2 className="h-6 w-6 text-gray-400" />
                )}
              </div>

              {/* Job Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base mb-1 line-clamp-1 hover:text-blue-600 transition-colors">
                  {job.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {job.company?.name}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    {job.location}
                  </Badge>
                  <span className="text-sm font-semibold text-blue-600">
                    ${job.salary?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Save Button */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex-shrink-0"
                onClick={toggleSaveJob}
                disabled={isLoading}
                aria-label={isSaved ? "Unsave job" : "Save job"}
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-all",
                    isSaved
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400 hover:text-red-500"
                  )}
                />
              </Button>
            </div>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (variant === "detailed") {
    return (
      <Card className={cn("hover:shadow-md transition-shadow", className)}>
        <CardContent className="p-6">
          <Link href={`/jobs/${job._id}`} className="block">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Company Logo */}
              <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {job.company?.logo ? (
                  <img
                    src={`${API_BASE_URL_IMAGE}/images/company/${job.company.logo}`}
                    alt={`${job.company.name} logo`}
                    className="h-full w-full object-cover object-center border border-gray-200 border-solid rounded-lg"
                  />
                ) : (
                  <Building2 className="h-8 w-8 text-gray-400" />
                )}
              </div>

              {/* Job Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-xl mb-1 hover:text-blue-600 transition-colors">
                  {job.name}
                </h3>
                <p className="text-gray-600 mb-3">{job.company?.name}</p>

                {/* Badges */}
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

                {/* Skills */}
                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.skills.slice(0, 5).map((skill: string) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {job.skills.length > 5 && (
                      <Badge variant="secondary" className="text-xs">
                        +{job.skills.length - 5} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Date & Actions */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:min-w-[120px]">
                {job.createdAt && (
                  <span className="text-xs text-gray-500">
                    {new Date(job.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-blue-600">
                    ${job.salary?.toLocaleString()}
                  </span>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={toggleSaveJob}
                    disabled={isLoading}
                    aria-label={isSaved ? "Unsave job" : "Save job"}
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5 transition-all",
                        isSaved
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400 hover:text-red-500"
                      )}
                    />
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Default variant (used in Home page)
  return (
    <Card className={cn("hover:shadow-lg transition-shadow duration-300 relative", className)}>
      <CardContent className="p-6">
        {/* Save Button - Positioned absolutely */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 h-9 w-9 p-0 rounded-full hover:bg-gray-100 z-10"
          onClick={toggleSaveJob}
          disabled={isLoading}
          aria-label={isSaved ? "Unsave job" : "Save job"}
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-all",
              isSaved
                ? "fill-red-500 text-red-500"
                : "text-gray-400 hover:text-red-500"
            )}
          />
        </Button>

        <Link href={`/jobs/${job._id}`} className="block space-y-4">
          <div className="flex items-start gap-4 pr-8">
            {/* Company Logo */}
            <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {job.company?.logo ? (
                <img
                  src={`${API_BASE_URL_IMAGE}/images/company/${job.company.logo}`}
                  alt={`${job.company?.name} logo`}
                  className="h-full w-full object-cover border border-gray-200 border-solid rounded-lg"
                />
              ) : (
                <Building2 className="h-6 w-6 text-gray-400" />
              )}
            </div>

            {/* Job Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-1 line-clamp-2 hover:text-blue-600 transition-colors">
                {job.name}
              </h3>
              <p className="text-sm text-gray-600">{job.company?.name}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" aria-hidden="true" />
              {job.location}
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {job.formOfWork}
            </Badge>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm font-semibold text-blue-600">
              ${job.salary?.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500">
              {job.createdAt &&
                new Date(job.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
            </span>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
