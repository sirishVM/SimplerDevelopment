// Server Component. The homepage is almost entirely static presentation, so it
// renders on the server with ZERO hydration — the only interactive piece is the
// WebGL starfield, which is isolated behind its own client gate. This is what
// keeps mobile TBT low and the hero LCP off the hydration critical path.
// (Previously this whole file was 'use client', which hydrated ~760 DOM nodes
// and pushed mobile LCP render-delay to ~5s. Don't reintroduce that.)
//
// Skinned in the retro-future design system — see components/retro/. Copy tone
// is mid-century mission-control: confident and a bit wry, never cute at the
// expense of being clear about what the product actually is.
//
// The page is a sequence of full-bleed bands alternating cream and ink, and
// each band makes exactly ONE claim. They are listed in components/retro/
// home-sections.tsx; the short version is breadth → inventory → proof →
// agent-operable → licence → terms. Adding a band that repeats a neighbour's
// claim is the failure mode to watch for: an earlier draft had three
// consecutive sections all arguing "it shares one database", which read as one
// point made three times and made the page feel longer than it was.

import Link from 'next/link';
import type { BlogPostWithRelations } from '@/lib/actions/blog';
import { siteConfig } from '@/config/site';
import { RetroHero, CTABanner, CreamBand } from '@/components/retro/sections';
import {
  SectionHeading,
  RetroButton,
  RetroBadge,
  StatBlock,
  InkPanel,
  OrbitDivider,
  Star,
} from '@/components/retro/primitives';
import {
  CrewLanes,
  ModuleManifest,
  MissionControl,
  SignalBand,
  LicencePlate,
  type CrewLane,
  type ManifestModule,
  type SupportPoint,
} from '@/components/retro/home-sections';

// Public source of truth for the self-host path — mirrors config/site.ts so
// every GitHub CTA on this page resolves to the same canonical repo.
const GITHUB_URL = siteConfig.links.github;

// The 18 platform modules — these are the real, shipping modules of the
// platform, and every `href` is a slug that exists in lib/data/solutions.ts.
// Descriptions stay factual; the retro voice lives in the headings and
// connective copy around them, not in claims about what the software does.
//
// The 18 platform modules — these are the modules of the platform.
// The 4 currently live modules (Company Brain, AI Connect MCP, AI Chatbot, and
// Help Desk) lead the manifest with "Available Now" badges, while the remaining
// 14 are tagged "Coming Soon".
const leadModules: ManifestModule[] = [
  {
    title: 'Company Brain',
    description: 'AI knowledge base (RAG over pgvector) that answers questions about your business with citations',
    href: '/solutions/company-brain',
    tag: 'Available Now',
    status: 'available',
  },
  {
    title: 'AI Connect (MCP)',
    description: 'Connect any MCP client and operate the whole platform via 200+ scoped tools',
    href: '/solutions/ai-connect',
    tag: 'Available Now',
    status: 'available',
  },
  {
    title: 'AI Chatbot',
    description: 'Trained on your content for 24/7 customer support and automated lead capture',
    href: '/solutions/ai-chatbot',
    tag: 'Available Now',
    status: 'available',
  },
  {
    title: 'Help Desk',
    description: 'Embeddable live chat plus a shared team inbox and SLA-tracked support tickets',
    href: '/solutions/help-desk',
    tag: 'Available Now',
    status: 'available',
  },
];

