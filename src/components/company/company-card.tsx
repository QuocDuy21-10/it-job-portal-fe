import Link from "next/link";
import { Building2, Briefcase, UserPlus, UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as Tooltip from "@radix-ui/react-tooltip";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";
import { Company } from "@/features/company/schemas/company.schema";
import { useCompanyFollow } from "@/hooks/use-company-follow";
import { cn } from "@/lib/utils";
import { useI18n } from "@/hooks/use-i18n";

interface CompanyCardProps {
  company: Company;
  className?: string;
}

const FollowButton = ({
  companyId,
  className,
}: {
  companyId: string;
  className?: string;
}) => {
  const { isFollowing, toggleFollowCompany, isLoading, isAuthenticated } =
    useCompanyFollow(companyId);
  const { t } = useI18n();

  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={200}>
        <Tooltip.Trigger asChild>
          <Button
            variant={isFollowing ? "secondary" : "outline"}
            size="sm"
            onClick={toggleFollowCompany}
            disabled={isLoading}
            className={cn(
              "gap-2 transition-all duration-300 font-medium",
              isFollowing
                ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                : "hover:bg-primary/10 hover:text-primary hover:border-primary/30",
              className
            )}
            aria-label={
              isFollowing ? t("followButton.unfollowAria") : t("followButton.followAria")
            }
          >
            {isFollowing ? (
              <>
                <UserCheck className="h-4 w-4" />
                <span>{t("followButton.following")}</span>
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>{t("followButton.follow")}</span>
              </>
            )}
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
            <p className="text-sm">
              {isAuthenticated ? (
                isFollowing ? (
                  t("followButton.unfollowTooltip")
                ) : (
                  t("followButton.followTooltip")
                )
              ) : (
                t("followButton.loginTooltip")
              )}
            </p>
            <Tooltip.Arrow className="fill-slate-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

/**
 * CompanyCard Component
 * 
 * Display company information in a card format.
 * 
 * Features:
 * - Company logo with fallback
 * - Company name and description preview
 * - Total jobs count
 * - Follow/Unfollow button with optimistic UI
 * - Hover effects for better UX
 * - Responsive layout
 * - Clean visual hierarchy
 */
export function CompanyCard({ company, className }: CompanyCardProps) {
  return (
    <Card
      className={cn(
        "group hover:shadow-lg transition-all duration-300 border-transparent hover:border-primary/20",
        className
      )}
    >
      <CardContent className="p-6">
        <Link href={`/companies/${company._id}`} className="block">
          <div className="space-y-4">
            {/* Logo & Name Section */}
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 overflow-hidden border border-border p-2">
                {company.logo ? (
                  <img
                    src={`${API_BASE_URL_IMAGE}/images/company/${company.logo}`}
                    alt={`${company.name} logo`}
                    className="h-full w-full object-contain rounded-lg"
                  />
                ) : (
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                  {company.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {company.address || "-"}
                </p>
              </div>
            </div>

            {/* Stats & Actions Section */}
              <div className="flex items-center justify-between pt-4 border-t border-dashed">
                {/* Total Jobs - icon và số nằm cùng hàng */}
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Briefcase className="h-4 w-4 text-primary" />
                    </div>
                    <p className="font-bold text-foreground text-base">
                      {company.totalJobs || 0} việc làm
                    </p>
                  </div>
                </div>

                {/* Follow Button - Stop propagation to prevent navigation */}
                <div onClick={(e) => e.preventDefault()}>
                  <FollowButton companyId={company._id} />
                </div>
              </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
