"use client";

import { MapPin, Briefcase, DollarSign } from "lucide-react";
import { Card } from "../ui/card";

const relatedJobs = [
  {
    id: 1,
    title: "Frontend Engineer",
    company: "Tech StartUp",
    location: "Ho Chi Minh City",
    salary: "$2,000 - $3,500",
    level: "Mid-level",
  },
  {
    id: 2,
    title: "React Developer",
    company: "Digital Agency",
    location: "Da Nang",
    salary: "$2,500 - $4,000",
    level: "Mid-level",
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "E-commerce Company",
    location: "Ho Chi Minh City",
    salary: "$3,000 - $5,000",
    level: "Senior",
  },
  {
    id: 4,
    title: "UI/UX Developer",
    company: "Design Studio",
    location: "Hanoi",
    salary: "$1,800 - $3,200",
    level: "Junior",
  },
];

export default function RelatedJobsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {relatedJobs.map((job) => (
        <Card
          key={job.id}
          className="p-5 hover:shadow-lg hover:border-primary transition cursor-pointer group"
        >
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition mb-3">
            {job.title}
          </h3>

          <p className="text-sm font-medium text-muted-foreground mb-4">
            {job.company}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              {job.location}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="w-4 h-4 text-primary" />
              {job.level}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4 text-primary" />
              {job.salary}
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-border">
            <button className="flex-1 px-3 py-2 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded transition">
              View Details
            </button>
            <button className="flex-1 px-3 py-2 text-sm font-medium border border-border text-foreground hover:bg-secondary rounded transition">
              Save Job
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}
