import { MapPin, Globe } from "lucide-react"
import { Card } from "@/components/ui/card"
import * as Tooltip from "@radix-ui/react-tooltip";

interface CompanyContactProps {
  company: any;
}

export default function CompanyContact({ company }: CompanyContactProps) {
  return (
    <Tooltip.Provider>
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Thông tin liên hệ</h2>
        </div>
        <Card className="p-6 space-y-6 hover:shadow-lg transition-shadow duration-300 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Tooltip.Root delayDuration={200}>
            <Tooltip.Trigger asChild>
              <div className="group cursor-help">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wider">Địa chỉ</p>
                <div className="flex gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-slate-900 dark:text-slate-100 font-medium flex-1">{company?.address || "Chưa cập nhật"}</span>
                </div>
              </div>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                Vị trí văn phòng công ty
                <Tooltip.Arrow className="fill-slate-900" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>

          <Tooltip.Root delayDuration={200}>
            <Tooltip.Trigger asChild>
              <div className="group cursor-help">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wider">Website</p>
                <div className="flex gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-colors">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                    <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  {company?.website ? (
                    <a 
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 dark:text-emerald-300 font-medium hover:text-emerald-800 dark:hover:text-emerald-200 hover:underline transition-colors flex-1"
                    >
                      {company.website}
                    </a>
                  ) : (
                    <span className="text-slate-900 dark:text-slate-100 font-medium flex-1">Chưa cập nhật</span>
                  )}
                </div>
              </div>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                Trang web chính thức của công ty
                <Tooltip.Arrow className="fill-slate-900" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Card>
      </section>
    </Tooltip.Provider>
  );
}