const restModules: ManifestModule[] = [
  { title: 'Website Builder', description: 'Drag-and-drop editor with unlimited pages, blog, SEO, and ecommerce', href: '/solutions/websites', status: 'coming_soon' },
  { title: 'Online Store', description: 'Sell products with variants, discounts, shipping, and print-on-demand designs', href: '/solutions/ecommerce', status: 'coming_soon' },
  { title: 'Content Calendar', description: 'Editorial kanban and calendar to plan, schedule, and ship content across channels', href: '/solutions/publishing', status: 'coming_soon' },
  { title: 'Email Marketing', description: 'Campaigns, subscriber lists, automations, and engagement tracking', href: '/solutions/email-marketing', status: 'coming_soon' },
  { title: 'CRM', description: 'Contacts, deals, proposals, and your full sales pipeline', href: '/solutions/crm', status: 'coming_soon' },
  { title: 'Contracts & E-Sign', description: 'Branded proposals and legally binding contracts with built-in e-signature', href: '/solutions/contracts', status: 'coming_soon' },
  { title: 'Online Booking', description: 'Scheduling pages with calendar sync and automatic reminders', href: '/solutions/booking', status: 'coming_soon' },
  { title: 'Surveys & Forms', description: 'Smart forms with branching logic, scoring, and auto-routing to your CRM', href: '/solutions/surveys', status: 'coming_soon' },
  { title: 'A/B Experiments', description: 'Split-test pages and pitch deck slides with built-in significance testing', href: '/solutions/experiments', status: 'coming_soon' },
  { title: 'Project Management', description: 'Kanban boards, sprint planning, and team collaboration', href: '/solutions/project-management', status: 'coming_soon' },
  { title: 'Automations', description: 'Visual no-code workflows that connect every tool automatically', href: '/solutions/automations', status: 'coming_soon' },
  { title: 'Pitch Decks', description: 'AI-generated, branded pitch decks with shareable links and PDF export', href: '/solutions/pitch-decks', status: 'coming_soon' },
  { title: 'Agency & White-Label', description: 'Run the platform under your own brand with a custom domain and logo', href: '/solutions/agency', status: 'coming_soon' },
  { title: 'Managed Hosting', description: 'SSL, CDN, daily backups, and 99.9% uptime — or self-host it yourself', href: '/solutions/hosting', status: 'coming_soon' },
];

// The five verbs below are the five lane titles, in lane order. Keep them in
// step with the section lede — an earlier draft said "remembers" where the lane
// said "Know", and the list stopped reading as a key to the row beneath it.
// Art is named for the LANE, not the character, so a reassignment is a file
// replacement rather than a rename hunt through the codebase.
//
// Each figure is picked so the prop matches the work, and so the row reads as
// distinct individuals rather than one archetype recoloured:
//   Sell      headset and tablet — a call in progress, which is the job
//   Ship      rolled plans and a pen — you draw it before you build it
//   Serve     a service robot with a checklist, not a person: the honest
//             illustration for the lane that includes a chatbot answering at 2am
//   Know      tablet and stylus — reading back what the company already knows
//   Automate  a laptop running a launch — the thing that goes without you
//
// Frame convention, if a lane's art is ever re-cut: 600x900 canvas, figure
// trimmed on an alpha>32 bbox (the sources carry a faint glow that alpha>0
// would keep), scaled to ~780-800px tall, centred near x=300 with the feet
// landing around y=830. Matching it matters — the lanes sit in one row, and a
// figure standing on a different baseline reads as a mistake.
const crewLanes: CrewLane[] = [
  { title: 'Sell', art: 'crew-sell', blurb: 'CRM, deals, proposals and contracts with e-signature built in.' },
  { title: 'Ship', art: 'crew-ship', blurb: 'Sites, storefront and an editorial calendar on one visual editor.' },
  { title: 'Serve', art: 'crew-serve', blurb: 'Live chat, a shared inbox, SLA-tracked tickets and booking pages.' },
  { title: 'Know', art: 'crew-know', blurb: 'Company Brain answers from your own content, with citations.' },
  { title: 'Automate', art: 'crew-automate', blurb: 'Visual workflows, plus 200+ MCP tools any agent can drive.' },
];

const heroMetrics = [
  { value: '200+', label: 'MCP tools' },
  { value: '18', label: 'modules in one' },
  { value: '99.9%', label: 'uptime' },
  { value: 'Cloud', label: '& dedicated' },
];

const licenceSupport: SupportPoint[] = [
  {
    title: 'Cloud & dedicated setup',
    art: 'observatory',
    body: (
      <>
        Built on high-performance Postgres + pgvector infrastructure, optimized for speed, reliability, and security.
      </>
    ),
  },
  {
    title: 'AI-operable by design',
    art: 'robot',
    body: '200+ scoped MCP tools span the whole platform — build a site or run a campaign by talking to an agent.',
  },
  {
    title: 'Engineered to grow with you',
    art: 'satellite',
    body: 'Every module, workflow, and integration is designed to adapt as your business expands without vendor lock-in.',
  },
];

