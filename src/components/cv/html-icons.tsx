/**
 * HTML CV Icon Components
 * Sử dụng lucide-react icons để match với PDF SVG icons
 * Giúp đồng bộ visual giữa HTML preview và PDF export
 */

import React from "react";
import { Mail, Phone, MapPin, Calendar, User, Link2, Briefcase, Award } from "lucide-react";

interface HTMLIconProps {
  className?: string;
  size?: number;
}

export const EmailIconHTML: React.FC<HTMLIconProps> = ({ className = "w-3.5 h-3.5", size }) => (
  <Mail className={className} size={size} />
);

export const PhoneIconHTML: React.FC<HTMLIconProps> = ({ className = "w-3.5 h-3.5", size }) => (
  <Phone className={className} size={size} />
);

export const LocationIconHTML: React.FC<HTMLIconProps> = ({ className = "w-3.5 h-3.5", size }) => (
  <MapPin className={className} size={size} />
);

export const CalendarIconHTML: React.FC<HTMLIconProps> = ({ className = "w-3.5 h-3.5", size }) => (
  <Calendar className={className} size={size} />
);

export const UserIconHTML: React.FC<HTMLIconProps> = ({ className = "w-3.5 h-3.5", size }) => (
  <User className={className} size={size} />
);

export const LinkIconHTML: React.FC<HTMLIconProps> = ({ className = "w-3.5 h-3.5", size }) => (
  <Link2 className={className} size={size} />
);

export const BriefcaseIconHTML: React.FC<HTMLIconProps> = ({ className = "w-3.5 h-3.5", size }) => (
  <Briefcase className={className} size={size} />
);

export const AwardIconHTML: React.FC<HTMLIconProps> = ({ className = "w-3.5 h-3.5", size }) => (
  <Award className={className} size={size} />
);
