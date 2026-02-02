// task-generator.ts
export interface Task {
  id: number;
  label: string;
  name: string;
  description: string;
  points: number;
  urgency: number;
  dependencies: number[];
  parentId: number | null;
  completed: boolean;
  category: string;
  actionType?: 'dialog' | 'navigation' | 'external';
  dialogConfig?: {
    title: string;
    fields: Array<{
      name: string;
      label: string;
      type: 'text' | 'number' | 'email' | 'select' | 'textarea';
      required: boolean;
      options?: string[];
    }>;
    submitLabel: string;
  };
  tooltip?: string;
  route?: string;
}

const INITIAL_TASKS_SKILLS = [
  {
    name: "Choose Your Fund Type",
    description: "Select between SFR, Commercial, or Specialty fund types",
    actionType: 'navigation' as const,
    route: '/fund-selection',
    tooltip: "Navigate to fund selection to choose your fund type"
  },
  {
    name: "Understanding Fund Categories",
    description: "Explore the three main fund categories and their requirements",
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Fund Categories Overview",
      fields: [
        { name: 'primaryFocus', label: 'Which fund type interests you most?', type: 'select' as const, required: true, options: ['SFR (Single Family Rental)', 'Commercial Office/Retail', 'Specialty/Niche Assets'] },
        { name: 'experience', label: 'Your real estate experience level', type: 'select' as const, required: true, options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] },
        { name: 'timeline', label: 'Preferred fund launch timeline', type: 'select' as const, required: true, options: ['3-6 months', '6-12 months', '12+ months'] }
      ],
      submitLabel: "Continue to Fund Setup"
    }
  },
  {
    name: "Task Dependencies",
    description: "Complete tasks in order - each task unlocks the next",
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Task Dependencies & Workflow",
      fields: [
        { name: 'workflow', label: 'How would you prefer to work through tasks?', type: 'select' as const, required: true, options: ['Sequential (one at a time)', 'Parallel (multiple at once)', 'Flexible (as needed)'] },
        { name: 'reminders', label: 'Would you like task completion reminders?', type: 'select' as const, required: true, options: ['Yes, email reminders', 'Yes, in-app notifications', 'No reminders needed'] },
        { name: 'collaboration', label: 'Will others be collaborating on this fund?', type: 'select' as const, required: true, options: ['Yes, team collaboration', 'No, working solo', 'Maybe later'] }
      ],
      submitLabel: "Set Preferences"
    }
  },
  {
    name: "Basic Fund Information",
    description: "Set up your basic fund profile and contact information",
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Fund Profile Setup",
      fields: [
        { name: 'fundManager', label: 'Fund Manager Name', type: 'text' as const, required: true },
        { name: 'company', label: 'Company/Firm Name', type: 'text' as const, required: true },
        { name: 'email', label: 'Contact Email', type: 'email' as const, required: true },
        { name: 'phone', label: 'Phone Number', type: 'text' as const, required: true },
        { name: 'location', label: 'Primary Location', type: 'text' as const, required: true }
      ],
      submitLabel: "Save Profile"
    }
  },
  {
    name: "Investment Preferences",
    description: "Define your investment philosophy and risk tolerance",
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Investment Preferences",
      fields: [
        { name: 'riskTolerance', label: 'Risk Tolerance', type: 'select' as const, required: true, options: ['Conservative', 'Moderate', 'Aggressive'] },
        { name: 'investmentStyle', label: 'Investment Style', type: 'select' as const, required: true, options: ['Value Investing', 'Growth Investing', 'Income Focused', 'Opportunistic'] },
        { name: 'geographicFocus', label: 'Geographic Focus', type: 'select' as const, required: true, options: ['Local Markets', 'Regional', 'National', 'International'] },
        { name: 'timeHorizon', label: 'Investment Time Horizon', type: 'select' as const, required: true, options: ['1-3 years', '3-7 years', '7-10 years', '10+ years'] }
      ],
      submitLabel: "Set Preferences"
    }
  },
  {
    name: "Platform Readiness Check",
    description: "Confirm you're ready to start building your fund",
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Ready to Launch Your Fund?",
      fields: [
        { name: 'preparedness', label: 'How prepared do you feel to start?', type: 'select' as const, required: true, options: ['Very Prepared', 'Somewhat Prepared', 'Need More Guidance'] },
        { name: 'nextSteps', label: 'What would you like to do first?', type: 'select' as const, required: true, options: ['Start fund setup immediately', 'Explore fund categories more', 'Review platform features'] },
        { name: 'support', label: 'Do you need additional support?', type: 'select' as const, required: true, options: ['Yes, connect me with an advisor', 'Yes, provide more resources', 'No, I\'m ready to proceed'] }
      ],
      submitLabel: "Begin Fund Launch"
    }
  },
];

