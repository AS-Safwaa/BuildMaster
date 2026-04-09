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
  callNowNumber: string;
  whatsappToggle: boolean;
  whatsappNumber: string;

  // Phase 4: Business Type and Offerings
  mainCategory: string;
  subCategory: string;
  specialisation: string;
  products: string[];
  services: string[];

  // Phase 5: Goals and Brand Direction
  websiteGoals: string[];
  userAction: string;
  taglineStatus: 'yes' | 'no' | 'help' | '';
  taglineCustom: string;
  usps: string[];
  preferredTone: string;
  websiteStyle: string;
  referenceLinks: string[];

  // Logo Enhanced Info (Optional Enhancement)
  tagline: string;
  brandMission: string;
  targetMarket: string;
  audience: string;
  b2bOrB2c: string;
  logoType: string;
  typographyPreference: string;
  competitors: string;
  usageContext: string;
  fileFormats: string[];
  scalabilityNeeds: string;

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
  callNowNumber: '',
  whatsappToggle: false,
  whatsappNumber: '',
  mainCategory: '',
  subCategory: '',
  specialisation: '',
  products: [],
  services: [],
  websiteGoals: [],
  userAction: '',
  taglineStatus: '',
  taglineCustom: '',
  usps: [],
  preferredTone: '',
  websiteStyle: 'Minimal',
  referenceLinks: [],
  tagline: '',
  brandMission: '',
  targetMarket: 'Local',
  audience: '',
  b2bOrB2c: 'B2C',
  logoType: '',
  typographyPreference: '',
  competitors: '',
  usageContext: '',
  fileFormats: [],
  scalabilityNeeds: '',
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

interface WizardPhase {
  id: number;
  title: string;
  desc: string;
}

const ALL_PHASES: WizardPhase[] = [
  { id: 1, title: 'Project Type', desc: 'Selection' },
  { id: 2, title: 'Business Profile', desc: 'Contact & Details' },
  { id: 3, title: 'Logo & Brand', desc: 'Design personality' },
  { id: 4, title: 'Technical Setup', desc: 'Domain & Hosting' },
  { id: 5, title: 'Offerings', desc: 'Categories' },
  { id: 6, title: 'Strategy', desc: 'Goals & USP' },
  { id: 7, title: 'Media & Social', desc: 'Trust elements' },
  { id: 9, title: 'Review', desc: 'Final check' }
];

interface WizardContextType {
  data: WizardData;
  updateData: (fields: Partial<WizardData>) => void;
  currentPhase: number;
  setPhase: (phase: number) => void;
  phases: WizardPhase[];
  goToNext: () => void;
  goToPrev: () => void;
  getStepNumber: (id: number) => number;
  getNextPhaseTitle: () => string | null;
  autofill: (type: 'Logo Design' | 'Website' | 'Website + Logo') => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<WizardData>(defaultData);
  const [currentPhase, setCurrentPhase] = useState(1);

  const getVisiblePhases = () => {
    return ALL_PHASES.filter(p => {
      // Logic for skipping
      if (data.projectType === 'Logo Design') {
        // Skip Technical, Offerings, Media & Social
        if ([4, 5, 7].includes(p.id)) return false;
      }
      if (data.projectType === 'Website') {
        // Skip Logo & Brand (Step 3)
        if (p.id === 3) return false;
      }
      return true;
    });
  };

  const visiblePhases = getVisiblePhases();

  const getStepNumber = (id: number) => {
    return visiblePhases.findIndex(p => p.id === id) + 1;
  };

  const goToNext = () => {
    const currentIndex = visiblePhases.findIndex(p => p.id === currentPhase);
    if (currentIndex < visiblePhases.length - 1) {
      setCurrentPhase(visiblePhases[currentIndex + 1].id);
    }
  };

  const goToPrev = () => {
    const currentIndex = visiblePhases.findIndex(p => p.id === currentPhase);
    if (currentIndex > 0) {
      setCurrentPhase(visiblePhases[currentIndex - 1].id);
    }
  };

  const getNextPhaseTitle = () => {
    const currentIndex = visiblePhases.findIndex(p => p.id === currentPhase);
    if (currentIndex !== -1 && currentIndex < visiblePhases.length - 1) {
      return visiblePhases[currentIndex + 1].title;
    }
    return null;
  };

  const updateData = (fields: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const autofill = (type: 'Logo Design' | 'Website' | 'Website + Logo') => {
    const dummyData: Partial<WizardData> = {
      projectType: type,
      projectFor: 'self',
      businessName: 'SR FoodKraft',
      establishmentYear: '2020',
      contactName: 'Rahul Sharma',
      phone: '9876543210',
      email: 'rahul@foodkraft.com',
      serviceAreas: 'Mumbai, Pune',
      addressLine1: 'Plot 42, Sector 15',
      addressLine2: 'Koparkhairane',
      area: 'Navi Mumbai',
      city: 'Navi Mumbai',
      state: 'Maharashtra',
      pincode: '400709',
    };

    if (type !== 'Website') {
      dummyData.logoStatus = 'none';
      dummyData.brandPersonality = ['Professional', 'Modern', 'Simple'];
      dummyData.designStyle = 'Clean & Simple';
      dummyData.preferredColors = ['#3B82F6', '#111827'];
    }

    if (type !== 'Logo Design') {
      dummyData.mainCategory = 'Food & Beverage';
      dummyData.subCategory = 'Cloud Kitchen';
      dummyData.specialisation = 'Authentic Indian Cuisine';
      dummyData.websiteGoals = ['Brand awareness', 'Contact form leads'];
      dummyData.userAction = 'Contact Us';
      dummyData.websiteStyle = 'Minimal';
      dummyData.hasDomain = false;
      dummyData.preferredDomain = 'srfoodkraft.com';
      dummyData.hasHosting = false;
      dummyData.contactFormToggle = true;
      dummyData.whatsappToggle = true;
    }

    setData(prev => ({ ...prev, ...dummyData }));
    setCurrentPhase(9); // Jump to Review for rapid filling
  };

  return (
    <WizardContext.Provider value={{ 
      data, updateData, currentPhase, setPhase: setCurrentPhase,
      phases: visiblePhases, goToNext, goToPrev, getStepNumber, getNextPhaseTitle, autofill
    }}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardProvider");
  return ctx;
};
