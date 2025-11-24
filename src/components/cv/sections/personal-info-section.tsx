"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CVFormSection from "@/components/sections/cv-form-section";
import { PersonalInfoSchema, type PersonalInfo } from "@/features/cv-profile/schemas/cv-profile.schema";

interface PersonalInfoSectionProps {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address?: string;
    birthday?: Date;
    gender?: "male" | "female" | "other";
    personalLink?: string;
    bio?: string;
  };
  onUpdate: (field: string, value: string | Date) => void;
}

export default function PersonalInfoSection({
  personalInfo,
  onUpdate,
}: PersonalInfoSectionProps) {
  const {
    control,
    formState: { errors },
  } = useForm<PersonalInfo>({
    resolver: zodResolver(PersonalInfoSchema),
    mode: "onChange",
    values: {
      fullName: personalInfo.fullName,
      email: personalInfo.email,
      phone: personalInfo.phone,
      birthday: personalInfo.birthday,
      gender: personalInfo.gender || "male",
      address: personalInfo.address,
      personalLink: personalInfo.personalLink,
      bio: personalInfo.bio,
    },
  });

  return (
    <CVFormSection
      title="Personal Information"
      description="Update your personal details"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="fullName"
          control={control}
          render={({ field }) => (
            <InputField
              label="Full Name *"
              type="text"
              value={field.value}
              onChange={(e) => {
                field.onChange(e);
                onUpdate("fullName", e.target.value);
              }}
              placeholder="John Doe"
              error={errors.fullName?.message}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <InputField
              label="Email *"
              type="email"
              value={field.value}
              onChange={(e) => {
                field.onChange(e);
                onUpdate("email", e.target.value);
              }}
              placeholder="john@example.com"
              error={errors.email?.message}
            />
          )}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <InputField
              label="Phone *"
              type="tel"
              value={field.value}
              onChange={(e) => {
                field.onChange(e);
                onUpdate("phone", e.target.value);
              }}
              placeholder="+84 (555) 000-0000"
              error={errors.phone?.message}
            />
          )}
        />
        <Controller
          name="birthday"
          control={control}
          render={({ field }) => (
            <InputField
              label="Birthday"
              type="date"
              value={field.value ? new Date(field.value).toISOString().split('T')[0] : ""}
              onChange={(e) => {
                const dateValue = e.target.value ? new Date(e.target.value) : undefined;
                field.onChange(dateValue);
                if (dateValue) onUpdate("birthday", dateValue);
              }}
              error={errors.birthday?.message}
            />
          )}
        />
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <SelectField
              label="Gender *"
              value={field.value}
              onChange={(e) => {
                field.onChange(e);
                onUpdate("gender", e.target.value);
              }}
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
              error={errors.gender?.message}
            />
          )}
        />
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <InputField
              label="Address"
              type="text"
              value={field.value || ""}
              onChange={(e) => {
                field.onChange(e);
                onUpdate("address", e.target.value);
              }}
              placeholder="City, Country"
              error={errors.address?.message}
            />
          )}
        />
        <Controller
          name="personalLink"
          control={control}
          render={({ field }) => (
            <InputField
              label="Personal Link"
              type="url"
              value={field.value || ""}
              onChange={(e) => {
                field.onChange(e);
                onUpdate("personalLink", e.target.value);
              }}
              placeholder="https://example.com"
              className="md:col-span-2"
              error={errors.personalLink?.message}
            />
          )}
        />
        <Controller
          name="bio"
          control={control}
          render={({ field }) => (
            <TextAreaField
              label="Bio"
              value={field.value || ""}
              onChange={(e) => {
                field.onChange(e);
                onUpdate("bio", e.target.value);
              }}
              placeholder="Tell us about yourself..."
              rows={4}
              className="md:col-span-2"
              error={errors.bio?.message}
            />
          )}
        />
      </div>
    </CVFormSection>
  );
}

const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  error,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}) => {
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
        className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
          error ? "border-destructive focus:ring-destructive/50" : "border-border"
        }`}
      />
      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};

const SelectField = ({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string }>;
  error?: string;
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-foreground">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
          error ? "border-destructive focus:ring-destructive/50" : "border-border"
        }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};

const TextAreaField = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  className = "",
  error,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  error?: string;
}) => {
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
        className={`w-full px-3 py-2 text-sm border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${
          error ? "border-destructive focus:ring-destructive/50" : "border-border"
        }`}
      />
      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};
