"use client";

import { Edit2 } from 'lucide-react';
import { Card } from "@/components/ui/card";
import CVFormSection from "@/components/sections/cv-form-section";

interface PersonalInfoSectionProps {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    birthday: string;
    gender: string;
    personalLink: string;
    bio: string;
  };
  onUpdate: (field: string, value: string) => void;
}

export default function PersonalInfoSection({
  personalInfo,
  onUpdate,
}: PersonalInfoSectionProps) {
  return (
    <CVFormSection
      title="Personal Information"
      description="Update your personal details"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Full Name *"
          type="text"
          value={personalInfo.fullName}
          onChange={(e) => onUpdate("fullName", e.target.value)}
          placeholder="John Doe"
        />
        <InputField
          label="Email *"
          type="email"
          value={personalInfo.email}
          onChange={(e) => onUpdate("email", e.target.value)}
          placeholder="john@example.com"
        />
        <InputField
          label="Phone"
          type="tel"
          value={personalInfo.phone}
          onChange={(e) => onUpdate("phone", e.target.value)}
          placeholder="+1 (555) 000-0000"
        />
        <InputField
          label="Birthday"
          type="date"
          value={personalInfo.birthday}
          onChange={(e) => onUpdate("birthday", e.target.value)}
        />
        <SelectField
          label="Gender"
          value={personalInfo.gender}
          onChange={(e) => onUpdate("gender", e.target.value)}
          options={["Male", "Female", "Other"]}
        />
        <InputField
          label="Address"
          type="text"
          value={personalInfo.address}
          onChange={(e) => onUpdate("address", e.target.value)}
          placeholder="City, Country"
        />
        <InputField
          label="Personal Link"
          type="url"
          value={personalInfo.personalLink}
          onChange={(e) => onUpdate("personalLink", e.target.value)}
          placeholder="https://example.com"
          className="md:col-span-2"
        />
        <TextAreaField
          label="Bio"
          value={personalInfo.bio}
          onChange={(e) => onUpdate("bio", e.target.value)}
          placeholder="Tell us about yourself..."
          rows={4}
          className="md:col-span-2"
        />
      </div>
    </CVFormSection>
  );
}

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2 text-foreground">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-foreground">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2 text-foreground">
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
      />
    </div>
  );
}
