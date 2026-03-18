import { MasterConfig, Project } from "./types";

export const INITIAL_MASTER_CONFIG: MasterConfig = {
  mainCategories: [
    {
      id: "prof",
      name: "Professionals",
      subCategories: [
        {
          id: "legal",
          name: "Legal",
          specialisations: [
            {
              id: "corp-law",
              name: "Corporate Lawyer",
              services: ["Company Registration", "Contract Drafting", "Legal Audits", "Mergers & Acquisitions"],
              usp: ["10+ Years Experience", "Confidential Support", "Expert Negotiators"],
            },
            {
              id: "fam-law",
              name: "Family Lawyer",
              services: ["Divorce Proceedings", "Child Custody", "Estate Planning"],
              usp: ["Empathetic Approach", "Proven Track Record"],
            },
            {
              id: "prop-law",
              name: "Property Lawyer",
              services: ["Title Verification", "Sale Deed Drafting", "Litigation Support"],
              usp: ["Fast Processing", "Transparent Fees"],
            }
          ],
        },
        {
          id: "fin",
          name: "Financial Services",
          specialisations: [
            {
              id: "tax-con",
              name: "Tax Consultant",
              services: ["Income Tax Filing", "GST Compliance", "Tax Planning"],
              usp: ["Maximum Refunds", "Audit Support"],
            },
            {
              id: "inv-adv",
              name: "Investment Advisor",
              services: ["Portfolio Management", "Retirement Planning", "Mutual Funds"],
              usp: ["Data-Driven Advice", "Personalized Portfolios"],
            }
          ],
        }
      ],
    },
    {
      id: "health",
      name: "Healthcare",
      subCategories: [
        {
          id: "clinic",
          name: "Clinics",
          specialisations: [
            {
              id: "cardio",
              name: "Cardiology Clinic",
              services: ["Heart Consultation", "ECG Testing", "Stress Test", "Echocardiography"],
              usp: ["Advanced Diagnostic Equipment", "Emergency Support", "Top-Rated Cardiologists"],
            },
            {
              id: "dental",
              name: "Dental Clinic",
              services: ["Teeth Cleaning", "Root Canal Treatment", "Dental Implants", "Teeth Whitening", "Braces & Aligners"],
              usp: ["Pain-Free Procedures", "Latest Dental Tech", "Sterilized Environment"],
            },
            {
              id: "physio",
              name: "Physiotherapy Center",
              services: ["Sports Injury Rehab", "Post-Surgery Recovery", "Back Pain Management"],
              usp: ["Certified Therapists", "Home Visit Available"],
            }
          ],
        }
      ],
    },
    {
      id: "edu",
      name: "Education & Coaching",
      subCategories: [
        {
          id: "coaching",
          name: "Coaching & Training",
          specialisations: [
            {
              id: "test-prep",
              name: "Test Prep Center",
              services: ["SAT Coaching", "IELTS Training", "GMAT Prep"],
              usp: ["High Success Rate", "Small Batch Sizes"],
            },
            {
              id: "lang-inst",
              name: "Language Institute",
              services: ["English Speaking", "French Classes", "German for Beginners"],
              usp: ["Native Speakers", "Interactive Learning"],
            }
          ],
        }
      ],
    },
    {
      id: "food",
      name: "Restaurants & Cafes",
      subCategories: [
        {
          id: "dining",
          name: "Dining",
          specialisations: [
            {
              id: "fine-dine",
              name: "Fine Dining",
              services: ["Dine-in Service", "Private Dining", "Wine Pairing"],
              usp: ["Exquisite Ambience", "Award-Winning Chefs"],
            },
            {
              id: "cafe",
              name: "Cafe",
              services: ["Specialty Coffee", "All-Day Breakfast", "Free Wi-Fi"],
              usp: ["Cozy Atmosphere", "Freshly Roasted Beans"],
            },
            {
              id: "bakery",
              name: "Bakery",
              services: ["Custom Cakes", "Fresh Bread", "Pastries"],
              usp: ["Baked Daily", "Organic Ingredients"],
            }
          ],
        }
      ],
    },
    {
      id: "retail",
      name: "Retail Shops",
      subCategories: [
        {
          id: "fashion",
          name: "Fashion & Lifestyle",
          specialisations: [
            {
              id: "clothing",
              name: "Clothing Store",
              services: ["Men's Fashion", "Women's Wear", "Custom Tailoring"],
              usp: ["Premium Fabric", "Latest Trends", "Affordable Pricing"],
            },
            {
              id: "pharmacy",
              name: "Pharmacy",
              services: ["Prescription Medicines", "Health Supplements", "Home Delivery"],
              usp: ["Authentic Medicines", "24/7 Availability"],
            }
          ],
        }
      ],
    },
    {
      id: "beauty",
      name: "Beauty & Wellness",
      subCategories: [
        {
          id: "salon-spa",
          name: "Salon & Spa",
          specialisations: [
            {
              id: "unisex-salon",
              name: "Unisex Salon",
              services: ["Haircut & Styling", "Hair Coloring", "Facial Treatment", "Bridal Makeup", "Manicure & Pedicure"],
              usp: ["Certified Stylists", "Premium Products", "Bridal Packages"],
            }
          ],
        }
      ],
    },
    {
      id: "home",
      name: "Home Services",
      subCategories: [
        {
          id: "maintenance",
          name: "Maintenance",
          specialisations: [
            {
              id: "interior",
              name: "Interior Designer",
              services: ["Residential Design", "Commercial Interiors", "3D Visualisation"],
              usp: ["Space Optimization", "Modern Aesthetics"],
            },
            {
              id: "electrician",
              name: "Electrician",
              services: ["Wiring Installation", "Appliance Repair", "Fault Finding"],
              usp: ["Licensed Professionals", "Emergency Service"],
            }
          ],
        }
      ],
    }
  ],
  navigationOptions: [
    "Home", "About Us", "Services", "Products", "Portfolio", "Our Team", "Testimonials", "FAQ", "Contact Us",
  ],
  websiteStyles: [
    {
      id: "s1",
      name: "Clean & Minimal",
      description: "Whitespace-first, simple typography",
      sample: "https://stripe.com",
    },
    {
      id: "s2",
      name: "Image-Heavy",
      description: "Large hero visuals",
      sample: "https://www.apple.com",
    },
    {
      id: "s3",
      name: "Bold Headline",
      description: "Strong headline + CTA above the fold",
      sample: "https://www.spotify.com",
    },
  ],
  websiteGoals: [
    "Generate Phone Calls", "Get Customer Enquiries", "Showcase Services", "Build Brand Trust", "Sell Products", "Online Appointment Booking", "Display Portfolio", "Provide Business Information"
  ],
  maxGoalSelection: 3,
  ctaOptions: ["Call Now", "Book Appointment", "Get Quote", "WhatsApp Us", "Order Now", "Visit Our Store", "Explore Services", "Contact Us", "Schedule Consultation"],
  brandPersonalities: ["Professional", "Friendly", "Modern", "Luxury", "Minimalist", "Bold", "Playful", "Reliable"],
  testimonialOptions: [
    { id: 'not-required', label: 'Not Required', icon: '✕' },
    { id: 'existing', label: 'I Have Some', icon: '✓' },
    { id: 'generate', label: 'Generate Sample', icon: '🛠️' }
  ],
  socialPlatforms: ["Facebook", "Instagram", "LinkedIn", "YouTube", "Twitter", "TikTok", "Pinterest"],
};