const SFR_INITIAL_TASKS: Array<{
  name: string;
  description: string;
  actionType?: 'dialog' | 'navigation' | 'external';
  dialogConfig?: any;
  tooltip?: string;
  route?: string;
  dependencies?: number[];
}> = [
  {
    name: "SFR Fund Setup",
    description: "Configure your Single-Family Rental fund parameters",
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "SFR Fund Configuration",
      fields: [
        { name: 'targetProperties', label: 'Target Number of Properties', type: 'number' as const, required: true },
        { name: 'targetMarkets', label: 'Target Markets', type: 'textarea' as const, required: true },
        { name: 'propertyTypes', label: 'Property Types', type: 'select' as const, required: true, options: ['Single Family Homes', 'Townhouses', 'Condos', 'All Types'] },
        { name: 'acquisitionStrategy', label: 'Acquisition Strategy', type: 'select' as const, required: true, options: ['Wholesale', 'Retail', 'REO', 'Off-Market'] }
      ],
      submitLabel: "Configure SFR Fund"
    }
  },
  {
    name: "SFR Investment Criteria",
    description: "Define your SFR investment criteria and underwriting standards",
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "SFR Investment Criteria",
      fields: [
        { name: 'priceRange', label: 'Property Price Range ($)', type: 'text' as const, required: true },
        { name: 'capRate', label: 'Target Cap Rate Range', type: 'text' as const, required: true },
        { name: 'cashOnCash', label: 'Target Cash-on-Cash Return', type: 'text' as const, required: true },
        { name: 'maxLeverage', label: 'Maximum Leverage Ratio', type: 'select' as const, required: true, options: ['60%', '70%', '75%', '80%'] }
      ],
      submitLabel: "Set Investment Criteria"
    }
  }
];

const COMMERCIAL_INITIAL_TASKS: Array<{
  name: string;
  description: string;
  actionType?: 'dialog' | 'navigation' | 'external';
  dialogConfig?: any;
  tooltip?: string;
  route?: string;
  dependencies?: number[];
}> = [
  {
    name: "Commercial Fund Setup",
    description: "Configure your Commercial Office/Retail fund parameters",
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Commercial Fund Configuration",
      fields: [
        { name: 'propertyTypes', label: 'Property Types of Interest', type: 'select' as const, required: true, options: ['Office Buildings', 'Retail Centers', 'Industrial', 'Mixed-Use', 'All Types'] },
        { name: 'targetMarkets', label: 'Target Markets', type: 'textarea' as const, required: true },
        { name: 'leaseTerms', label: 'Preferred Lease Terms', type: 'select' as const, required: true, options: ['5+ years', '7+ years', '10+ years', 'Flexible'] },
        { name: 'tenantQuality', label: 'Target Tenant Quality', type: 'select' as const, required: true, options: ['Investment Grade', 'Regional Credit', 'Local Credit', 'Mixed'] }
      ],
      submitLabel: "Configure Commercial Fund"
    }
  },
  {
    name: "Commercial Investment Criteria",
    description: "Define your commercial investment criteria and underwriting standards",
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Commercial Investment Criteria",
      fields: [
        { name: 'propertySize', label: 'Property Size Range (SF)', type: 'text' as const, required: true },
        { name: 'capRate', label: 'Target Cap Rate Range', type: 'text' as const, required: true },
        { name: 'noiGrowth', label: 'Expected NOI Growth', type: 'select' as const, required: true, options: ['Stable', 'Moderate Growth', 'High Growth'] },
        { name: 'maxLeverage', label: 'Maximum Leverage Ratio', type: 'select' as const, required: true, options: ['60%', '65%', '70%', '75%'] }
      ],
      submitLabel: "Set Investment Criteria"
    }
  }
];

