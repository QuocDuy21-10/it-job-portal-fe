"use client";

import { Building2, MapPin, Users } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";

interface CompanyInfoProps {
  company: {
    name: string;
    employees: string;
    address: string;
    logo: string;
  };
}

export default function CompanyInfo({ company }: CompanyInfoProps) {
  return (
    <div className="space-y-4 sticky top-20">
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
        {/* Company Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">
            {company?.logo ? (
              <img
                src={`${API_BASE_URL_IMAGE}/images/company/${company.logo}`}
                alt={`${company?.name} logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-foreground">{company.name}</h2>
        </div>

        {/* Company Details */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Employees</p>
              <p className="font-semibold">{company.employees}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-semibold text-sm">{company.address}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 mt-6 pt-6 border-t border-border">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
            View Company Profile
          </Button>
          <button className="w-full px-4 py-2 border border-border text-foreground hover:bg-secondary rounded-lg font-medium transition">
            Follow Company
          </button>
        </div>
      </Card>

      {/* Additional Info Card */}
      <Card className="p-4 bg-accent/5 border border-accent/20">
        <p className="text-sm text-muted-foreground">
          💡 <span className="font-medium">Tip:</span> Follow this company to
          receive notifications about new job openings.
        </p>
      </Card>
    </div>
  );
}
