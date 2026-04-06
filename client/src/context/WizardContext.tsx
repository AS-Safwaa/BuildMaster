import React, { createContext, useContext, useState } from 'react';

// Form Data Interface based on Netlify App reference
interface WizardData {
  // Phase 0: Project Type
  projectType: 'Logo Design' | 'Website' | 'Website + Logo' | '';
  projectFor: 'self' | 'friend' | '';
  
  // Phase 1: Business Details
  businessName: string;
  establishmentYear: string;
  contactName: string;
  phone: string;
  email: string;
  displayContactOnSite: boolean;
  addressLine1: string;
  addressLine2: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  serviceAreas: string;

  // Phase 2: Logo Details
  logoStatus: 'none' | 'improve' | 'have' | '';
  brandPersonality: string[];
  designStyle: string;
  logoInspirations: string[];
  logoUsage: string[];
  logoStylePreference: string;
  preferredColors: string[];
  avoidColors: string[];
  symbolIdea: 'yes' | 'no' | 'suggest' | '';

  // Phase 3: Domain and Hosting
  hasDomain: boolean | null;
  preferredDomain: string;
  hasHosting: boolean | null;
  contactFormToggle: boolean;
  enquiryEmail: string;
  callNowToggle: boolean;
  whatsappToggle: boolean;

  // Phase 4: Business Type and Offerings
  mainCategory: string;
  subCategory: string;
  specialisation: string;

  // Phase 5: Goals and Brand Direction
  websiteGoals: string[];
  userAction: string;
  taglineStatus: 'yes' | 'no' | 'help' | '';
  taglineCustom: string;
  usps: string[];
  preferredTone: string;
  websiteStyle: string;

  // Phase 6: Content and Trust Elements
  businessPhotosStatus: boolean;
  driveLink: string;
  genericImagesToggle: boolean;
  productPhotosDelivery: string;
  teamMembersToggle: boolean;
  testimonialsToggle: boolean;
  socialMediaToggle: boolean;
  socialLinks: Record<string, string>;
  heroImagePreference: string;

  // Phase 7: References and Add-ons
  competitorWebsites: string[];
  inspirationWebsites: string[];
  addons: string[];
  customFeatures: string[];
  customGoals: string[];
  customActions: string[];
  
  // Legacy/Internal
  leadSource: 'self' | 'referral' | '';
  referrerName: string;
  referrerCompany: string;
  referrerEmail: string;
}

const defaultData: WizardData = {
  projectType: '',
  projectFor: '',
  businessName: '',
  establishmentYear: '',
  contactName: '',
  phone: '',
  email: '',
  displayContactOnSite: false,
  addressLine1: '', addressLine2: '', area: '', city: '', state: '', pincode: '',
  serviceAreas: '',
  logoStatus: '',
  brandPersonality: [],
  designStyle: '',
  logoInspirations: [],
  logoUsage: [],
  logoStylePreference: '',
  preferredColors: [],
  avoidColors: [],
  symbolIdea: '',
  hasDomain: null,
  preferredDomain: '',
  hasHosting: null,
  contactFormToggle: true,
  enquiryEmail: '',
  callNowToggle: false,
  whatsappToggle: false,
  mainCategory: '',
  subCategory: '',
  specialisation: '',
  websiteGoals: [],
  userAction: '',
  taglineStatus: '',
  taglineCustom: '',
  usps: [],
  preferredTone: '',
  websiteStyle: 'Minimal',
  businessPhotosStatus: false,
  driveLink: '',
  genericImagesToggle: false,
  productPhotosDelivery: '',
  teamMembersToggle: false,
  testimonialsToggle: false,
  socialMediaToggle: false,
  socialLinks: {},
  heroImagePreference: '',
  competitorWebsites: [],
  inspirationWebsites: [],
  addons: [],
  customFeatures: [],
  customGoals: [],
  customActions: [],
  leadSource: '',
  referrerName: '', referrerCompany: '', referrerEmail: '',
};

interface WizardContextType {
  data: WizardData;
  updateData: (fields: Partial<WizardData>) => void;
  currentPhase: number;
  setPhase: (phase: number) => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<WizardData>(defaultData);
  const [currentPhase, setCurrentPhase] = useState(1);

  const updateData = (fields: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  return (
    <WizardContext.Provider value={{ data, updateData, currentPhase, setPhase: setCurrentPhase }}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardProvider");
  return ctx;
};