const SPECIALTY_INITIAL_TASKS: Array<{
  name: string;
  description: string;
  actionType?: 'dialog' | 'navigation' | 'external';
  dialogConfig?: any;
  tooltip?: string;
  route?: string;
  dependencies?: number[];
}> = [
  {
    name: "Specialty Fund Setup",
    description: "Configure your Specialty/Niche Asset fund parameters",
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Specialty Fund Configuration",
      fields: [
        { name: 'nicheFocus', label: 'Niche Asset Focus', type: 'select' as const, required: true, options: ['Self-Storage', 'Mobile Home Parks', 'Data Centers', 'Healthcare', 'Senior Living', 'Student Housing', 'Other'] },
        { name: 'targetMarkets', label: 'Target Markets', type: 'textarea' as const, required: true },
        { name: 'assetStrategy', label: 'Asset Strategy', type: 'select' as const, required: true, options: ['Core', 'Value-Add', 'Development', 'Opportunistic'] },
        { name: 'marketPosition', label: 'Market Position', type: 'select' as const, required: true, options: ['First Mover', 'Fast Follower', 'Established Player'] }
      ],
      submitLabel: "Configure Specialty Fund"
    }
  },
  {
    name: "Specialty Investment Criteria",
    description: "Define your specialty investment criteria and underwriting standards",
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Specialty Investment Criteria",
      fields: [
        { name: 'assetSize', label: 'Asset Size Range', type: 'text' as const, required: true },
        { name: 'riskProfile', label: 'Risk Profile', type: 'select' as const, required: true, options: ['Low Risk', 'Moderate Risk', 'High Risk'] },
        { name: 'growthPotential', label: 'Growth Potential', type: 'select' as const, required: true, options: ['Stable Cash Flow', 'Moderate Growth', 'High Growth'] },
        { name: 'exitStrategy', label: 'Preferred Exit Strategy', type: 'select' as const, required: true, options: ['Hold Long-Term', '5-7 Year Hold', '3-5 Year Hold', 'Opportunistic'] }
      ],
      submitLabel: "Set Investment Criteria"
    }
  }
];

