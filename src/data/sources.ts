export interface SourceCitation {
  id: string;
  title: string;
  publisher: string;
  url: string;
  publishedDate: string;
  retrievedDate: string;
  applicablePeriod: string;
  category: 'RBI Regulation' | 'Taxation' | 'Court Precedent' | 'Statutory Law' | 'Market Disclosures';
  claimsSupported: string[];
  notes?: string;
}

export const CENTRAL_SOURCES: SourceCitation[] = [
  {
    id: 'rbi-p2p-md-2017',
    title: 'Master Direction – Non-Banking Financial Company – Peer to Peer Lending Platform (Reserve Bank) Directions, 2017',
    publisher: 'Reserve Bank of India (RBI)',
    url: 'https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=11137',
    publishedDate: '2017-08-24',
    retrievedDate: '2026-10-14',
    applicablePeriod: 'August 2017 to Present (with subsequent amendments)',
    category: 'RBI Regulation',
    claimsSupported: [
      'NBFC-P2P registration requirement under Section 45-IA of RBI Act',
      'Intermediary status: NBFC-P2P shall not hold or lend own funds',
      'No credit guarantee or credit enhancement allowed on platform',
      'Statutory leverage ratio and minimum net owned funds of ₹2 crore',
      'Aggregate lending limit of ₹50 lakh across all platforms per lender',
      'Exposure ceiling of ₹50,000 to a single borrower across all platforms',
      'Mandatory CA net worth certificate for investments exceeding ₹10 lakh',
      'Escrow fund-flow mechanism operated by a bank-promoted trustee',
      'Maximum loan tenure capped at 36 months'
    ],
    notes: 'The foundational regulatory charter defining permitted activities, escrow structure, and lending limits.'
  },
  {
    id: 'rbi-circular-aug-2024',
    title: 'Review of Master Direction – Non-Banking Financial Company – Peer to Peer Lending Platform (Reserve Bank) Directions, 2017 (Ref: RBI/2024-25/63, DoR.FIN.REC.35/03.10.124/2024-25)',
    publisher: 'Reserve Bank of India (RBI)',
    url: 'https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12724&Mode=0',
    publishedDate: '2024-08-16',
    retrievedDate: '2026-10-14',
    applicablePeriod: 'August 16, 2024 onward (90-day transition for escrow T+1 settlement)',
    category: 'RBI Regulation',
    claimsSupported: [
      'Strict ban on positioning P2P lending as an investment product with assured returns',
      'Absolute prohibition of secondary liquidity options, premature exits, or tenure-linked guaranteed minimum returns',
      'Strict ban on direct or indirect credit enhancements, risk-sharing cushions, or default safety nets',
      'Prohibition of fund pooling: direct lender-to-borrower bank transfer via trustee escrow',
      'Mandatory T+1 settlement timeline for transferring committed funds out of escrow',
      'Mandated transparent board-approved matching criteria preventing automated obscure clustering',
      'Mandatory public disclosure of portfolio NPA delinquency curves and vintage performance on platform websites'
    ],
    notes: 'Landmark supervisory circular dismantling fintech-style instant liquidity/assured yield schemes in India.'
  },
  {
    id: 'it-act-sec-56-2',
    title: 'Income Tax Act, 1961 – Section 56(2): Income from Other Sources',
    publisher: 'Income Tax Department, Ministry of Finance, Government of India',
    url: 'https://incometaxindia.gov.in/Acts/Income-tax%20Act,%201961/2024/102120000000082772.htm',
    publishedDate: '1961-04-01',
    retrievedDate: '2026-10-14',
    applicablePeriod: 'Assessment Year 2025-26 / FY 2024-25 (and ongoing)',
    category: 'Taxation',
    claimsSupported: [
      'Interest earned by individual retail lenders on P2P loans is chargeable under Income from Other Sources',
      'Income is added to total gross income and taxed at the individual applicable marginal slab rates',
      'Principal repaid by borrowers is capital return and non-taxable'
    ],
    notes: 'Standard charging section for non-business interest receipts.'
  },
  {
    id: 'it-act-sec-57-iii',
    title: 'Income Tax Act, 1961 – Section 57(iii): Deductions from Income from Other Sources',
    publisher: 'Income Tax Department, Ministry of Finance, Government of India',
    url: 'https://incometaxindia.gov.in/Acts/Income-tax%20Act,%201961/2024/102120000000082773.htm',
    publishedDate: '1961-04-01',
    retrievedDate: '2026-10-14',
    applicablePeriod: 'Assessment Year 2025-26 / FY 2024-25',
    category: 'Taxation',
    claimsSupported: [
      'Expenditure incurred wholly and exclusively for the purpose of making or earning such income is deductible',
      'Platform onboarding fees, loan processing fees, and collection commission fees are deductible against gross P2P interest',
      'Capital losses or lost principal do not qualify as expenditure under Section 57(iii)'
    ],
    notes: 'Supported by Supreme Court precedent in CIT v. Rajendra Prasad Moody (1978) 115 ITR 519 (SC).'
  },
  {
    id: 'it-act-sec-36-bad-debt',
    title: 'Income Tax Act, 1961 – Section 36(1)(vii): Bad Debts Written Off (PGBP vs IFOS)',
    publisher: 'Income Tax Department, Ministry of Finance, Government of India',
    url: 'https://incometaxindia.gov.in/Acts/Income-tax%20Act,%201961/2024/102120000000082747.htm',
    publishedDate: '1961-04-01',
    retrievedDate: '2026-10-14',
    applicablePeriod: 'Ongoing',
    category: 'Taxation',
    claimsSupported: [
      'Bad debt deduction is exclusively available under Profits and Gains of Business or Profession (PGBP)',
      'Retail passive lenders not registered as professional moneylenders cannot claim bad debt write-offs under Section 36',
      'Creates the Asymmetric Tax Trap: retail lenders owe tax on gross interest without relief for defaulted principal'
    ],
    notes: 'Confirmed by multiple ITAT rulings regarding personal unrecovered loans.'
  },
  {
    id: 'it-act-sec-194a',
    title: 'Income Tax Act, 1961 – Section 194A: Interest other than interest on securities (TDS)',
    publisher: 'Income Tax Department, Ministry of Finance, Government of India',
    url: 'https://incometaxindia.gov.in/Acts/Income-tax%20Act,%201961/2024/102120000000083045.htm',
    publishedDate: '1961-04-01',
    retrievedDate: '2026-10-14',
    applicablePeriod: 'Ongoing',
    category: 'Taxation',
    claimsSupported: [
      'Individual borrowers are generally exempt from TDS obligations unless audited under Section 44AB',
      'NBFC-P2P platforms act as facilitators and generally do not deduct TDS on individual borrower EMIs',
      'Lender must self-assess advance tax liabilities under Section 208/209'
    ]
  },
  {
    id: 'rbi-fair-practices-code',
    title: 'Guidelines on Fair Practices Code for NBFCs (DNBS.CC.PD.No. 266 / 03.10.01 / 2011-12)',
    publisher: 'Reserve Bank of India',
    url: 'https://www.rbi.org.in/scripts/BS_CircularIndexDisplay.aspx?Id=7098',
    publishedDate: '2012-03-26',
    retrievedDate: '2026-10-14',
    applicablePeriod: 'Ongoing',
    category: 'RBI Regulation',
    claimsSupported: [
      'Transparent disclosure of interest rates and terms in loan agreements',
      'Prohibition of unduly harsh recovery measures, harassment, or persistent calling during inappropriate hours',
      'Mandatory grievance redressal mechanism and appointed Grievance Redressal Officer'
    ]
  },
  {
    id: 'rbi-digital-lending-guidelines-2022',
    title: 'Guidelines on Digital Lending (DOR.CRE.REC.66/21.07.001/2022-23)',
    publisher: 'Reserve Bank of India',
    url: 'https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12382&Mode=0',
    publishedDate: '2022-09-02',
    retrievedDate: '2026-10-14',
    applicablePeriod: 'September 2022 to Present',
    category: 'RBI Regulation',
    claimsSupported: [
      'Disbursal and servicing strictly between bank accounts without pass-through synthetic wallets',
      'Key Fact Statement (KFS) containing Annual Percentage Rate (APR) must be provided to borrower',
      'Prohibition of First Loss Default Guarantees (FLDG) in unapproved configurations',
      'Data privacy restrictions: platforms cannot access contacts, media files, or call logs'
    ]
  },
  {
    id: 'dicgc-act-1961',
    title: 'Deposit Insurance and Credit Guarantee Corporation Act, 1961 (DICGC)',
    publisher: 'Government of India / RBI',
    url: 'https://www.dicgc.org.in/English/FD_A-GuideToDepositInsurance.html',
    publishedDate: '1961-01-01',
    retrievedDate: '2026-10-14',
    applicablePeriod: 'Ongoing (Amended 2020 to ₹5,00,000 limit)',
    category: 'Statutory Law',
    claimsSupported: [
      'Bank deposits are insured up to ₹5,00,000 across all branches of a commercial/co-operative bank',
      'P2P loans enjoy ZERO deposit insurance or sovereign credit guarantee under DICGC'
    ]
  },
  {
    id: 'finance-act-2023-sec-50aa',
    title: 'Finance Act, 2023 – Insertion of Section 50AA: Taxation of Specified Mutual Funds',
    publisher: 'Ministry of Finance, Government of India',
    url: 'https://incometaxindia.gov.in/Acts/Finance%20Acts/2023/102120000000109923.htm',
    publishedDate: '2023-03-31',
    retrievedDate: '2026-10-14',
    applicablePeriod: 'April 1, 2023 onward',
    category: 'Taxation',
    claimsSupported: [
      'Abolition of indexation benefits on debt mutual funds with equity exposure <=35%',
      'Capital gains from debt funds treated as short-term capital gains taxable at marginal slab rates'
    ]
  }
];

export function getSourceById(id: string): SourceCitation | undefined {
  return CENTRAL_SOURCES.find((s) => s.id === id);
}
