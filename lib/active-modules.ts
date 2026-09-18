/**
 * Master Active Modules Allowlist
 *
 * Single source of truth for which modules are currently enabled across the
 * platform (Sidebar, Dashboard Widgets, Onboarding, and Solutions).
 *
 * HOW TO TURN A MODULE ON OR OFF:
 * Simply add or remove (uncomment/comment) its name in ACTIVE_MODULES below!
 * You don't need to change any other file.
 */

export const ACTIVE_MODULES: string[] = [
  'company-brain', // 1. Company Brain (knowledge base, playbooks, docs)
  'ai-connect',    // 2. AI Connect (MCP server and tools)
  'ai-chatbot',    // 3. AI Chatbot & live chat inbox
  'help-desk',     // 4. Help Desk & support tickets

  // ── Available modules you can enable at any time: ─────────────────────
  // 'crm',          // CRM, contacts, deals, sales pipeline
  // 'projects',     // Projects & Kanban task management
  // 'websites',     // Websites, visual block editor, CMS
  // 'email',        // Email marketing, campaigns, lists
  // 'publishing',   // Publishing command center & content calendar
  // 'surveys',      // Surveys & smart forms
  // 'pitch-decks',  // AI pitch decks & proposals
  // 'automations',  // Visual automation workflows
  // 'seo',          // SEO intelligence & technical crawler
  // 'ecommerce',    // Online store & products
  // 'billing',      // Invoices & subscriptions
  // 'agency',       // White-label agency branding & custom domain
];

/** Map each module key to its billing/navigation domain keys. */
const MODULE_TO_DOMAINS: Record<string, string[]> = {
  'company-brain': ['brain'],
  'ai-connect': ['ai-connect', 'brain'],
  'ai-chatbot': ['ai-chatbot'],
  'help-desk': ['help-desk'],
  'crm': ['crm'],
  'projects': ['projects'],
  'websites': ['websites'],
  'email': ['email'],
  'publishing': ['publishing'],
  'surveys': ['surveys'],
  'pitch-decks': ['pitch-decks'],
  'automations': ['automations'],
  'seo': ['seo'],
  'ecommerce': ['store'],
  'billing': ['billing', 'invoices'],
  'agency': ['agency'],
};

/** Map each module key to its dashboard solution slugs. */
const MODULE_TO_SOLUTIONS: Record<string, string[]> = {
  'company-brain': ['company-brain'],
  'ai-connect': ['ai-connect'],
  'ai-chatbot': ['ai-chatbot'],
  'help-desk': ['help-desk'],
  'crm': ['crm'],
  'projects': ['project-management'],
  'websites': ['websites'],
  'email': ['email-marketing'],
  'publishing': ['publishing'],
  'surveys': ['surveys'],
  'pitch-decks': ['pitch-decks'],
  'automations': ['automations'],
  'seo': ['seo'],
  'ecommerce': ['ecommerce'],
  'billing': ['invoicing'],
  'agency': ['agency'],
};

export function getActiveDomainKeys(): Set<string> {
  return new Set<string>(ACTIVE_MODULES.flatMap((mod) => MODULE_TO_DOMAINS[mod] ?? [mod]));
}

export function getActiveSolutionSlugs(): Set<string> {
  return new Set<string>(ACTIVE_MODULES.flatMap((mod) => MODULE_TO_SOLUTIONS[mod] ?? [mod]));
}

/**
 * Checks if a given solution slug is currently active.
 */
export function isSolutionActive(solutionSlug: string): boolean {
  return getActiveSolutionSlugs().has(solutionSlug);
}

/**
 * Checks if a given domain key is currently active.
 */
export function isDomainActive(domainKey: string): boolean {
  return getActiveDomainKeys().has(domainKey);
}

/**
 * Checks if a top-level module is active.
 */
export function isModuleActive(moduleName: string): boolean {
  return ACTIVE_MODULES.includes(moduleName);
}
