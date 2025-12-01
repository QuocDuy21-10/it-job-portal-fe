"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IJob } from "@/shared/types/backend";
import { BriefcaseIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";

interface JobCardProps {
  job: IJob;
}
const JobCard = ({ job }: JobCardProps) => {
  const router = useRouter();

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const handleClick = () => {
    router.push(`/jobs/${job._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="min-w-[250px] max-w-[250px] p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-all flex-shrink-0 group"
    >
      {/* Header: Logo + Job Title */}
      <div className="flex gap-3 items-start mb-2">
        {job.company?.logo ? (
          <img
            src={`${API_BASE_URL_IMAGE}/images/company/${job.company.logo}`} 
            alt={job.company.name || "Company logo"}
            className="w-10 h-10 rounded-md object-cover border border-gray-200 dark:border-gray-600 flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
            <BriefcaseIcon className="w-6 h-6 text-gray-400" />
          </div>
        )}
        <div className="overflow-hidden flex-1">
          <h4
            className="font-bold text-sm truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            title={job.name}
          >
            {job.name}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {job.company?.name || "Chưa cập nhật"}
          </p>
        </div>
      </div>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="flex gap-1 flex-wrap mb-2">
          {job.skills.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="text-[10px] text-gray-400">+{job.skills.length - 3}</span>
          )}
        </div>
      )}

      {/* Location */}
      {job.location && (
        <div className="flex items-center gap-1 mb-2">
          <MapPinIcon className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
            {job.location}
          </span>
        </div>
      )}

      {/* Footer: Salary + Action */}
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        {/* <span className="text-xs font-semibold text-green-600 dark:text-green-400">
          {formatSalary(job.salary)}
        </span> */}
        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-0.5 transition-transform">
          Xem ngay →
        </span>
      </div>
    </div>
  );
};

export default JobCard;