import { MapPin, Globe, Users } from "lucide-react"
import { useI18n } from "@/hooks/use-i18n";

export default function CompanyOverview() {
  const { t } = useI18n();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 bg-secondary rounded-lg">
        <div className="flex items-start gap-3">
          <Globe className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">{t("companyDetailPage.contact.websiteLabel")}</p>
            <p className="text-foreground font-medium">www.techsolutions.com</p>
          </div>
        </div>
      </div>
      <div className="p-4 bg-secondary rounded-lg">
        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">{t("companyInfo.employees")}</p>
            <p className="text-foreground font-medium">{t("followButton.overview.employeesPlaceholder")}</p>
          </div>
        </div>
      </div>
      <div className="p-4 bg-secondary rounded-lg">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">{t("followButton.overview.headquarters")}</p>
            <p className="text-foreground font-medium">{t("followButton.overview.hcmCity")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