// Real commercial terms.
const deploymentTiers = [
  {
    name: 'Starter',
    price: 'Free',
    priceNote: 'get started immediately',
    blurb: 'For solo founders and agile teams getting started.',
    points: ['Websites & e-commerce builder', 'CRM & lead pipelines', 'Company Brain knowledge base', 'Email & notification campaigns'],
    cta: { label: 'Get Started', href: '/portal/signup', external: false },
    highlight: false,
  },
  {
    name: 'Growth',
    price: 'Contact us',
    priceNote: 'tailored to your scale',
    blurb: 'We run the platform. You fly the mission.',
    points: ['Everything in Starter', 'SSL, CDN & daily backups', '200+ AI MCP tools', 'Priority team support'],
    cta: { label: 'Contact Us', href: '/contact', external: false },
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    priceNote: 'done-for-you + SLA',
    blurb: 'Your badge on the hull, our engineers in the hangar.',
    points: ['Everything in Growth', 'White-label + custom domain', 'SSO & priority SLA', 'Dedicated custom integrations'],
    cta: { label: 'Talk to us', href: '/contact', external: false },
    highlight: false,
  },
];

export function HomeClient({ recentPosts = [] }: { recentPosts?: BlogPostWithRelations[] }) {
  return (
    <div className="retro retro-paper">
      <RetroHero
        eyebrow="Intelligent Business OS"
        title="Run Your Entire Business."
        accent="One Platform."
        subtitle={
          <>
            Company Brain, AI Connect (MCP), AI Chatbot, and Help Desk — four integrated modules
            available now, with fourteen more modules actively in development.
          </>
        }
        primary={{ href: '/portal/signup', label: 'Get Started Free' }}
        secondary={{ href: '/portal/login', label: 'Sign In' }}
        video
        footnote={
          <>
            <span>★ 4 Modules Live Now</span>
            <span>★ 200+ AI Tools</span>
            <span>★ 14 In Development</span>
          </>
        }
      />

      {/* Metrics strip */}
      <CreamBand className="!py-10">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {heroMetrics.map((m) => (
            <StatBlock key={m.label} value={m.value} label={m.label} />
          ))}
        </div>
      </CreamBand>

      {/* Claim: breadth — how much of the job this covers. */}
      <InkPanel>
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <SectionHeading
            eyebrow="What the work actually is"
            title="The Whole Job. Not A Slice Of It."
            subtitle="Sell, ship, serve, know, automate: a modern business does all five. Most tools pick one of them and leave you to go shopping for the other four."
            onDark
          />
          <CrewLanes lanes={crewLanes} />
        </div>
      </InkPanel>

      <OrbitDivider />

      {/* Claim: 4 modules available now, 14 coming soon. */}
      <CreamBand>
        <SectionHeading
          eyebrow="Systems manifest"
          title="18 Integrated Modules — 4 Available Now."
          subtitle="Company Brain, AI Connect (MCP), AI Chatbot, and Help Desk are live and ready to use today. Fourteen additional modules are rolling out next."
        />
        <ModuleManifest lead={leadModules} rest={restModules} />
      </CreamBand>

      <OrbitDivider />

      {/* Claim: one database, and here is the receipt. Cream band on purpose —
          the console frame supplies its own darkness. */}
      <CreamBand className="!pt-0">
        <SectionHeading
          eyebrow="Mission control"
          title="One Screen For All Eighteen."
          subtitle="One database underneath, so a deal, a contract, a deploy and a support ticket arrive in the same stream. Nothing on this screen is stitched together at render time."
        />
        <MissionControl />
      </CreamBand>

      {/* Claim: a person is not the only thing that can drive it.
          overflow-hidden is required, not cosmetic: SignalBand anchors the
          ground station to this band's bottom-right corner with negative
          offsets, and without the clip it spills into the next section. */}
      <InkPanel className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <SignalBand
            chips={['Websites', 'CRM', 'Kanban', 'Email', 'Store', 'Brain', 'Bookings', 'Decks', 'Surveys']}
          >
            <SectionHeading
              eyebrow="AI Connect · MCP"
              title="Point An Agent At It And Talk."
              subtitle="Connect any MCP client and operate the platform through 200+ scoped tools. Build a page, move a deal, schedule a campaign. The same permissions apply whether a person clicks it or an agent calls it."
              align="left"
              onDark
            />
          </SignalBand>
        </div>
      </InkPanel>

      {/* Platform Architecture & Infrastructure */}
      <CreamBand>
        <SectionHeading
          eyebrow="Built for reliability"
          title="Enterprise-Grade Architecture."
          subtitle="Engineered from the ground up for modern businesses, agencies, and solo founders."
        />
        <LicencePlate
          claim={
            <>
              Hatrio OS.
              <br />
              The Whole Stack.
            </>
          }
          body="Deploy for your business or clients, manage multiple websites, automate CRM workflows, and connect AI agents without dealing with fragmented SaaS subscriptions."
          support={licenceSupport}
        />
      </CreamBand>

      {/* Deployment tiers. */}
      <CreamBand>
        <SectionHeading
          eyebrow="Choose your plan"
          title="Start Free. Or Let Us Scale It."
          subtitle="Everything you need to launch and operate your entire business in one place."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {deploymentTiers.map((t) => (
            <div
              key={t.name}
              className={`flex flex-col rounded-md border p-7 ${
                t.highlight
                  ? 'border-[var(--retro-orange)] bg-[color-mix(in_srgb,var(--retro-gold)_14%,var(--retro-cream))]'
                  : 'border-[color-mix(in_srgb,var(--retro-mid)_35%,transparent)] bg-[var(--retro-cream)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold">{t.name}</h3>
                {t.highlight && <RetroBadge tone="orange">Most picked</RetroBadge>}
              </div>
              <div className="font-display mt-4 text-3xl font-extrabold text-[var(--retro-ink)]">{t.price}</div>
              <div className="text-xs text-[color-mix(in_srgb,var(--retro-ink)_60%,transparent)]">{t.priceNote}</div>
              <p className="mt-4 text-sm text-[color-mix(in_srgb,var(--retro-ink)_78%,transparent)]">{t.blurb}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {t.points.map((pt) => (
                  <li key={pt} className="flex gap-2">
                    <Star className="mt-1 h-3 w-3 shrink-0 text-[var(--retro-gold)]" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                {t.cta.external ? (
                  <a
                    href={t.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded border border-[var(--retro-ink)] px-5 py-3 text-sm font-bold hover:bg-[color-mix(in_srgb,var(--retro-gold)_22%,var(--retro-cream))]"
                  >
                    {t.cta.label} →
                  </a>
                ) : (
                  <RetroButton href={t.cta.href} variant={t.highlight ? 'primary' : 'secondary'} className="w-full">
                    {t.cta.label}
                  </RetroButton>
                )}
              </div>
            </div>
          ))}
        </div>
      </CreamBand>

      {/* Blog — real posts, real slugs. */}
      {recentPosts.length > 0 && (
        <CreamBand className="!pt-0">
          <SectionHeading eyebrow="From the flight log" title="Dispatches" align="left" />
          <div className="grid gap-5 md:grid-cols-3">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="flex h-full flex-col rounded-md border border-[color-mix(in_srgb,var(--retro-mid)_35%,transparent)] bg-[var(--retro-cream)] p-6 hover:border-[var(--retro-mid)]"
              >
                <h3 className="font-display text-base font-bold leading-snug">{post.title}</h3>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-3 text-sm text-[color-mix(in_srgb,var(--retro-ink)_75%,transparent)]">
                    {post.excerpt}
                  </p>
                )}
                <span className="mt-auto pt-4 text-sm font-bold text-[var(--retro-orange)]">Read it →</span>
              </Link>
            ))}
          </div>
        </CreamBand>
      )}

      <CTABanner
        title="Ready To Launch Something Great?"
        subtitle="Start free today, or let our team onboard and scale your system with you."
        primary={{ href: '/portal/signup', label: 'Start Free' }}
        secondary={{ href: '/contact', label: 'Talk To Us' }}
        art="rocket"
      />
    </div>
  );
}