const SFR_FUND_SKILLS: Array<{
  name: string;
  description: string;
  actionType?: 'dialog' | 'navigation' | 'external';
  dialogConfig?: any;
  tooltip?: string;
  route?: string;
  dependencies?: number[];
}> = [
  {
    name: "Market Analysis Setup",
    description: "Configure your target markets and investment criteria",
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Market Analysis Configuration",
      fields: [
        { name: 'targetMarkets', label: 'Target Markets', type: 'select' as const, required: true, options: ['Primary MSA', 'Secondary MSA', 'Tertiary MSA'] },
        { name: 'minCapRate', label: 'Minimum Cap Rate (%)', type: 'number' as const, required: true },
        { name: 'maxPrice', label: 'Maximum Property Price ($)', type: 'number' as const, required: true },
        { name: 'propertyTypes', label: 'Property Types', type: 'select' as const, required: true, options: ['Single Family', 'Duplex', 'Triplex', 'Fourplex'] }
      ],
      submitLabel: "Save Configuration"
    },
    tooltip: "Set up your market analysis parameters"
  },
  {
    name: "Property Acquisition Criteria",
    description: "Define specific property acquisition standards",
    dependencies: [103],
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Acquisition Criteria",
      fields: [
        { name: 'yearBuilt', label: 'Minimum Year Built', type: 'number' as const, required: true },
        { name: 'sqftMin', label: 'Minimum Square Footage', type: 'number' as const, required: true },
        { name: 'bedrooms', label: 'Minimum Bedrooms', type: 'number' as const, required: true },
        { name: 'bathrooms', label: 'Minimum Bathrooms', type: 'number' as const, required: true }
      ],
      submitLabel: "Set Criteria"
    }
  },
  {
    name: "Financial Modeling Setup",
    description: "Configure financial projections and underwriting models",
    dependencies: [104],
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Financial Model Setup",
      fields: [
        { name: 'holdPeriod', label: 'Hold Period (Years)', type: 'number' as const, required: true },
        { name: 'exitCapRate', label: 'Exit Cap Rate (%)', type: 'number' as const, required: true },
        { name: 'loanToValue', label: 'Loan-to-Value Ratio (%)', type: 'number' as const, required: true },
        { name: 'interestRate', label: 'Interest Rate (%)', type: 'number' as const, required: true }
      ],
      submitLabel: "Configure Model"
    }
  },
  {
    name: "Legal Entity Formation",
    description: "Set up the legal structure for your fund",
    dependencies: [105],
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Legal Entity Setup",
      fields: [
        { name: 'entityName', label: 'Entity Name', type: 'text' as const, required: true },
        { name: 'entityType', label: 'Entity Type', type: 'select' as const, required: true, options: ['LLC', 'LP', 'Corporation'] },
        { name: 'state', label: 'State of Formation', type: 'text' as const, required: true },
        { name: 'ein', label: 'EIN Number', type: 'text' as const, required: true }
      ],
      submitLabel: "Form Entity"
    }
  },
  {
    name: "Investor Accreditation",
    description: "Set up investor qualification and accreditation process",
    dependencies: [106],
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Investor Accreditation Setup",
      fields: [
        { name: 'minInvestment', label: 'Minimum Investment ($)', type: 'number' as const, required: true },
        { name: 'maxInvestors', label: 'Maximum Investors', type: 'number' as const, required: true },
        { name: 'qualification', label: 'Qualification Method', type: 'select' as const, required: true, options: ['Self-Certification', 'Third-Party Verification'] }
      ],
      submitLabel: "Configure Accreditation"
    }
  },
  {
    name: "Property Management Setup",
    description: "Configure property management and operations",
    dependencies: [107],
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Property Management Configuration",
      fields: [
        { name: 'managementFee', label: 'Management Fee (%)', type: 'number' as const, required: true },
        { name: 'leasingFee', label: 'Leasing Fee (%)', type: 'number' as const, required: true },
        { name: 'maintenanceReserve', label: 'Maintenance Reserve (%)', type: 'number' as const, required: true }
      ],
      submitLabel: "Set Management Terms"
    }
  },
  {
    name: "Marketing Materials",
    description: "Create fund marketing and investor presentation materials",
    dependencies: [108],
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Marketing Materials Setup",
      fields: [
        { name: 'fundName', label: 'Fund Name', type: 'text' as const, required: true },
        { name: 'tagline', label: 'Fund Tagline', type: 'text' as const, required: true },
        { name: 'targetRaise', label: 'Target Raise Amount ($)', type: 'number' as const, required: true },
        { name: 'description', label: 'Fund Description', type: 'textarea' as const, required: true }
      ],
      submitLabel: "Create Materials"
    }
  },
  {
    name: "Fund Launch",
    description: "Launch your Single-Family Rental Fund",
    dependencies: [109],
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Fund Launch Confirmation",
      fields: [
        { name: 'launchDate', label: 'Launch Date', type: 'text' as const, required: true },
        { name: 'confirmation', label: 'I confirm all requirements are met', type: 'select' as const, required: true, options: ['Yes', 'No'] }
      ],
      submitLabel: "Launch Fund"
    }
  },
  {
    name: "Legal Entity Setup",
    description: "Establish the legal structure for your fund",
    dependencies: [110],
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Legal Entity Configuration",
      fields: [
        { name: 'entityType', label: 'Entity Type', type: 'select' as const, required: true, options: ['LLC', 'LP', 'Trust', 'Corporation'] },
        { name: 'state', label: 'State of Formation', type: 'text' as const, required: true },
        { name: 'ein', label: 'EIN/Tax ID', type: 'text' as const, required: true },
        { name: 'registeredAgent', label: 'Registered Agent', type: 'text' as const, required: true }
      ],
      submitLabel: "Establish Entity"
    }
  },
  {
    name: "Investor Accreditation",
    description: "Set up investor qualification and accreditation requirements",
    dependencies: [111],
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Investor Accreditation Setup",
      fields: [
        { name: 'accreditation', label: 'Accreditation Required', type: 'select' as const, required: true, options: ['SEC Accredited Only', 'Non-Accredited Allowed', '506(b) Private Placement'] },
        { name: 'minInvestment', label: 'Minimum Investment ($)', type: 'number' as const, required: true },
        { name: 'maxInvestors', label: 'Maximum Number of Investors', type: 'number' as const, required: true },
        { name: 'verification', label: 'Verification Method', type: 'select' as const, required: true, options: ['Self-Certification', 'Third-Party Verification', 'Both'] }
      ],
      submitLabel: "Configure Accreditation"
    }
  },
];