export const DEFAULT_CHECKLIST = {
  contentGenerated: false,
  logoCreated: false,
  mobileTested: false,
  linksVerified: false,
  contactFormTested: false,
  ctaWorking: false,
  imagesOptimized: false,
  metaTagsAdded: false,
  hostingSetup: false,
};

export const DEFAULT_LOGO_PREFERENCES = {
  brandPersonality: [],
  logoStylePreference: "",
  preferredColors: [],
  colorsToAvoid: "",
  symbolIdea: "",
  designStyleDirection: [],
  inspirationLinks: [],
  logoUsageLocations: [],
  additionalNotes: ""
};

export const DEVELOPERS = [
  { id: 'dev1', name: 'Alex Chen', email: 'alex@agency.com' },
  { id: 'dev2', name: 'Sarah Miller', email: 'sarah@agency.com' },
  { id: 'dev3', name: 'Mike Ross', email: 'mike@agency.com' },
];

export const EMPTY_PROJECT: Project = {
  id: "TEMP-" + Date.now(),
  businessName: "",
  yearsOfEstablishment: "",
  businessPhone: "",
  contactPersonName: "",
  contactPersonPhone: "",
  email: "",
  address: "",
  serviceAreas: "",
  mainCategoryId: "",
  subCategoryId: "",
  specialisationId: "",
  services: [],
  usp: [],
  websiteGoals: [],
  selectedStyleId: "s1",
  ctaSelections: [],
  hasLogo: false,
  logoDriveLink: "",
  logoPreferences: { ...DEFAULT_LOGO_PREFERENCES },
  wantsBusinessPhotos: false,
  businessPhotosDriveLink: "",
  wantsTeamPhotos: false,
  teamPhotosDriveLink: "",
  showTeam: false,
  showSocial: false,
  socialLinks: {
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: ""
  },
  testimonialOption: 'not-required',
  team: [],
  testimonials: [],
  competitors: [],
  inspirations: [],
  tagline: "",
  // Domain & Hosting
  hasDomain: 'not-sure',
  domainHostingDetails: "",
  // Navigation
  selectedNavigation: [],
  // Workflow fields
  status: 'Submitted',
  checklist: { ...DEFAULT_CHECKLIST },
};

