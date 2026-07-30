// frontend/src/data/businessTemplates.js

// Predefined Business Context templates for ABC's AMC and NBFC LOBs

export const BUSINESS_TEMPLATES = {
  AMC: {
    Investments: {
      rolePurpose:
        "To lead the investment management function, delivering superior risk-adjusted returns for investors while maintaining strict adherence to SEBI Mutual Fund Regulations, AMFI guidelines, and internal investment mandates across the AMC's equity, debt, hybrid, and offshore schemes.",

      outcomes: [
        "Benchmark-beating scheme performance",

        "AUM growth through investor confidence",

        "Risk-adjusted alpha generation",

        "Regulatory compliance (SEBI, AMFI)",

        "Portfolio quality and liquidity management",
      ],

      decisionAuthority:
        "Independent authority on security selection, sector allocation, portfolio construction within scheme mandates, and tactical positioning. Requires approval for changes in scheme investment objectives, new asset class exposure, and dealings above defined transaction thresholds. Recommends new scheme launches to the Investment Committee.",

      financials: {
        budget: "Scheme-level operating expenses within TER caps",

        revenue: "Revenue tied directly to AUM performance and expense ratios",

        aum: "As per scheme portfolio allocated",

        cost: "Scheme-level expense management",
      },
    },

    "Sales & Distribution": {
      rolePurpose:
        "To drive AUM mobilization and scheme distribution across retail, HNI, and institutional investor segments through the distributor network (IFAs, National Distributors, Banking partners) and direct channels, expanding market share and SIP book while maintaining channel profitability.",

      outcomes: [
        "Net Sales AUM growth",

        "SIP book expansion and persistency",

        "Distributor network activation",

        "Retail folio growth",

        "Channel-wise revenue targets",
      ],

      decisionAuthority:
        "Independent authority on distributor onboarding within policy, commission structures within approved matrix, and zonal sales strategy. Requires approval for new distributor category launches, commission structure changes, marketing spends above threshold, and channel exclusivity arrangements.",

      financials: {
        budget: "Sales & marketing budget for the vertical/zone",

        revenue: "Direct P&L impact through Net Sales AUM",

        aum: "Vertical/zonal AUM contribution",

        cost: "Channel commissions, sales cost per crore",
      },
    },

    Operations: {
      rolePurpose:
        "To oversee scheme operations including NAV computation, unit holder services, scheme accounting, corporate actions, and regulatory reporting, ensuring accurate, timely, and compliant execution across all AMC schemes and investor touchpoints.",

      outcomes: [
        "100% NAV accuracy and timeliness",

        "Regulatory filings within SEBI timelines",

        "Investor grievance resolution SLA",

        "Operational risk mitigation",

        "Process automation and cost efficiency",
      ],

      decisionAuthority:
        "Independent authority on operational process changes, vendor selection within approved panel, and daily operational decisions. Requires approval for material process re-designs, technology investments above threshold, new vendor onboarding, and NAV error remediation above defined limits.",

      financials: {
        budget: "Operations cost as % of AUM",

        revenue: "Cost avoidance through automation and STP",

        aum: "Supports full AMC AUM",

        cost: "Ops cost, RTA fees, custody charges",
      },
    },

    Compliance: {
      rolePurpose:
        "To ensure end-to-end regulatory compliance across SEBI Mutual Fund Regulations, AMFI guidelines, PMLA norms, and internal codes of conduct for the AMC, including mutual funds, PMS, AIF, and offshore verticals, while acting as the primary regulatory interface.",

      outcomes: [
        "Zero regulatory adverse observations",

        "Timely compliance with SEBI circulars",

        "Effective internal compliance framework",

        "AML/KYC compliance",

        "Board and audit committee reporting",
      ],

      decisionAuthority:
        "Independent authority on compliance interpretations, scheme document reviews, and dealer/employee code enforcement. Provides advisory to CEO and Board on regulatory strategy. Requires approval for external regulatory representations and material policy changes.",

      financials: {
        budget: "Compliance function operating budget",

        revenue: "Prevention of penalties and reputational loss",

        aum: "Compliance oversight of full AMC AUM",

        cost: "Compliance technology and consultancy",
      },
    },

    Finance: {
      rolePurpose:
        "To lead the AMC's financial planning, accounting, taxation, treasury, and regulatory reporting functions, providing strategic financial advisory to the CEO and business, and ensuring statutory compliance for a listed asset management company.",

      outcomes: [
        "Accurate financial reporting and audit closure",

        "Profitability management and cost control",

        "Timely tax compliance across geographies",

        "Investor and analyst engagement (as listed entity)",

        "Board and shareholder reporting",
      ],

      decisionAuthority:
        "Independent authority on operational financial decisions, banking relationships within approved policy, and MIS structures. Recommends budgets, financial plans, and treasury investments to the Board. Requires Board approval for material capex and financial strategy shifts.",

      financials: {
        budget: "Full AMC operating budget ownership",

        revenue: "Direct P&L accountability",

        aum: "N/A (indirect via cost management)",

        cost: "Enterprise cost ownership",
      },
    },

    Risk: {
      rolePurpose:
        "To design and oversee the enterprise risk management framework covering investment risk, operational risk, liquidity risk, and market risk across all AMC schemes and businesses, providing independent risk oversight to the Board.",

      outcomes: [
        "Portfolio risk within defined limits",

        "Effective liquidity risk framework",

        "Operational risk incident reduction",

        "Risk-adjusted performance metrics",

        "Board risk committee reporting",
      ],

      decisionAuthority:
        "Independent authority to escalate limit breaches, veto trades that breach risk parameters, and approve risk framework changes within policy. Reports to Risk Committee of Board.",

      financials: {
        budget: "Risk function operating budget",

        revenue: "Prevention of losses through risk limits",

        aum: "Risk oversight of full AMC AUM",

        cost: "Risk systems and analytics infrastructure",
      },
    },

    Technology: {
      rolePurpose:
        "To lead technology strategy and platform delivery for the AMC across investment management systems, distributor platforms, investor-facing digital assets, operations technology, and enterprise data, enabling digital transformation and scale.",

      outcomes: [
        "Platform stability and uptime",

        "Digital adoption metrics",

        "Technology cost optimization",

        "Cybersecurity posture",

        "New product tech time-to-market",
      ],

      decisionAuthority:
        "Independent authority on technology architecture, vendor selection within panel, and infrastructure decisions. Requires approval for major platform investments, new SaaS contracts above threshold, and enterprise architecture shifts.",

      financials: {
        budget: "Technology capex and opex",

        revenue: "Revenue enablement through digital assets",

        aum: "Technology supports full AMC AUM",

        cost: "Tech spend as % of revenue",
      },
    },

    HR: {
      rolePurpose:
        "To lead the human resources function for the AMC, driving talent acquisition, capability building, performance management, culture, compensation, and organizational design, supporting business growth in a highly competitive talent market.",

      outcomes: [
        "Talent quality and retention",

        "Leadership pipeline strength",

        "Employee engagement scores",

        "Compensation competitiveness",

        "Culture and DEI progress",
      ],

      decisionAuthority:
        "Independent authority on HR operations, learning programs, and hiring within approved manpower budget. Requires approval for compensation structure changes, senior hiring, and material policy shifts.",

      financials: {
        budget: "Full AMC people cost",

        revenue: "Revenue enablement through talent",

        aum: "N/A",

        cost: "Total people cost",
      },
    },

    Marketing: {
      rolePurpose:
        "To lead brand, digital marketing, retail acquisition, and investor education for the AMC, building brand equity and driving distributor and investor engagement in a competitive mutual fund market.",

      outcomes: [
        "Brand health metrics",

        "Retail investor acquisition costs",

        "Digital campaign ROI",

        "Investor education outreach",

        "Distributor engagement",
      ],

      decisionAuthority:
        "Independent authority on brand and marketing campaigns within approved budget. Requires approval for material brand strategy changes, agency contracts above threshold, and sponsorships.",

      financials: {
        budget: "Marketing budget as % of AUM",

        revenue: "Indirect through acquisition",

        aum: "Supports full AMC AUM growth",

        cost: "Marketing spend",
      },
    },

    Digital: {
      rolePurpose:
        "To drive digital transformation across investor, distributor, and internal touchpoints for the AMC, delivering AI, agentic platforms, and next-generation user experiences that create competitive advantage.",

      outcomes: [
        "Digital transaction share",

        "AI/GenAI initiative outcomes",

        "Distributor digital adoption",

        "Investor app engagement",

        "Digital innovation pipeline",
      ],

      decisionAuthority:
        "Independent authority on digital roadmap, product prioritization, and pilot programs. Requires approval for enterprise-wide digital initiatives, platform investments, and vendor engagements above threshold.",

      financials: {
        budget: "Digital transformation budget",

        revenue: "Revenue from digital channels",

        aum: "Supports digital-led AUM growth",

        cost: "Digital platform costs",
      },
    },
  },

  NBFC: {
    Credit: {
      rolePurpose:
        "To design and manage the credit policy, underwriting standards, and portfolio quality across secured and unsecured lending products, delivering profitable disbursement growth while maintaining asset quality under RBI norms.",

      outcomes: [
        "Disbursement growth within approved risk appetite",

        "NPA and GNPA within targets",

        "Credit cost management",

        "Portfolio yield optimization",

        "RBI compliance",
      ],

      decisionAuthority:
        "Independent authority on credit approvals within delegated matrix, policy changes within approved framework, and portfolio actions. Recommends risk appetite changes to Board Credit Committee. Requires approval for material policy shifts and large-ticket approvals above threshold.",

      financials: {
        budget: "Credit function operating cost",

        revenue: "Direct impact on interest income",

        aum: "Loan book portfolio managed",

        cost: "Credit cost, provisioning",
      },
    },

    Underwriting: {
      rolePurpose:
        "To lead underwriting operations across lending products, ensuring consistent application of credit policy, efficient TAT, and risk-based decisioning at scale using both traditional and digital underwriting frameworks.",

      outcomes: [
        "Approval TAT within SLA",

        "Approval-to-disbursement conversion",

        "Underwriting decision quality",

        "Digital underwriting adoption",

        "First-payment default control",
      ],

      decisionAuthority:
        "Independent authority on underwriting operational decisions, team allocation, and process changes within policy. Requires approval for policy exceptions, credit engine changes, and rule modifications.",

      financials: {
        budget: "Underwriting cost per file",

        revenue: "Enables disbursement volume",

        aum: "Supports loan book growth",

        cost: "Underwriting operational cost",
      },
    },

    Collections: {
      rolePurpose:
        "To lead the collections and recovery function across bucket-wise portfolios, minimizing NPAs through field collections, tele-calling, legal action, and recovery strategies while ensuring RBI Fair Practices Code compliance.",

      outcomes: [
        "Bucket-wise resolution rates",

        "NPA reduction",

        "Legal recovery success",

        "Collection cost efficiency",

        "Customer relationship preservation",
      ],

      decisionAuthority:
        "Independent authority on collection strategies, agency onboarding within panel, and settlement decisions within delegated matrix. Requires approval for material settlement waivers, legal escalations, and agency terms above threshold.",

      financials: {
        budget: "Collections operating cost",

        revenue: "Recovery inflows and NPA reduction",

        aum: "Portfolio under collections management",

        cost: "Collections cost per rupee recovered",
      },
    },

    "Branch Banking": {
      rolePurpose:
        "To lead branch operations across the pan-India branch network, driving disbursement, customer acquisition, and cross-sell through the branch channel while maintaining operational compliance and customer experience.",

      outcomes: [
        "Branch-level disbursement growth",

        "Customer acquisition per branch",

        "Cross-sell productivity",

        "Branch operational compliance",

        "Customer NPS at branch",
      ],

      decisionAuthority:
        "Independent authority on branch operations, staffing within budget, and local business decisions. Requires approval for new branch launches, branch closures, and productivity strategy shifts.",

      financials: {
        budget: "Branch cost, viability metrics",

        revenue: "Branch disbursement and cross-sell revenue",

        aum: "Branch loan book contribution",

        cost: "Branch cost-to-income",
      },
    },

    "Channel Sales": {
      rolePurpose:
        "To drive disbursement growth through the DSA (Direct Selling Agent) and connector network across geographies, activating and managing 800+ channel partners while balancing volume, quality, and payout economics.",

      outcomes: [
        "Channel disbursement growth",

        "DSA productivity and activation",

        "Channel-mix optimization",

        "Payout cost management",

        "Channel compliance and conduct",
      ],

      decisionAuthority:
        "Independent authority on DSA activation, commission within approved matrix, and channel strategy. Requires approval for commission structure changes and material payout revisions.",

      financials: {
        budget: "Channel payout budget",

        revenue: "Channel disbursement contribution",

        aum: "Channel-sourced loan book",

        cost: "Cost of acquisition through channels",
      },
    },

    Risk: {
      rolePurpose:
        "To oversee enterprise risk management for the NBFC covering credit risk, market risk, operational risk, and liquidity risk under RBI regulations, providing independent risk assurance to the Board.",

      outcomes: [
        "Portfolio quality metrics",

        "ALM and liquidity ratios",

        "Operational loss reduction",

        "Risk-based capital adequacy",

        "Regulatory risk reporting",
      ],

      decisionAuthority:
        "Independent authority to enforce risk limits, escalate exceptions, and approve risk framework changes. Reports directly to Risk Committee of Board.",

      financials: {
        budget: "Risk function budget",

        revenue: "Loss avoidance value",

        aum: "Risk oversight of full loan book",

        cost: "Risk infrastructure cost",
      },
    },

    Digital: {
      rolePurpose:
        "To drive digital lending transformation across customer origination, credit decisioning, servicing, and collections for the NBFC, building app-first and API-first products in a rapidly evolving digital lending market.",

      outcomes: [
        "Digital disbursement share",

        "Instant loan TAT",

        "Digital cost of acquisition",

        "App engagement metrics",

        "Digital NPA performance",
      ],

      decisionAuthority:
        "Independent authority on digital roadmap, product prioritization, and pilot programs. Requires approval for material platform investments and new product launches.",

      financials: {
        budget: "Digital transformation budget",

        revenue: "Digital channel revenue",

        aum: "Digital-sourced loan book",

        cost: "Digital cost per acquisition",
      },
    },

    Finance: {
      rolePurpose:
        "To lead financial management, treasury, capital planning, and RBI regulatory financial reporting for the NBFC, managing balance sheet growth, funding mix, and capital adequacy.",

      outcomes: [
        "Cost of funds optimization",

        "Capital adequacy compliance",

        "Financial reporting accuracy",

        "Rating agency management",

        "Investor and shareholder relations",
      ],

      decisionAuthority:
        "Independent authority on treasury operations within policy, banking relationships, and financial reporting. Recommends capital raising and material policy shifts to Board.",

      financials: {
        budget: "NBFC operating budget",

        revenue: "Net Interest Margin management",

        aum: "Balance sheet ownership",

        cost: "Cost of funds and opex",
      },
    },

    HR: {
      rolePurpose:
        "To lead the human resources function for the NBFC, driving field talent acquisition at scale, capability building for sales and credit teams, and organizational design across a large distributed workforce.",

      outcomes: [
        "Field talent acquisition and retention",

        "Sales productivity through capability",

        "Culture and engagement",

        "Compensation competitiveness",

        "Frontline manager effectiveness",
      ],

      decisionAuthority:
        "Independent authority on HR operations, hiring within budget, and learning programs. Requires approval for compensation and organization structure changes.",

      financials: {
        budget: "NBFC people cost",

        revenue: "Revenue enablement",

        aum: "N/A",

        cost: "Total people cost",
      },
    },

    Compliance: {
      rolePurpose:
        "To ensure end-to-end regulatory compliance under RBI Master Directions for NBFCs, Fair Practices Code, AML/KYC norms, and digital lending guidelines, acting as the primary regulatory interface.",

      outcomes: [
        "Zero regulatory adverse observations",

        "Timely response to RBI circulars",

        "AML/KYC framework strength",

        "Digital lending compliance",

        "Board compliance reporting",
      ],

      decisionAuthority:
        "Independent authority on compliance interpretations, policy reviews, and enforcement decisions. Requires approval for material regulatory strategies and external representations.",

      financials: {
        budget: "Compliance function budget",

        revenue: "Penalty avoidance",

        aum: "Compliance oversight of full portfolio",

        cost: "Compliance technology and consultancy",
      },
    },
  },
};

// Empty template used when LOB/Department has no predefined mapping

export const EMPTY_TEMPLATE = {
  rolePurpose: "",

  outcomes: [],

  decisionAuthority: "",

  financials: {
    budget: "",

    revenue: "",

    aum: "",

    cost: "",
  },
};

export function getBusinessTemplate(lob, department) {
  return BUSINESS_TEMPLATES[lob]?.[department] || EMPTY_TEMPLATE;
}
