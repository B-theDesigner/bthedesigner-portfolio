// =============================================================================
// CERT-DATA.JS — Single source of truth for Education & Certifications
//
// HOW TO ADD A NEW ENTRY:
//   1. Add a new object anywhere in CERT_ENTRIES (order = display order)
//   2. Set category to: 'design' | 'frontend' | 'pm'
//      Degrees use whichever category fits best — they also appear in 'all'
//   3. Set href to the certificate URL, or '' if there is none
//   4. Save. Both the desktop tabs and mobile accordion update automatically.
//
// FIELDS:
//   name       {string}  Full credential title
//   issuer     {string}  Institution or platform
//   badge      {string}  Display label: "Certificate" | "Degree"
//   status     {string}  "Completed" | "In Progress" | "" (empty = hidden)
//   href       {string}  Verification URL, or "" for no link
//   category   {string}  "design" | "frontend" | "pm" | "ai"
//   icon       {string}  Icon key — see CERT_ICONS below
// =============================================================================

// ── SVG icon path data ────────────────────────────────────────────────────────
const CERT_ICONS = {
  monitor: 'M20 3H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h7v2H8v2h8v-2h-3v-2h7a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 12H5V5h14v10z',
  code:    'M8 3a3 3 0 0 0-3 3v4a3 3 0 0 1-3 3 3 3 0 0 1 3 3v4a3 3 0 0 0 3 3h1v-2H8a1 1 0 0 1-1-1v-4a3 3 0 0 0-3-3.33A3 3 0 0 0 7 9.33V6a1 1 0 0 1 1-1h1V3zm7 0a3 3 0 0 1 3 3v4a3 3 0 0 0 3 3 3 3 0 0 0-3 3v4a3 3 0 0 1-3 3h-1v-2h1a1 1 0 0 0 1-1v-4a3 3 0 0 1 3-3.33A3 3 0 0 1 16 9.33V6a1 1 0 0 0-1-1h-1V3z',
  person:  'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm5 12H7v-.6c0-2 4-3.1 5-3.1s5 1.1 5 3.1V18z',
};

// ── Entry data — edit this array to update both tabs and accordion ─────────────
const CERT_ENTRIES = [
  {
    name:     'M.Sc Human Computer Interaction (HCI)',
    issuer:   'DePaul University',
    badge:    'Degree',
    status:   'Completed',
    href:     '',
    category: 'design',
    icon:     'monitor',
  },
  {
    name:     'B.A Graphic Design',
    issuer:   'Elmhurst University',
    badge:    'Degree',
    status:   'Completed',
    href:     '',
    category: 'design',
    icon:     'monitor',
  },
  {
    name:     'Hands-On with Design Systems',
    issuer:   'LinkedIn Learning',
    badge:    'Certificate',
    status:   'Completed',
    href:     'https://www.linkedin.com/learning/certificates/155135dbe6814ed4d44a59ee67bc6412a378b84ef2cfaa1d23b3058656f03eee?accountId=0&u=0&success=true&authUUID=DnKd47BtRqCBW3jRB%2FnfFg%3D%3D',
    category: 'design',
    icon:     'monitor',
  },
  {
    name:     'The AI-Driven Product Designer',
    issuer:   'LinkedIn Learning',
    badge:    'Certificate',
    status:   'Completed',
    href:     'https://www.linkedin.com/learning/certificates/f9187b40b4998e98e40b24a97328d6a570375a2d03effd200b5090668bfce181?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3BtbUX4382RAaqlzFlm30RqA%3D%3D',
    category: 'ai',
    icon:     'monitor',
  },
  {
    name:     'How to Design with AI',
    issuer:   'adplist.org',
    badge:    'Certificate',
    status:   'Completed',
    href:     'https://media.licdn.com/dms/image/v2/D562DAQH4vJaJOVSDjA/profile-treasury-image-shrink_800_800/B56ZrgW3T.MMAY-/0/1764700683161?e=1778104800&v=beta&t=QWLEhipPASpNbxDKqpP_2jisRXWd7pRAPDt3nKIjC4M',
    category: 'ai',
    icon:     'monitor',
  },
  {
    name:     'Performing User Experience Aduits',
    issuer:   'LinkedIn Learning',
    badge:    'Certificate',
    status:   'Completed',
    href:     'https://www.linkedin.com/learning/certificates/7a2acbc33ea533d750637fc2d2b3d1ac9623ca28b10f9dd26bc04da46632b795?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3BiFA%2BiS%2FwQ%2F%2BGWenjklIcBQ%3D%3D',
    category: 'design',
    icon:     'monitor',
  },
   {
    name:     'HTML Essential Training',
    issuer:   'LinkedIn Learning',
    badge:    'Certificate',
    status:   'Completed',
    href:     'https://www.linkedin.com/learning/certificates/dde68c015745c9fff368a4674ff3e8a241c1a8621876dda15884b801ba6b65b8?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3BiFA%2BiS%2FwQ%2F%2BGWenjklIcBQ%3D%3D',
    category: 'frontend',
    icon:     'code',
  },
  {
    name:     'Professional Scrum Master I (PSM I)',
    issuer:   'Scrum.org',
    badge:    'Certificate',
    status:   'Completed',
    href:     'https://scrum.org/certificates/1020011',
    category: 'pm',
    icon:     'person',
  },
  {
    name:     'Conversation Design: Practical Tips for AI Design',
    issuer:   'IxDF - Interaction Design Foundation',
    badge:    'Certificate',
    status:   'Completed',
    href:     'https://www.interaction-design.org/certificates/masterclass/mcc_73b382d7293949f9bcee488210176285/large',
    category: 'ai',
    icon:     'monitor',
  },

];
