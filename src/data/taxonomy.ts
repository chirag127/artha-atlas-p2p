export interface SeriesInfo {
  slug: string;
  title: string;
  description: string;
  category: string;
  articleCount: number;
  icon: string;
}

export const CONTENT_SERIES: SeriesInfo[] = [
  {
    slug: 'p2p-fundamentals',
    title: 'P2P Lending Fundamentals',
    description: 'The core mechanics of peer-to-peer marketplaces, loan lifecycle, participants, and legal contracts.',
    category: 'Fundamentals',
    articleCount: 10,
    icon: 'BookOpen',
  },
  {
    slug: 'rbi-regulation',
    title: 'RBI Regulatory Framework',
    description: 'Master Directions, the August 2024 crackdown on assured returns, escrow fund flows, and legal compliance.',
    category: 'Regulation',
    articleCount: 10,
    icon: 'ShieldCheck',
  },
  {
    slug: 'credit-risk',
    title: 'Borrower Credit Underwriting',
    description: 'Bureau scores, DTI ratios, vintage curves, adverse selection, probability of default (PD), and loss modeling.',
    category: 'Risk Analysis',
    articleCount: 10,
    icon: 'Activity',
  },
  {
    slug: 'returns-and-fees',
    title: 'Returns, Yield & Fee Mechanics',
    description: 'Reducing balance vs flat rates, servicing fees, cash drag erosion, XIRR calculations, and inflation adjustments.',
    category: 'Quantitative Finance',
    articleCount: 10,
    icon: 'TrendingUp',
  },
  {
    slug: 'defaults-and-recoveries',
    title: 'Defaults, Restructuring & Recoveries',
    description: 'DPD buckets, SMA stages, legal notices, Section 138 NI Act, recovery agency economics, and haircuts.',
    category: 'Credit Operations',
    articleCount: 10,
    icon: 'AlertTriangle',
  },
  {
    slug: 'portfolio-analytics',
    title: 'Portfolio Analytics & Diversification',
    description: 'Herfindahl-Hirschman Index (HHI), Effective Number of Borrowers, correlated defaults, and stress testing.',
    category: 'Portfolio Management',
    articleCount: 10,
    icon: 'PieChart',
  },
  {
    slug: 'taxation',
    title: 'P2P Taxation & Legal Precedents',
    description: 'Section 56(2) IFOS, Section 57(iii) expense deductions, and the non-deductible default Asymmetric Tax Trap.',
    category: 'Taxation & Law',
    articleCount: 10,
    icon: 'FileText',
  },
  {
    slug: 'platform-research',
    title: 'Platform Due Diligence & Disclosures',
    description: 'Independent frameworks for auditing P2P platforms, reading financial statements, and detecting red flags.',
    category: 'Due Diligence',
    articleCount: 10,
    icon: 'Search',
  },
  {
    slug: 'compare-investments',
    title: 'P2P vs Alternative Asset Classes',
    description: 'Direct empirical comparisons against Bank FDs, Corporate Bonds, Debt MFs, T-Bills, and REITs.',
    category: 'Asset Allocation',
    articleCount: 10,
    icon: 'BarChart2',
  },
  {
    slug: 'investor-behaviour',
    title: 'Investor Behaviour & Risk Budgeting',
    description: 'Yield chasing, survivorship bias, compounding fallacies, liquidity tolerance, and exit strategies.',
    category: 'Behavioural Finance',
    articleCount: 10,
    icon: 'UserCheck',
  },
];
