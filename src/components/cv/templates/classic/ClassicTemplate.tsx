/**
 * Classic CV Template (HTML Preview)
 * Traditional professional CV layout with clean typography
 */

import React from "react";
import { ICVProfile } from "@/shared/types/cv";
import { formatDateDisplay } from "@/lib/cv/helpers";
import {
  EmailIconHTML,
  PhoneIconHTML,
  LocationIconHTML,
  CalendarIconHTML,
  UserIconHTML,
  LinkIconHTML,
} from "@/components/cv/html-icons";

interface ClassicTemplateProps {
  cvData: ICVProfile;
}

export const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ cvData }) => {
  return (
    <div className="bg-white text-black p-8 rounded-lg space-y-6 shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-black pb-4">
        <div className="flex items-start gap-6">
          {cvData.personalInfo.avatar && (
            <img
              src={cvData.personalInfo.avatar}
              alt={cvData.personalInfo.fullName}
              className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {cvData.personalInfo.fullName || "Họ và Tên"}
            </h1>
            {cvData.personalInfo.title && (
              <p className="text-lg text-gray-700 mt-1 font-medium">
                {cvData.personalInfo.title}
              </p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm">
          {cvData.personalInfo.phone && (
            <div className="flex items-center gap-2">
              <PhoneIconHTML className="w-4 h-4 text-gray-600" />
              <span>{cvData.personalInfo.phone}</span>
            </div>
          )}
          {cvData.personalInfo.email && (
            <div className="flex items-center gap-2">
              <EmailIconHTML className="w-4 h-4 text-gray-600" />
              <span>{cvData.personalInfo.email}</span>
            </div>
          )}
          {cvData.personalInfo.birthday && (
            <div className="flex items-center gap-2">
              <CalendarIconHTML className="w-4 h-4 text-gray-600" />
              <span>{formatDateDisplay(cvData.personalInfo.birthday)}</span>
            </div>
          )}
          {cvData.personalInfo.gender && (
            <div className="flex items-center gap-2">
              <UserIconHTML className="w-4 h-4 text-gray-600" />
              <span>
                {cvData.personalInfo.gender === "male"
                  ? "Nam"
                  : cvData.personalInfo.gender === "female"
                  ? "Nữ"
                  : "Khác"}
              </span>
            </div>
          )}
          {cvData.personalInfo.address && (
            <div className="flex items-center gap-2">
              <LocationIconHTML className="w-4 h-4 text-gray-600" />
              <span>{cvData.personalInfo.address}</span>
            </div>
          )}
          {cvData.personalInfo.personalLink && (
            <div className="flex items-center gap-2">
              <LinkIconHTML className="w-4 h-4 text-gray-600" />
              <a
                href={cvData.personalInfo.personalLink}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {cvData.personalInfo.personalLink}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Career Objective / Bio */}
      {cvData.personalInfo.bio && (
        <section>
          <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-3 uppercase tracking-wide text-gray-800">
            Mục tiêu nghề nghiệp
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed text-justify">
            {cvData.personalInfo.bio}
          </p>
        </section>
      )}

      {/* Education */}
      {cvData.education.length > 0 && (
        <section>
          <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-3 uppercase tracking-wide text-gray-800">
            Học vấn
          </h2>
          <div className="space-y-4">
            {cvData.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900">{edu.school}</h3>
                  <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                    {formatDateDisplay(edu.startDate)} - {formatDateDisplay(edu.endDate)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  {edu.degree} - {edu.field}
                </p>
                {edu.description && (
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
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
        <section>
          <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-3 uppercase tracking-wide text-gray-800">
            Kỹ năng
          </h2>
          <div className="flex flex-wrap gap-2">
            {cvData.skills.map((skill) => (
              <div
                key={skill.id}
                className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-md text-sm"
              >
                <span className="font-medium text-gray-900">{skill.name}</span>
                <span className="text-gray-600 ml-2">({skill.level})</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {cvData.experience.length > 0 && (
        <section>
          <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-3 uppercase tracking-wide text-gray-800">
            Kinh nghiệm làm việc
          </h2>
          <div className="space-y-4">
            {cvData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-sm text-gray-700 mt-1">{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                    {formatDateDisplay(exp.startDate)} - {formatDateDisplay(exp.endDate)}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed text-justify">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {cvData.projects.length > 0 && (
        <section>
          <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-3 uppercase tracking-wide text-gray-800">
            Dự án
          </h2>
          <div className="space-y-4">
            {cvData.projects.map((project) => (
              <div key={project.id}>
                <h3 className="font-bold text-gray-900">{project.name}</h3>
                {project.position && (
                  <p className="text-sm text-gray-700 mt-1">Vị trí: {project.position}</p>
                )}
                <p className="text-sm text-gray-600 mt-2 leading-relaxed text-justify">
                  {project.description}
                </p>
                {project.link && (
                  <a
                    href={project.link}
                    className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Link: {project.link}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {cvData.languages.length > 0 && (
        <section>
          <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-3 uppercase tracking-wide text-gray-800">
            Ngôn ngữ
          </h2>
          <div className="flex flex-wrap gap-2">
            {cvData.languages.map((lang) => (
              <div
                key={lang.id}
                className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-md text-sm"
              >
                <span className="font-medium text-gray-900">{lang.name}</span>
                <span className="text-gray-600 ml-2">({lang.proficiency})</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certificates */}
      {cvData.certificates.length > 0 && (
        <section>
          <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-3 uppercase tracking-wide text-gray-800">
            Chứng chỉ
          </h2>
          <div className="space-y-4">
            {cvData.certificates.map((cert) => (
              <div key={cert.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{cert.name}</h3>
                    <p className="text-sm text-gray-700 mt-1">Tổ chức cấp: {cert.issuer}</p>
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
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
        <section>
          <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-3 uppercase tracking-wide text-gray-800">
            Giải thưởng
          </h2>
          <div className="space-y-4">
            {cvData.awards.map((award) => (
              <div key={award.id}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{award.name}</h3>
                    {award.description && (
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        {award.description}
                      </p>
                    )}
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
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
