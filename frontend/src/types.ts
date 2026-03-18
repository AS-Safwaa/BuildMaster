export interface Specialisation {
  id: string;
  name: string;
  services: string[];
  usp: string[];
}

export interface SubCategory {
  id: string;
  name: string;
  specialisations: Specialisation[];
}

export interface MainCategory {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

export interface BusinessHours {
  open: boolean;
  from: string;
  to: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  linkedIn: string;
}

export interface Testimonial {
  name: string;
  role: string;
  review: string;
  rating: number;
}

export interface WebsiteStyle {
  id: string;
  name: string;
  description: string;
  sample: string;
}

export interface MasterConfig {
  mainCategories: MainCategory[];
  navigationOptions: string[];
  websiteStyles: WebsiteStyle[];
  websiteGoals: string[];
  maxGoalSelection: number;
  ctaOptions: string[];
  brandPersonalities: string[];
  testimonialOptions: { id: string; label: string; icon: string }[];
  socialPlatforms: string[];
}

export type ProjectStatus = 'Submitted' | 'In Development' | 'In Review' | 'Under Client Review' | 'Approved' | 'Completed';

export interface BuildChecklist {
  contentGenerated: boolean;
  logoCreated: boolean;
  mobileTested: boolean;
  linksVerified: boolean;
  contactFormTested: boolean;
  ctaWorking: boolean;
  imagesOptimized: boolean;
  metaTagsAdded: boolean;
}

export interface Developer {
  id: string;
  name: string;
  email: string;
}

export interface LogoPreferences {
  brandPersonality: string[];
  logoStylePreference: string;
  preferredColors: string[];
  colorsToAvoid: string;
  symbolIdea: string;
  designStyleDirection: string[];
  inspirationLinks: string[];
  logoUsageLocations: string[];
  additionalNotes: string;
}

export interface OnboardingData {
  type: 'self' | 'referral';
  referrer: string;
  customerInfo: string;
}

export interface Project {
  id: string;
  businessName: string;
  yearsOfEstablishment: string;
  businessPhone: string;
  contactPersonName: string;
  contactPersonPhone: string;
  email: string;
  address: string;
  serviceAreas: string;
  mainCategoryId: string;
  subCategoryId: string;
  specialisationId: string;
  services: string[];
  usp: string[];
  websiteGoals: string[];
  selectedStyleId: string;
  ctaSelections: string[];
  hasLogo: boolean;
  logoDriveLink: string;
  logoPreferences: LogoPreferences;
  wantsBusinessPhotos: boolean;
  businessPhotosDriveLink: string;
  wantsTeamPhotos: boolean;
  teamPhotosDriveLink: string;
  showTeam: boolean;
  showSocial: boolean;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    twitter?: string;
    other?: string;
  };
  testimonialOption: 'not-required' | 'existing' | 'generate';
  team: TeamMember[];
  testimonials: Testimonial[];
  competitors: string[];
  inspirations: string[];
  tagline?: string;
  // Domain & Hosting
  hasDomain: 'yes' | 'no' | 'not-sure';
  domainHostingDetails?: string;
  // Navigation
  selectedNavigation: string[];
  // Onboarding
  onboarding?: OnboardingData;
  // Workflow fields
  status: ProjectStatus;
  assignedDeveloperId?: string;
  draftLink?: string;
  liveUrl?: string;
  developerNotes?: string;
  checklist: BuildChecklist;
  builderUsed?: string;
  builderOther?: string;
  logoToolUsed?: string;
  logoToolOther?: string;
}
