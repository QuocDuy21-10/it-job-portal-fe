"use client";

import { Building2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { Link } from "@/i18n/navigation";

// One primary per region: the candidate action is primary, the employer one is outline.
export function HomeCta() {
  const { t } = useI18n();

  return (
    <section className="surface-hero border-t py-16 sm:py-20">
      <div className="container mx-auto grid gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        <div className="flex flex-col gap-4 rounded-lg border bg-card p-8">
          <h2 className="text-2xl font-bold text-foreground">
            {t("home.ctaCandidateTitle")}
          </h2>
          <p className="text-muted-foreground">
            {t("home.ctaCandidateDescription")}
          </p>
          <Button asChild size="lg" className="mt-auto self-start">
            <Link href="/jobs">
              <Search className="mr-2 h-5 w-5" aria-hidden="true" />
              {t("home.ctaCandidateAction")}
            </Link>
          </Button>
        </div>
        <div className="flex flex-col gap-4 rounded-lg border bg-card p-8">
          <h2 className="text-2xl font-bold text-foreground">
            {t("home.ctaEmployerTitle")}
          </h2>
          <p className="text-muted-foreground">
            {t("home.ctaEmployerDescription")}
          </p>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="mt-auto self-start"
          >
            <Link href="/employers">
              <Building2 className="mr-2 h-5 w-5" aria-hidden="true" />
              {t("home.ctaEmployerAction")}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
