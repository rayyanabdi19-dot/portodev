export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  created_at?: string;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  photo: string;
  bio: string;
  short_bio?: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  instagram: string;
  whatsapp: string;
  created_at?: string;
  updated_at?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_year: string;
  end_year: string;
  description: string;
  logo?: string;
  status: string; // e.g. "Lulus", "Sedang Berjalan"
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export type EmploymentType = 'Full Time' | 'Part Time' | 'Freelance' | 'Contract' | 'Internship' | 'Self Employed';

export interface Experience {
  id: string;
  position: string;
  company: string;
  location: string;
  employment_type: EmploymentType;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  responsibilities: string[];
  achievements?: string[];
  technologies: string[];
  logo?: string;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export type ProjectCategory = 'Web Application' | 'Mobile Application' | 'SaaS' | 'POS' | 'Education' | 'Finance' | 'Business' | 'Other';
export type ProjectStatus = 'Completed' | 'In Development' | 'Maintenance' | 'Archived';

export interface Project {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  description: string;
  long_description: string;
  category: ProjectCategory;
  technologies: string[];
  year: string;
  client?: string;
  project_url?: string;
  github_url?: string;
  status: ProjectStatus;
  is_featured: boolean;
  problem?: string;
  solution?: string;
  features?: string[];
  gallery?: string[];
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type SkillCategory = 'Frontend' | 'Backend' | 'Database' | 'Tools' | 'AI & Vibe Coding';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  icon?: string;
  level: SkillLevel;
  percentage: number;
  sort_order?: number;
  status?: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  credential_url?: string;
  credential_id?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export type CVTemplateType = 'ats_classic' | 'ats_modern' | 'professional_minimal' | 'developer_cv';

export interface CVExperience {
  id: string;
  position: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  responsibilities?: string[];
}

export interface CVEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_year: string;
  end_year: string;
  description: string;
}

export interface CVSkill {
  id: string;
  skill: string;
  level?: string;
  category?: string;
}

export interface CVProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  project_url?: string;
}

export interface CVCertification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface CVLanguage {
  id: string;
  language: string;
  level: string; // e.g. "Native / Fasih", "Professional Working"
}

export interface CV {
  id: string;
  name: string;
  title?: string;
  professional_title: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  photo?: string;
  template: CVTemplateType;
  is_active: boolean;
  experiences: CVExperience[];
  educations: CVEducation[];
  skills: CVSkill[];
  projects: CVProject[];
  certifications: CVCertification[];
  languages: CVLanguage[];
  created_at?: string;
  updated_at?: string;
}

export interface Settings {
  site_title?: string;
  site_description?: string;
  primary_color?: string;
  allow_cv_download?: boolean;
  show_hire_badge?: boolean;
  general?: {
    portfolio_name: string;
    website_title: string;
    description: string;
    logo?: string;
    favicon?: string;
  };
  social?: {
    github: string;
    linkedin: string;
    instagram: string;
    facebook?: string;
    youtube?: string;
    whatsapp: string;
    email: string;
    website: string;
  };
  seo?: {
    meta_title: string;
    meta_description: string;
    og_image?: string;
  };
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'unread' | 'read';
  created_at: string;
}

export interface AnalyticsData {
  views_count: number;
  downloads_count: number;
  last_updated?: string;
}

export interface PortfolioData {
  user: User;
  profile: Profile;
  educations: Education[];
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
  certifications: Certification[];
  cvs: CV[];
  settings: Settings;
  messages?: ContactMessage[];
  analytics?: AnalyticsData;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}