const COMMERCIAL_FUND_SKILLS: Array<{
  name: string;
  description: string;
  actionType?: 'dialog' | 'navigation' | 'external';
  dialogConfig?: any;
  tooltip?: string;
  route?: string;
  dependencies?: number[];
}> = [
  {
    name: "Commercial Market Analysis",
    description: "Analyze commercial real estate markets and submarkets",
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Commercial Market Analysis",
      fields: [
        { name: 'propertyTypes', label: 'Property Types', type: 'select' as const, required: true, options: ['Office', 'Retail', 'Industrial', 'Mixed-Use'] },
        { name: 'marketSize', label: 'Market Size (SF)', type: 'number' as const, required: true },
        { name: 'vacancyRate', label: 'Market Vacancy Rate (%)', type: 'number' as const, required: true },
        { name: 'avgRent', label: 'Average Rent ($/SF)', type: 'number' as const, required: true }
      ],
      submitLabel: "Analyze Market"
    },
    tooltip: "Start with commercial market analysis"
  },
  {
    name: "Tenant Analysis",
    description: "Research and analyze potential tenants and lease structures",
    dependencies: [203],
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Tenant Analysis",
      fields: [
        { name: 'tenantCredit', label: 'Minimum Tenant Credit Rating', type: 'select' as const, required: true, options: ['AAA', 'AA', 'A', 'BBB', 'BB'] },
        { name: 'leaseTerm', label: 'Minimum Lease Term (Years)', type: 'number' as const, required: true },
        { name: 'escalation', label: 'Rent Escalation (%)', type: 'number' as const, required: true },
        { name: 'tenantImprovement', label: 'Tenant Improvement Allowance ($/SF)', type: 'number' as const, required: true }
      ],
      submitLabel: "Complete Analysis"
    }
  },
  {
    name: "Commercial Underwriting",
    description: "Set up commercial underwriting models and criteria",
    dependencies: [204],
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Commercial Underwriting Setup",
      fields: [
        { name: 'capRate', label: 'Target Cap Rate (%)', type: 'number' as const, required: true },
        { name: 'irr', label: 'Target IRR (%)', type: 'number' as const, required: true },
        { name: 'ltv', label: 'Maximum LTV (%)', type: 'number' as const, required: true },
        { name: 'dscr', label: 'Minimum DSCR', type: 'number' as const, required: true }
      ],
      submitLabel: "Set Underwriting Criteria"
    }
  },
  {
    name: "Legal & Regulatory Setup",
    description: "Configure legal and regulatory compliance requirements",
    dependencies: [205],
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Legal & Regulatory Setup",
      fields: [
        { name: 'regulatoryCompliance', label: 'Regulatory Compliance', type: 'select' as const, required: true, options: ['SEC Compliant', 'Non-SEC'] },
        { name: 'environmental', label: 'Environmental Assessment Required', type: 'select' as const, required: true, options: ['Yes', 'No'] },
        { name: 'insurance', label: 'Insurance Requirements', type: 'textarea' as const, required: true }
      ],
      submitLabel: "Configure Compliance"
    }
  },
  {
    name: "Asset Management Plan",
    description: "Develop comprehensive asset management strategy",
    dependencies: [206],
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Asset Management Plan",
      fields: [
        { name: 'managementStyle', label: 'Management Style', type: 'select' as const, required: true, options: ['Active', 'Passive', 'Value-Add'] },
        { name: 'reinvestment', label: 'Capital Reinvestment Strategy', type: 'textarea' as const, required: true },
        { name: 'exitStrategy', label: 'Exit Strategy', type: 'select' as const, required: true, options: ['Sale', 'Refinance', 'Hold'] }
      ],
      submitLabel: "Create Plan"
    }
  },
  {
    name: "Commercial Fund Launch",
    description: "Launch your Commercial Office/Retail Fund",
    dependencies: [207],
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Commercial Fund Launch",
      fields: [
        { name: 'fundSize', label: 'Target Fund Size ($)', type: 'number' as const, required: true },
        { name: 'launchDate', label: 'Launch Date', type: 'text' as const, required: true },
        { name: 'confirmation', label: 'All requirements met', type: 'select' as const, required: true, options: ['Yes', 'No'] }
      ],
      submitLabel: "Launch Commercial Fund"
    }
  },
  {
    name: "Commercial Legal Setup",
    description: "Establish legal structure and compliance for commercial fund",
    dependencies: [208],
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Commercial Legal Structure",
      fields: [
        { name: 'entityType', label: 'Entity Type', type: 'select' as const, required: true, options: ['LLC', 'LP', 'Trust', 'REIT'] },
        { name: 'regulatory', label: 'Regulatory Compliance', type: 'select' as const, required: true, options: ['SEC Compliant', 'Non-SEC', '506(c) Reg D'] },
        { name: 'insurance', label: 'Insurance Requirements', type: 'textarea' as const, required: true },
        { name: 'contracts', label: 'Standard Contract Templates', type: 'select' as const, required: true, options: ['Need templates', 'Have existing', 'Will create custom'] }
      ],
      submitLabel: "Establish Legal Structure"
    }
  },
  {
    name: "Property Management Network",
    description: "Build network of property management and leasing partners",
    dependencies: [209],
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Property Management Setup",
      fields: [
        { name: 'managementPartners', label: 'Property Management Partners', type: 'textarea' as const, required: true },
        { name: 'leasingAgents', label: 'Leasing Agent Network', type: 'textarea' as const, required: true },
        { name: 'maintenance', label: 'Maintenance Contractor Network', type: 'textarea' as const, required: true },
        { name: 'technology', label: 'Property Management Software', type: 'select' as const, required: true, options: ['Yardi', 'MRI', 'AppFolio', 'Buildium', 'Other'] }
      ],
      submitLabel: "Build Management Network"
    }
  },
];

