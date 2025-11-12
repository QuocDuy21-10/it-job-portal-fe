import { MapPin, Globe, Users } from "lucide-react"

export default function CompanyOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 bg-secondary rounded-lg">
        <div className="flex items-start gap-3">
          <Globe className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Website</p>
            <p className="text-foreground font-medium">www.techsolutions.com</p>
          </div>
        </div>
      </div>
      <div className="p-4 bg-secondary rounded-lg">
        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Nhân viên</p>
            <p className="text-foreground font-medium">500+ nhân viên</p>
          </div>
        </div>
      </div>
      <div className="p-4 bg-secondary rounded-lg">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Trụ sở</p>
            <p className="text-foreground font-medium">TP. Hồ Chí Minh</p>
          </div>
        </div>
      </div>
    </div>
  )
}
