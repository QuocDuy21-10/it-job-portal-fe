/**
 * Minimal CV Template (HTML Preview)
 * Clean and minimalist design with subtle typography
 */

import React from "react";
import { ICVProfile } from "@/shared/types/cv";
import { formatDateDisplay } from "@/lib/cv/helpers";

interface MinimalTemplateProps {
  cvData: ICVProfile;
}

export const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ cvData }) => {
  return (
    <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-6 pb-4 border-b border-gray-300">
        <h1 className="text-3xl font-light tracking-wide text-gray-800">
          {cvData.personalInfo.fullName || "Họ và Tên"}
        </h1>
        {cvData.personalInfo.title && (
          <p className="text-base text-gray-600 mt-1">{cvData.personalInfo.title}</p>
        )}
        <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-600">
          {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone}</span>}
          {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
          {cvData.personalInfo.address && <span>{cvData.personalInfo.address}</span>}
          {cvData.personalInfo.birthday && (
            <span>{formatDateDisplay(cvData.personalInfo.birthday)}</span>
          )}
          {cvData.personalInfo.gender && (
            <span>
              {cvData.personalInfo.gender === "male"
                ? "Nam"
                : cvData.personalInfo.gender === "female"
                ? "Nữ"
                : "Khác"}
            </span>
          )}
          {cvData.personalInfo.personalLink && (
            <a
              href={cvData.personalInfo.personalLink}
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {cvData.personalInfo.personalLink}
            </a>
          )}
        </div>
      </header>

      {/* Bio */}
      {cvData.personalInfo.bio && (
        <section className="mb-6">
          <h2 className="text-sm font-bold tracking-widest text-gray-700 mb-3 uppercase">
            Giới thiệu
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed text-justify">
            {cvData.personalInfo.bio}
          </p>
        </section>
      )}

      {/* Experience */}
      {cvData.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold tracking-widest text-gray-700 mb-3 uppercase">
            Kinh nghiệm làm việc
          </h2>
          <div className="space-y-4">
            {cvData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-sm text-gray-600 mt-0.5">{exp.company}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {formatDateDisplay(exp.startDate)} - {formatDateDisplay(exp.endDate)}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {cvData.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold tracking-widest text-gray-700 mb-3 uppercase">
            Học vấn
          </h2>
          <div className="space-y-4">
            {cvData.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.school}</h3>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {edu.degree} - {edu.field}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {formatDateDisplay(edu.startDate)} - {formatDateDisplay(edu.endDate)}
                  </span>
                </div>
                {edu.description && (
                  <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {cvData.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold tracking-widest text-gray-700 mb-3 uppercase">
            Kỹ năng
          </h2>
          <p className="text-sm text-gray-700">
            {cvData.skills.map((skill) => `${skill.name} (${skill.level})`).join(" • ")}
          </p>
        </section>
      )}

      {/* Projects */}
      {cvData.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold tracking-widest text-gray-700 mb-3 uppercase">
            Dự án
          </h2>
          <div className="space-y-4">
            {cvData.projects.map((project) => (
              <div key={project.id}>
                <h3 className="font-semibold text-gray-900">{project.name}</h3>
                {project.position && (
                  <p className="text-sm text-gray-600 mt-0.5">Vị trí: {project.position}</p>
                )}
                <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                  {project.description}
                </p>
                {project.link && (
                  <a
                    href={project.link}
                    className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.link}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {cvData.languages.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold tracking-widest text-gray-700 mb-3 uppercase">
            Ngôn ngữ
          </h2>
          <p className="text-sm text-gray-700">
            {cvData.languages
              .map((lang) => `${lang.name} (${lang.proficiency})`)
              .join(" • ")}
          </p>
        </section>
      )}

      {/* Certificates */}
      {cvData.certificates.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold tracking-widest text-gray-700 mb-3 uppercase">
            Chứng chỉ
          </h2>
          <div className="space-y-3">
            {cvData.certificates.map((cert) => (
              <div key={cert.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                    <p className="text-sm text-gray-600 mt-0.5">Tổ chức cấp: {cert.issuer}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {formatDateDisplay(cert.date)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Awards */}
      {cvData.awards.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold tracking-widest text-gray-700 mb-3 uppercase">
            Giải thưởng
          </h2>
          <div className="space-y-3">
            {cvData.awards.map((award) => (
              <div key={award.id}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{award.name}</h3>
                    {award.description && (
                      <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                        {award.description}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {formatDateDisplay(award.date)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