const SPECIALTY_FUND_SKILLS: Array<{
  name: string;
  description: string;
  actionType?: 'dialog' | 'navigation' | 'external';
  dialogConfig?: any;
  tooltip?: string;
  route?: string;
  dependencies?: number[];
}> = [
  {
    name: "Niche Market Identification",
    description: "Identify and analyze specialty/niche real estate markets",
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Niche Market Analysis",
      fields: [
        { name: 'nicheType', label: 'Niche Type', type: 'select' as const, required: true, options: ['Self-Storage', 'Data Centers', 'Senior Housing', 'Student Housing', 'Healthcare'] },
        { name: 'marketDemand', label: 'Market Demand Analysis', type: 'textarea' as const, required: true },
        { name: 'competition', label: 'Competitive Analysis', type: 'textarea' as const, required: true },
        { name: 'growthPotential', label: 'Growth Potential', type: 'select' as const, required: true, options: ['High', 'Medium', 'Low'] }
      ],
      submitLabel: "Identify Niche"
    },
    tooltip: "Start by identifying your specialty niche"
  },
  {
    name: "Specialty Underwriting Model",
    description: "Develop underwriting models specific to your niche",
    dependencies: [303],
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Specialty Underwriting Setup",
      fields: [
        { name: 'valuationMethod', label: 'Valuation Method', type: 'select' as const, required: true, options: ['Income', 'Cost', 'Sales Comparison'] },
        { name: 'riskFactors', label: 'Risk Factors', type: 'textarea' as const, required: true },
        { name: 'returnMetrics', label: 'Key Return Metrics', type: 'textarea' as const, required: true }
      ],
      submitLabel: "Set Underwriting Model"
    }
  },
  {
    name: "Regulatory Compliance",
    description: "Address niche-specific regulatory and compliance requirements",
    dependencies: [304],
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Regulatory Compliance Setup",
      fields: [
        { name: 'licenses', label: 'Required Licenses', type: 'textarea' as const, required: true },
        { name: 'certifications', label: 'Required Certifications', type: 'textarea' as const, required: true },
        { name: 'compliance', label: 'Compliance Requirements', type: 'textarea' as const, required: true }
      ],
      submitLabel: "Configure Compliance"
    }
  },
  {
    name: "Operations Setup",
    description: "Set up operational requirements for your specialty assets",
    dependencies: [305],
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Operations Configuration",
      fields: [
        { name: 'management', label: 'Management Requirements', type: 'textarea' as const, required: true },
        { name: 'maintenance', label: 'Maintenance Protocols', type: 'textarea' as const, required: true },
        { name: 'technology', label: 'Technology Requirements', type: 'textarea' as const, required: true }
      ],
      submitLabel: "Set Operations"
    }
  },
  {
    name: "Specialty Fund Launch",
    description: "Launch your Specialty/Niche Asset Fund",
    dependencies: [306],
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Specialty Fund Launch",
      fields: [
        { name: 'fundFocus', label: 'Fund Focus', type: 'text' as const, required: true },
        { name: 'targetSize', label: 'Target Fund Size ($)', type: 'number' as const, required: true },
        { name: 'launchDate', label: 'Launch Date', type: 'text' as const, required: true },
        { name: 'confirmation', label: 'Ready to launch', type: 'select' as const, required: true, options: ['Yes', 'No'] }
      ],
      submitLabel: "Launch Specialty Fund"
    }
  },
  {
    name: "Industry Partnerships",
    description: "Develop partnerships with industry specialists and operators",
    dependencies: [307],
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Industry Partnerships",
      fields: [
        { name: 'operators', label: 'Key Industry Operators', type: 'textarea' as const, required: true },
        { name: 'advisors', label: 'Specialty Advisors/Consultants', type: 'textarea' as const, required: true },
        { name: 'vendors', label: 'Specialized Vendors/Suppliers', type: 'textarea' as const, required: true },
        { name: 'networks', label: 'Industry Networks/Memberships', type: 'textarea' as const, required: true }
      ],
      submitLabel: "Establish Partnerships"
    }
  },
  {
    name: "Niche Marketing Strategy",
    description: "Develop targeted marketing strategy for your specialty niche",
    dependencies: [306],
    actionType: 'dialog' as const,
    dialogConfig: {
      title: "Niche Marketing Strategy",
      fields: [
        { name: 'targetAudience', label: 'Target Investor Audience', type: 'textarea' as const, required: true },
        { name: 'messaging', label: 'Key Marketing Messages', type: 'textarea' as const, required: true },
        { name: 'channels', label: 'Marketing Channels', type: 'select' as const, required: true, options: ['Industry Events', 'Direct Outreach', 'Digital Marketing', 'Referrals', 'All Channels'] },
        { name: 'differentiation', label: 'Competitive Differentiation', type: 'textarea' as const, required: true }
      ],
      submitLabel: "Create Marketing Strategy"
    }
  },
];

