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
  braces:  'M1.114 8.063V7.9c1.005-.102 1.497-.615 1.497-1.6V4.503c0-1.094.39-1.538 1.354-1.538h.273V2h-.376C2.25 2 1.49 2.759 1.49 4.352v1.524c0 1.094-.376 1.456-1.49 1.456v1.299c1.114 0 1.49.362 1.49 1.456v1.524c0 1.593.759 2.352 2.372 2.352h.376v-.964h-.273c-.964 0-1.354-.444-1.354-1.538V9.663c0-.984-.492-1.497-1.497-1.6M14.886 7.9v.164c-1.005.103-1.497.616-1.497 1.6v1.798c0 1.094-.39 1.538-1.354 1.538h-.273v.964h.376c1.613 0 2.372-.759 2.372-2.352v-1.524c0-1.094.376-1.456 1.49-1.456v-1.3c-1.114 0-1.49-.362-1.49-1.456V4.352C14.51 2.759 13.75 2 12.138 2h-.376v.964h.273c.964 0 1.354.444 1.354 1.538V6.3c0 .984.492 1.497 1.497 1.6M7.5 11.5V9.207l-1.621 1.621-.707-.707L6.792 8.5H4.5v-1h2.293L5.172 5.879l.707-.707L7.5 6.792V4.5h1v2.293l1.621-1.621.707.707L9.208 7.5H11.5v1H9.207l1.621 1.621-.707.707L8.5 9.208V11.5z',
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
    icon:     'braces',
  },
  {
    name:     'How to Design with AI',
    issuer:   'adplist.org',
    badge:    'Certificate',
    status:   'Completed',
    href:     'https://media.licdn.com/dms/image/v2/D562DAQH4vJaJOVSDjA/profile-treasury-image-shrink_800_800/B56ZrgW3T.MMAY-/0/1764700683161?e=1778104800&v=beta&t=QWLEhipPASpNbxDKqpP_2jisRXWd7pRAPDt3nKIjC4M',
    category: 'ai',
    icon:     'braces',
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
    icon:     'braces',
  },

];
