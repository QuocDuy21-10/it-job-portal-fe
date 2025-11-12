import { MapPin, Phone, Mail, MapPinIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CompanyContactProps {
  company: any;
}

export default function CompanyContact({ company }: CompanyContactProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Thông tin liên hệ</h2>
      <Card className="p-6 space-y-4">
        <div>
          <p className="text-sm font-semibold text-muted-foreground uppercase mb-2">Địa chỉ</p>
          <p className="text-foreground flex gap-2">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <span>{company?.address || "Chưa cập nhật"}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-muted-foreground uppercase mb-2">Website</p>
          <p className="text-foreground flex gap-2 items-center">
            <Mail className="w-5 h-5 text-primary" />
            <span>{company?.website || "Chưa cập nhật"}</span>
          </p>
        </div>
      </Card>
    </section>
  );
}