function generateCategoryTasks(
  skills: Array<{
    name: string;
    description: string;
    actionType?: 'dialog' | 'navigation' | 'external';
    dialogConfig?: {
      title: string;
      fields: Array<{
        name: string;
        label: string;
        type: 'text' | 'number' | 'email' | 'select' | 'textarea';
        required: boolean;
        options?: string[];
      }>;
      submitLabel: string;
    };
    tooltip?: string;
    route?: string;
    dependencies?: number[] | undefined;
  }>,
  startId: number,
  category: string,
  initialCompleted: boolean = false
): Task[] {
  return skills.map((skill, idx) => {
    const id = startId + idx;
    const completed = initialCompleted ? idx === 0 : false; // For initial tasks, first task starts completed
    const dependencies = skill.dependencies || (idx > 0 ? [id - 1] : []);
    const parentId = idx > 0 ? id - 1 : null;
    const basePoints = 10 + idx * 5;
    const points = basePoints + Math.floor(Math.random() * 6); // Add 0-5 random points

    return {
      id,
      label: skill.name,
      name: skill.name,
      description: skill.description,
      points,
      urgency: idx + 1,
      dependencies,
      parentId,
      completed,
      category,
      actionType: skill.actionType,
      dialogConfig: skill.dialogConfig,
      tooltip: skill.tooltip,
      route: skill.route,
    };
  });
}

