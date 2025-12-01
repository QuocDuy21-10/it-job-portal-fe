/**
 * Modern CV Template (HTML Preview)
 * Two-column layout: Gray sidebar (left) + White content (right)
 */

import React from "react";
import { ICVProfile } from "@/shared/types/cv";
import { formatDateDisplay, formatGender, getSkillLevelPercentage } from "@/lib/cv/helpers";

interface ModernTemplateProps {
  cvData: ICVProfile;
}

export const ModernTemplate: React.FC<ModernTemplateProps> = ({ cvData }) => {
  return (
    <div className="bg-white text-gray-800 rounded-lg shadow-lg max-w-4xl mx-auto flex min-h-[842px]">
      {/* ==================== SIDEBAR (LEFT) ==================== */}
      <div className="w-[35%] bg-[#E9ECEC] p-6 rounded-l-lg">
        {/* Header with Avatar */}
        <div className="text-center mb-6">
          {cvData.personalInfo.avatar ? (
            <img
              src={cvData.personalInfo.avatar}
              alt={cvData.personalInfo.fullName}
              className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-2 border-gray-300"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mx-auto mb-3">
              <span className="text-xs text-gray-500">Ảnh</span>
            </div>
          )}
          <h1 className="text-xl font-bold text-[#2F4F4F] mb-1">
            {cvData.personalInfo.fullName || "Họ và Tên"}
          </h1>
          {cvData.personalInfo.title && (
            <p className="text-sm text-gray-600 font-semibold">
              {cvData.personalInfo.title}
            </p>
          )}
        </div>

        {/* Personal Information */}
        <div className="mb-6">
          <h2 className="bg-[#2F4F4F] text-white text-xs font-bold uppercase tracking-wider px-2 py-1.5 mb-3">
            Thông tin cá nhân
          </h2>
          <div className="space-y-2 text-xs px-1">
            {cvData.personalInfo.birthday && (
              <div className="flex gap-2">
                <span className="font-bold text-[#2F4F4F] w-20 flex-shrink-0">Ngày sinh:</span>
                <span className="text-black flex-1">
                  {formatDateDisplay(cvData.personalInfo.birthday)}
                </span>
              </div>
            )}
            {cvData.personalInfo.gender && (
              <div className="flex gap-2">
                <span className="font-bold text-[#2F4F4F] w-20 flex-shrink-0">Giới tính:</span>
                <span className="text-black flex-1">
                  {formatGender(cvData.personalInfo.gender)}
                </span>
              </div>
            )}
            {cvData.personalInfo.phone && (
              <div className="flex gap-2">
                <span className="font-bold text-[#2F4F4F] w-20 flex-shrink-0">Điện thoại:</span>
                <span className="text-black flex-1">{cvData.personalInfo.phone}</span>
              </div>
            )}
            {cvData.personalInfo.email && (
              <div className="flex gap-2">
                <span className="font-bold text-[#2F4F4F] w-20 flex-shrink-0">Email:</span>
                <span className="text-black flex-1 break-all">{cvData.personalInfo.email}</span>
              </div>
            )}
            {cvData.personalInfo.address && (
              <div className="flex gap-2">
                <span className="font-bold text-[#2F4F4F] w-20 flex-shrink-0">Địa chỉ:</span>
                <span className="text-black flex-1">{cvData.personalInfo.address}</span>
              </div>
            )}
            {cvData.personalInfo.personalLink && (
              <div className="flex gap-2">
                <span className="font-bold text-[#2F4F4F] w-20 flex-shrink-0">Website:</span>
                <span className="text-black flex-1 break-all text-xs">
                  {cvData.personalInfo.personalLink}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {cvData.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="bg-[#2F4F4F] text-white text-xs font-bold uppercase tracking-wider px-2 py-1.5 mb-3">
              Kỹ năng
            </h2>
            <div className="space-y-3 px-1">
              {cvData.skills.map((skill) => (
                <div key={skill.id}>
                  <p className="text-sm font-semibold text-gray-800 mb-1">{skill.name}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <div
                          key={dot}
                          className={`w-1.5 h-1.5 rounded-full ${
                            dot <= (skill.level === "Beginner" ? 1 :
                                   skill.level === "Intermediate" ? 3 :
                                   skill.level === "Advanced" ? 4 :
                                   skill.level === "Expert" ? 5 : 3)
                              ? "bg-[#2F4F4F]"
                              : "bg-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">{skill.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {cvData.education.length > 0 && (
          <div className="mb-6">
            <h2 className="bg-[#2F4F4F] text-white text-xs font-bold uppercase tracking-wider px-2 py-1.5 mb-3">
              Học vấn
            </h2>
            <div className="space-y-4 px-1">
              {cvData.education.map((edu) => (
                <div key={edu.id}>
                  <p className="text-sm font-bold text-[#2F4F4F] mb-1">{edu.school}</p>
                  <p className="text-xs text-gray-800 mb-1">
                    {edu.degree} - {edu.field}
                  </p>
                  <p className="text-xs text-gray-600 italic mb-1">
                    {formatDateDisplay(edu.startDate)} - {formatDateDisplay(edu.endDate)}
                  </p>
                  {edu.description && (
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ==================== CONTENT (RIGHT) ==================== */}
      <div className="flex-1 p-8 bg-white rounded-r-lg">
        {/* Career Objective / Bio */}
        {cvData.personalInfo.bio && (
          <section className="mb-6">
            <h2 className="bg-[#2F4F4F] text-white text-sm font-bold uppercase tracking-wider px-2 py-1.5 mb-3">
              Mục tiêu nghề nghiệp
            </h2>
            <p className="text-sm text-gray-800 leading-relaxed text-justify">
              {cvData.personalInfo.bio}
            </p>
          </section>
        )}

        {/* Experience */}
        {cvData.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="bg-[#2F4F4F] text-white text-sm font-bold uppercase tracking-wider px-2 py-1.5 mb-3">
              Kinh nghiệm làm việc
            </h2>
            <div className="space-y-4">
              {cvData.experience.map((exp, idx) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <h3 className="font-bold text-[#2F4F4F] text-base">{exp.company}</h3>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">{exp.position}</p>
                    </div>
                    <span className="text-xs text-gray-600 italic whitespace-nowrap ml-4">
                      {formatDateDisplay(exp.startDate)} - {formatDateDisplay(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-gray-800 leading-relaxed text-justify mt-1">
                      {exp.description}
                    </p>
                  )}
                  {cvData.experience.length >= 2 && idx < cvData.experience.length - 1 && (
                    <div className="border-b border-[#2F4F4F] mt-4" />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {cvData.projects.length > 0 && (
          <section className="mb-6">
            <h2 className="bg-[#2F4F4F] text-white text-sm font-bold uppercase tracking-wider px-2 py-1.5 mb-3">
              Dự án
            </h2>
            <div className="space-y-4">
              {cvData.projects.map((project, idx) => (
                <div key={project.id}>
                  <h3 className="font-bold text-[#2F4F4F] text-base">{project.name}</h3>
                  {project.position && (
                    <p className="text-sm text-gray-600 font-semibold mt-0.5">
                      Vị trí: {project.position}
                    </p>
                  )}
                  <p className="text-sm text-gray-800 leading-relaxed mt-1 text-justify">
                    {project.description}
                  </p>
                  {project.link && (
                    <p className="text-xs text-[#2F4F4F] italic mt-1">Link: {project.link}</p>
                  )}
                  {cvData.projects.length >= 2 && idx < cvData.projects.length - 1 && (
                    <div className="border-b border-[#2F4F4F] mt-4" />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {cvData.languages.length > 0 && (
          <section className="mb-6">
            <h2 className="bg-[#2F4F4F] text-white text-sm font-bold uppercase tracking-wider px-2 py-1.5 mb-3">
              Ngôn ngữ
            </h2>
            <div className="space-y-2">
              {cvData.languages.map((lang, idx) => (
                <div key={lang.id}>
                  <div className="flex justify-between items-center py-1">
                    <p className="font-semibold text-gray-800 text-sm">{lang.name}</p>
                    <p className="text-sm text-gray-600 italic">{lang.proficiency}</p>
                  </div>
                  {cvData.languages.length >= 2 && idx < cvData.languages.length - 1 && (
                    <div className="border-b border-[#2F4F4F]" />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certificates */}
        {cvData.certificates.length > 0 && (
          <section className="mb-6">
            <h2 className="bg-[#2F4F4F] text-white text-sm font-bold uppercase tracking-wider px-2 py-1.5 mb-3">
              Chứng chỉ
            </h2>
            <div className="space-y-3">
              {cvData.certificates.map((cert, idx) => (
                <div key={cert.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-[#2F4F4F] text-sm">{cert.name}</h3>
                      <p className="text-sm text-gray-800 mt-0.5">
                        Tổ chức cấp: {cert.issuer}
                      </p>
                    </div>
                    <span className="text-xs text-gray-600 italic whitespace-nowrap ml-4">
                      {formatDateDisplay(cert.date)}
                    </span>
                  </div>
                  {cvData.certificates.length >= 2 && idx < cvData.certificates.length - 1 && (
                    <div className="border-b border-[#2F4F4F] mt-3" />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Awards */}
        {cvData.awards.length > 0 && (
          <section className="mb-6">
            <h2 className="bg-[#2F4F4F] text-white text-sm font-bold uppercase tracking-wider px-2 py-1.5 mb-3">
              Danh hiệu & Giải thưởng
            </h2>
            <div className="space-y-3">
              {cvData.awards.map((award, idx) => (
                <div key={award.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-[#2F4F4F] text-sm">{award.name}</h3>
                      {award.description && (
                        <p className="text-sm text-gray-800 mt-1 leading-relaxed">
                          {award.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-600 italic whitespace-nowrap ml-4">
                      {formatDateDisplay(award.date)}
                    </span>
                  </div>
                  {cvData.awards.length >= 2 && idx < cvData.awards.length - 1 && (
                    <div className="border-b border-[#2F4F4F] mt-3" />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
