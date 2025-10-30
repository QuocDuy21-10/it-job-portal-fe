"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, MapPin, Building2, Briefcase, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  experience_level: string;
  salary_min: number;
  salary_max: number;
  salary_currency: string;
  skills: string[];
  created_at: string;
  companies: {
    id: string;
    name: string;
    logo_url: string;
  };
}

export default function JobsPage() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [locationQuery, setLocationQuery] = useState(
    searchParams.get("location") || ""
  );
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");

  useEffect(() => {
    fetchJobs();
  }, []);

  // Thay thế hàm fetchJobs với mock data
  async function fetchJobs() {
    setLoading(true);

    // Mock data
    const MOCK_JOBS: Job[] = [
      {
        id: "1",
        title: "Senior Frontend Developer",
        description:
          "We are looking for an experienced Frontend Developer with React expertise to join our team...",
        location: "Ho Chi Minh City, Vietnam",
        job_type: "full-time",
        experience_level: "senior",
        salary_min: 3000,
        salary_max: 5000,
        salary_currency: "USD",
        skills: ["React", "TypeScript", "NextJS", "TailwindCSS"],
        created_at: new Date().toISOString(),
        companies: {
          id: "c1",
          name: "Tech Solutions Inc",
          logo_url:
            "https://images.unsplash.com/photo-1549924231-f129b911e442?w=200&h=200",
        },
      },
      {
        id: "2",
        title: "Backend Engineer",
        description:
          "Looking for a Backend Engineer with strong Node.js and database experience...",
        location: "Remote",
        job_type: "remote",
        experience_level: "mid",
        salary_min: 2500,
        salary_max: 4000,
        salary_currency: "USD",
        skills: ["NodeJS", "PostgreSQL", "Docker", "AWS"],
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        companies: {
          id: "c2",
          name: "Cloud Systems Co",
          logo_url:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200",
        },
      },
      {
        id: "3",
        title: "UI/UX Designer",
        description:
          "Seeking a creative UI/UX Designer to help shape the future of our products...",
        location: "Hanoi, Vietnam",
        job_type: "hybrid",
        experience_level: "junior",
        salary_min: 1500,
        salary_max: 2500,
        salary_currency: "USD",
        skills: ["Figma", "Adobe XD", "UI Design", "User Research"],
        created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        companies: {
          id: "c3",
          name: "Creative Design Studio",
          logo_url:
            "https://images.unsplash.com/photo-1558486012-817176f84c6d?w=200&h=200",
        },
      },
      {
        id: "4",
        title: "DevOps Engineer",
        description:
          "Join our infrastructure team to help scale and maintain our cloud platforms...",
        location: "Singapore",
        job_type: "full-time",
        experience_level: "senior",
        salary_min: 6000,
        salary_max: 9000,
        salary_currency: "USD",
        skills: ["Kubernetes", "AWS", "Terraform", "CI/CD"],
        created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        companies: {
          id: "c4",
          name: "Cloud Infrastructure Ltd",
          logo_url:
            "https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=200",
        },
      },
    ];

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setJobs(MOCK_JOBS);
    setLoading(false);
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesLocation =
      !locationQuery ||
      job.location.toLowerCase().includes(locationQuery.toLowerCase());

    const matchesJobType =
      jobTypeFilter === "all" || job.job_type === jobTypeFilter;
    const matchesExperience =
      experienceFilter === "all" || job.experience_level === experienceFilter;

    return (
      matchesSearch && matchesLocation && matchesJobType && matchesExperience
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">
            Find Your 222 Next Opportunity
          </h1>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="sm:col-span-1">
                <label htmlFor="search-jobs" className="sr-only">
                  Search jobs
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <Input
                    id="search-jobs"
                    placeholder="Job title or keyword"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="location" className="sr-only">
                  Location
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <Input
                    id="location"
                    placeholder="Location"
                    className="pl-10"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="job-type" className="sr-only">
                  Job type
                </label>
                <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                  <SelectTrigger id="job-type">
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="experience" className="sr-only">
                  Experience level
                </label>
                <Select
                  value={experienceFilter}
                  onValueChange={setExperienceFilter}
                >
                  <SelectTrigger id="experience">
                    <SelectValue placeholder="Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="mid">Mid</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"}{" "}
            found
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <Link href={`/jobs/${job.id}`} className="block">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {job.companies?.logo_url ? (
                          <img
                            src={job.companies.logo_url}
                            alt={`${job.companies.name} logo`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Building2 className="h-8 w-8 text-gray-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-xl mb-1 hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {job.companies?.name}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="secondary" className="text-xs">
                            <MapPin
                              className="h-3 w-3 mr-1"
                              aria-hidden="true"
                            />
                            {job.location}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {job.job_type}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {job.experience_level}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <DollarSign
                              className="h-3 w-3 mr-1"
                              aria-hidden="true"
                            />
                            ${job.salary_min.toLocaleString()} - $
                            {job.salary_max.toLocaleString()}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {job.description}
                        </p>

                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {job.skills.slice(0, 5).map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills.length > 5 && (
                              <span className="px-2 py-1 text-gray-500 text-xs">
                                +{job.skills.length - 5} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                        <span className="text-xs text-gray-500">
                          {new Date(job.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                        <Button size="sm">Apply Now</Button>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