export function generateMockData(fundType?: "sfr" | "commercial" | "specialty"): {
  initialTasks: Task[];
  sfr: Task[];
  commercial: Task[];
  specialty: Task[];
} {
  // Generate fund-specific initial tasks and prepend to fund categories
  let sfrTasks = SFR_FUND_SKILLS;
  let commercialTasks = COMMERCIAL_FUND_SKILLS;
  let specialtyTasks = SPECIALTY_FUND_SKILLS;

  if (fundType) {
    // Prepend fund-specific initial tasks to the selected fund's task list
    if (fundType === "sfr") {
      sfrTasks = [...SFR_INITIAL_TASKS, ...SFR_FUND_SKILLS];
    } else if (fundType === "commercial") {
      commercialTasks = [...COMMERCIAL_INITIAL_TASKS, ...COMMERCIAL_FUND_SKILLS];
    } else if (fundType === "specialty") {
      specialtyTasks = [...SPECIALTY_INITIAL_TASKS, ...SPECIALTY_FUND_SKILLS];
    }
  }

  return {
    initialTasks: generateCategoryTasks(INITIAL_TASKS_SKILLS, 1, "initial-tasks", true),
    sfr: generateCategoryTasks(sfrTasks, 101, "sfr"),
    commercial: generateCategoryTasks(commercialTasks, 201, "commercial"),
    specialty: generateCategoryTasks(specialtyTasks, 301, "specialty"),
  };
}

export function getAllTasks(data: {
  initialTasks: Task[];
  sfr: Task[];
  commercial: Task[];
  specialty: Task[];
}): Task[] {
  return [...data.initialTasks, ...data.sfr, ...data.commercial, ...data.specialty];
}

export function getCompletedCount(tasks: Task[]): number {
  return tasks.filter((t) => t.completed).length;
}

export function getTotalCount(tasks: Task[]): number {
  return tasks.length;
}

export function isInitialTasksComplete(tasks: Task[]): boolean {
  return tasks.every((t) => t.completed);
}