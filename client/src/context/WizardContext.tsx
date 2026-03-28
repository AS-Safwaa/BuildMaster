import React, { createContext, useContext, useState } from 'react';

// Form Data Interface based on 16 sections
interface WizardData {
  leadSource: 'self' | 'referral' | '';
  referrerName: string;
  referrerCompany: string;
  referrerEmail: string;
  // Phase 1
  businessName: string;
  establishmentYear: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  domainConfig: string;
  hostingConfig: string;
  // Phase 2
  category: string;
  services: string[];
  usps: string[];
  // Phase 3
  taglineStyle: string;
  taglineCustom: string;
  // Phase 4
  logoPreference: string;
  websiteStyle: string;
  // Phase 5
  hasPhotos: boolean;
  socialLinks: Record<string, string>;
  competitors: string[];
}

const defaultData: WizardData = {
  leadSource: '',
  referrerName: '', referrerCompany: '', referrerEmail: '',
  businessName: '', establishmentYear: '', contactName: '', phone: '', email: '', address: '', domainConfig: '', hostingConfig: '',
  category: '', services: [], usps: [],
  taglineStyle: '', taglineCustom: '',
  logoPreference: '', websiteStyle: 'Minimal',
  hasPhotos: false, socialLinks: {}, competitors: []
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