export const MOCK_PROJECT: Project = {
  ...EMPTY_PROJECT,
  id: "PRJ-2026-001",
  businessName: "HeartCare Advanced Clinic",
  yearsOfEstablishment: "2012",
  businessPhone: "+91 98765 43210",
  contactPersonName: "Dr. Arjun Mehta",
  contactPersonPhone: "+91 99887 77665",
  email: "info@heartcareclinic.com",
  address: "123 Health Avenue, Chennai",
  serviceAreas: "Chennai & Nearby",
  mainCategoryId: "health",
  subCategoryId: "clinic",
  specialisationId: "cardio",
  services: ["Heart Consultation", "ECG Testing"],
  usp: ["15+ Years Experience", "Advanced Diagnostic Equipment"],
  websiteGoals: ["Generate Phone Calls"],
  ctaSelections: ["Call Now"],
  hasLogo: true,
  status: 'Submitted',
};

export const MOCK_PROJECTS: Project[] = [
  MOCK_PROJECT,
  {
    ...MOCK_PROJECT,
    id: "PRJ-2026-002",
    businessName: "Glow & Grace Salon",
    mainCategoryId: "beauty",
    subCategoryId: "salon-spa",
    specialisationId: "unisex-salon",
    services: ["Haircut", "Facials", "Bridal Makeup"],
    usp: ["Certified Stylists", "Bridal Packages"],
    websiteGoals: ["Showcase Services", "Online Appointment Booking"],
    status: 'Submitted',
  },
  {
    ...MOCK_PROJECT,
    id: "PRJ-2026-003",
    businessName: "Urban Threads Retail",
    mainCategoryId: "retail",
    subCategoryId: "fashion",
    specialisationId: "clothing",
    services: ["Formal Wear", "Custom Tailoring"],
    usp: ["Premium Fabric", "Affordable Pricing"],
    websiteGoals: ["Provide Business Information", "Get Customer Enquiries"],
    status: 'Submitted',
  }
];
