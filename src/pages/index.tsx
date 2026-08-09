import Head from '@docusaurus/Head'
import Link from '@docusaurus/Link'
import Layout from '@theme/Layout'
import {
  Activity,
  ArrowRight,
  Blocks,
  Bot,
  BrainCircuit,
  Check,
  Cloud,
  Code2,
  Database,
  GitBranch,
  Network,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Telescope,
  Terminal,
  Workflow,
  Zap,
} from 'lucide-react'
import type { ReactNode } from 'react'
import styles from './index.module.css'

const capabilities = [
  {
    icon: Bot,
    title: 'Agents',
    description: 'Define typed agents with instructions, models, tools, and runtime behavior in one place.',
    href: '/docs/agents/overview',
  },
  {
    icon: Workflow,
    title: 'Workflows',
    description: 'Compose typed steps, branches, retries, and human approval into durable workflows.',
    href: '/docs/workflows/overview',
  },
  {
    icon: BrainCircuit,
    title: 'Memory',
    description: 'Give agents durable context with conversation history, semantic recall, and observational memory.',
    href: '/docs/memory/overview',
  },
  {
    icon: Network,
    title: 'MCP',
    description: 'Connect agents to external tools and publish your own Model Context Protocol servers.',
    href: '/docs/mcp/overview',
  },
  {
    icon: Telescope,
    title: 'Observability',
    description: 'Inspect model calls, tool calls, costs, latency, and execution paths from one trace.',
    href: '/docs/observability/overview',
  },
  {
    icon: Cloud,
    title: 'Deployment',
    description: 'Run Mastra as a standalone server or deploy it with the platform and adapters you already use.',
    href: '/docs/deployment/overview',
  },
]

const useCases = [
  {
    icon: Blocks,
    eyebrow: 'For product teams',
    title: 'Customer-facing agents',
    description: 'Answer questions, complete tasks, stream structured UI, and hand users back to your product flows.',
    links: [
      { label: 'Agent overview', href: '/docs/agents/overview' },
      { label: 'Streaming', href: '/guides/concepts/streaming' },
    ],
  },
  {
    icon: GitBranch,
    eyebrow: 'For operations teams',
    title: 'Internal automation',
    description: 'Connect tools and business systems, then coordinate repeatable work with explicit workflow control.',
    links: [
      { label: 'Workflow overview', href: '/docs/workflows/overview' },
      { label: 'Tools and MCP', href: '/docs/mcp/overview' },
    ],
  },
  {
    icon: ServerCog,
    eyebrow: 'For platform teams',
    title: 'Agent infrastructure',
    description: 'Offer shared agent primitives with server APIs, model routing, storage, evals, and observability.',
    links: [
      { label: 'Mastra server', href: '/docs/server/mastra-server' },
      { label: 'Model providers', href: '/models' },
    ],
  },
]

const resources = [
  {
    icon: Zap,
    label: 'Quickstart',
    description: 'Create and run your first Mastra agent.',
    href: '/guides/getting-started/quickstart',
  },
  {
    icon: Code2,
    label: 'Guides and examples',
    description: 'Start from working agent and workflow patterns.',
    href: '/guides',
  },
  {
    icon: Sparkles,
    label: 'Learn Mastra',
    description: 'Follow the course from fundamentals to production.',
    href: '/learn',
  },
  {
    icon: GitBranch,
    label: 'Latest releases',
    description: 'See what changed in the current Mastra release.',
    href: 'https://github.com/mastra-ai/mastra/releases',
    external: true,
  },
]

const faqs = [
  {
    question: 'What is Mastra?',
    answer:
      'Mastra is an open-source TypeScript framework for building AI applications and agents. It includes agents, workflows, memory, model routing, evaluation, observability, and deployment tools.',
  },
  {
    question: 'Can Mastra run in an existing TypeScript application?',
    answer:
      'Yes. Use Mastra inside Node.js and web framework projects, or run it as a standalone server. The same agent and workflow definitions can move from local development to production.',
  },
  {
    question: 'Which AI models does Mastra support?',
    answer:
      'Mastra provides a standard model interface across major providers and gateways. Open the model directory to browse the current provider and model documentation.',
  },
  {
    question: 'How do I debug an agent run?',
    answer:
      'Mastra records traces for model calls, tool calls, workflows, and handoffs. Use Studio during development and observability integrations in production.',
  },
  {
    question: 'Is Mastra open source?',
    answer:
      'Yes. The framework and this documentation are developed in the public mastra-ai/mastra GitHub repository under the Apache 2.0 license.',
  },
]

function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className={styles.arrowLink} to={href}>
      {children}
      <ArrowRight aria-hidden="true" size={16} />
    </Link>
  )
}

function ProductPreview() {
  return (
    <div className={styles.productPreview} aria-label="Mastra development and observability preview">
      <div className={styles.previewTopbar}>
        <div className={styles.trafficLights} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className={styles.previewTitle}>mastra-project</div>
        <div className={styles.previewStatus}>
          <span /> running
        </div>
      </div>
      <div className={styles.previewBody}>
        <div className={styles.previewSidebar}>
          <div className={styles.previewSidebarLabel}>Workspace</div>
          <div className={styles.previewNavActive}>
            <Bot aria-hidden="true" size={15} /> Agents
          </div>
          <div className={styles.previewNavItem}>
            <Terminal aria-hidden="true" size={15} /> Tools
          </div>
          <div className={styles.previewNavItem}>
            <Workflow aria-hidden="true" size={15} /> Workflows
          </div>
          <div className={styles.previewNavItem}>
            <Database aria-hidden="true" size={15} /> Memory
          </div>
          <div className={styles.previewDivider} />
          <div className={styles.previewSidebarLabel}>Observe</div>
          <div className={styles.previewNavItem}>
            <Activity aria-hidden="true" size={15} /> Traces
          </div>
          <div className={styles.previewNavItem}>
            <ShieldCheck aria-hidden="true" size={15} /> Evals
          </div>
        </div>
        <div className={styles.tracePanel}>
          <div className={styles.traceHeader}>
            <div>
              <span className={styles.traceEyebrow}>Agent run</span>
              <strong>research-assistant</strong>
            </div>
            <span className={styles.traceSuccess}>
              <Check aria-hidden="true" size={13} /> completed
            </span>
          </div>
          <div className={styles.traceTimeline}>
            <div className={styles.traceRow}>
              <span className={styles.traceIconPurple}>
                <Bot aria-hidden="true" size={15} />
              </span>
              <div>
                <strong>Agent started</strong>
                <small>Instructions and memory loaded</small>
              </div>
              <code>18ms</code>
            </div>
            <div className={styles.traceRow}>
              <span className={styles.traceIconOrange}>
                <Sparkles aria-hidden="true" size={15} />
              </span>
              <div>
                <strong>Model generation</strong>
                <small>Selected tools and planned the response</small>
              </div>
              <code>842ms</code>
            </div>
            <div className={styles.traceRow}>
              <span className={styles.traceIconBlue}>
                <Terminal aria-hidden="true" size={15} />
              </span>
              <div>
                <strong>searchDocs</strong>
                <small>3 relevant documents returned</small>
              </div>
              <code>126ms</code>
            </div>
            <div className={styles.traceRow}>
              <span className={styles.traceIconGreen}>
                <Check aria-hidden="true" size={15} />
              </span>
              <div>
                <strong>Response completed</strong>
                <small>Trace, tokens, and score recorded</small>
              </div>
              <code>1.2s</code>
            </div>
          </div>
          <div className={styles.metricsRow}>
            <span><small>Tokens</small><strong>1,284</strong></span>
            <span><small>Tool calls</small><strong>1</strong></span>
            <span><small>Score</small><strong>0.94</strong></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Build AI agents"
      description="Build, observe, and improve production AI agents with Mastra, the open-source TypeScript agent framework."
      noFooter
      wrapperClassName={styles.layout}
    >
      <Head>
        <meta property="og:title" content="Build AI agents with Mastra" />
        <meta
          property="og:description"
          content="The open-source TypeScript framework for building, observing, and improving production AI agents."
        />
      </Head>

      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={styles.container}>
            <div className={styles.heroCopy}>
              <Link className={styles.eyebrow} to="https://github.com/mastra-ai/mastra">
                <span className={styles.eyebrowDot} />
                Open-source TypeScript agent framework
                <ArrowRight aria-hidden="true" size={14} />
              </Link>
              <h1>Build AI agents that work in production</h1>
              <p>
                Build, observe, and improve agents that can run for days. Mastra gives TypeScript teams one framework
                for agents, workflows, memory, evals, and deployment.
              </p>
              <div className={styles.heroActions}>
                <Link className={styles.primaryButton} to="/guides/getting-started/quickstart">
                  Start building <ArrowRight aria-hidden="true" size={17} />
                </Link>
                <Link className={styles.secondaryButton} to="/docs">
                  Read the docs
                </Link>
              </div>
              <div className={styles.installCommand}>
                <Terminal aria-hidden="true" size={16} />
                <code>npm create mastra@latest</code>
                <span>Get a working project in minutes</span>
              </div>
            </div>
            <ProductPreview />
          </div>
        </section>

        <section className={styles.trustStrip} aria-label="Teams using Mastra">
          <div className={styles.container}>
            <p>Built for teams shipping real agent systems</p>
            <div className={styles.logoCloud} aria-label="Selected Mastra customers">
              <span>Replit</span>
              <span>Sanity</span>
              <span>WorkOS</span>
              <span>MongoDB</span>
              <span>PayPal</span>
              <span>SoftBank</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <span className={styles.kicker}>Framework</span>
              <h2>Everything an agent needs, in one TypeScript stack</h2>
              <p>Start with one agent. Add control, context, tools, and production visibility without changing stacks.</p>
            </div>
            <div className={styles.capabilityGrid}>
              {capabilities.map(({ icon: Icon, title, description, href }) => (
                <Link className={styles.capabilityCard} to={href} key={title}>
                  <span className={styles.cardIcon}><Icon aria-hidden="true" size={20} /></span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <span className={styles.cardLink}>Explore {title.toLowerCase()} <ArrowRight aria-hidden="true" size={15} /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.splitSection}>
          <div className={styles.container}>
            <div className={styles.splitGrid}>
              <div className={styles.splitCopy}>
                <span className={styles.kicker}>Build with code</span>
                <h2>Typed from the first prompt to the final tool call</h2>
                <p>
                  Define an agent with the same language, package manager, schemas, and deployment workflow your team
                  already uses.
                </p>
                <ul className={styles.checkList}>
                  <li><Check aria-hidden="true" size={15} /> Typed inputs and structured outputs</li>
                  <li><Check aria-hidden="true" size={15} /> Provider-independent model routing</li>
                  <li><Check aria-hidden="true" size={15} /> Built-in tools, memory, and workflows</li>
                </ul>
                <ArrowLink href="/docs/agents/overview">Explore agents</ArrowLink>
              </div>
              <div className={styles.codeWindow}>
                <div className={styles.codeHeader}>
                  <span>src/mastra/agents/assistant.ts</span>
                  <span>TypeScript</span>
                </div>
                <pre aria-label="Mastra agent TypeScript example"><code><span className={styles.codePink}>import</span>{' { Agent } '}<span className={styles.codePink}>from</span> <span className={styles.codeGreen}>'@mastra/core/agent'</span>{'\n\n'}<span className={styles.codePink}>export const</span>{' assistant = '}<span className={styles.codePurple}>new</span>{' Agent({\n  '}<span className={styles.codeBlue}>id</span>{': '}<span className={styles.codeGreen}>'assistant'</span>{',\n  '}<span className={styles.codeBlue}>name</span>{': '}<span className={styles.codeGreen}>'Assistant'</span>{',\n  '}<span className={styles.codeBlue}>instructions</span>{': '}<span className={styles.codeGreen}>'Help users complete their work.'</span>{',\n  '}<span className={styles.codeBlue}>model</span>{': process.env.MODEL,\n  '}<span className={styles.codeBlue}>tools</span>{': { searchDocs },\n})'}</code></pre>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.observabilitySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <span className={styles.kicker}>Observe and improve</span>
              <h2>See what every agent is doing</h2>
              <p>Trace each model call and tool decision, evaluate results, and turn production feedback into better behavior.</p>
            </div>
            <div className={styles.observabilityGrid}>
              <div className={styles.observabilityVisual} aria-hidden="true">
                <div className={styles.chartHeader}><span>Agent quality</span><strong>94.2%</strong></div>
                <div className={styles.chart}>
                  {[38, 52, 47, 66, 62, 74, 71, 88, 84, 94].map((height, index) => (
                    <span key={index} style={{ height: `${height}%` }} />
                  ))}
                </div>
                <div className={styles.chartLegend}><span>7 days ago</span><span>Today</span></div>
              </div>
              <div className={styles.observeCards}>
                <Link to="/docs/observability/overview">
                  <Activity aria-hidden="true" size={19} />
                  <div><strong>Traces and metrics</strong><span>Inspect execution, latency, cost, and tool usage.</span></div>
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
                <Link to="/docs/evals/overview">
                  <ShieldCheck aria-hidden="true" size={19} />
                  <div><strong>Evals and scorers</strong><span>Run repeatable checks before and after deployment.</span></div>
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
                <Link to="/docs/studio/overview">
                  <Terminal aria-hidden="true" size={19} />
                  <div><strong>Local Studio</strong><span>Test agents, workflows, tools, and datasets as you build.</span></div>
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <span className={styles.kicker}>Use cases</span>
              <h2>One framework across the company</h2>
            </div>
            <div className={styles.useCaseGrid}>
              {useCases.map(({ icon: Icon, eyebrow, title, description, links }) => (
                <article className={styles.useCaseCard} key={title}>
                  <div className={styles.useCaseHeader}>
                    <span className={styles.cardIcon}><Icon aria-hidden="true" size={20} /></span>
                    <span>{eyebrow}</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <div className={styles.useCaseLinks}>
                    {links.map(link => <ArrowLink href={link.href} key={link.href}>{link.label}</ArrowLink>)}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.resourceSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeadingInline}>
              <div>
                <span className={styles.kicker}>Resources</span>
                <h2>Go from idea to working agent</h2>
              </div>
              <ArrowLink href="/docs">Browse all documentation</ArrowLink>
            </div>
            <div className={styles.resourceGrid}>
              {resources.map(({ icon: Icon, label, description, href, external }) => (
                <Link className={styles.resourceCard} to={href} key={label} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
                  <Icon aria-hidden="true" size={20} />
                  <strong>{label}</strong>
                  <span>{description}</span>
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.faqSection}>
          <div className={styles.container}>
            <div className={styles.faqGrid}>
              <div className={styles.faqIntro}>
                <span className={styles.kicker}>FAQ</span>
                <h2>Frequently asked questions</h2>
                <p>Find implementation details in the current official documentation included with this site.</p>
                <ArrowLink href="/docs">Open documentation</ArrowLink>
              </div>
              <div className={styles.faqList}>
                {faqs.map((faq, index) => (
                  <details key={faq.question} open={index === 0}>
                    <summary>{faq.question}<span aria-hidden="true">+</span></summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.finalCta}>
          <div className={styles.finalGlow} aria-hidden="true" />
          <div className={styles.container}>
            <span className={styles.kicker}>Start building</span>
            <h2>Ship your first Mastra agent today</h2>
            <p>Start locally, inspect every run, and deploy with the same TypeScript project.</p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryButton} to="/guides/getting-started/quickstart">Open the quickstart <ArrowRight aria-hidden="true" size={17} /></Link>
              <a className={styles.secondaryButton} href="https://projects.mastra.ai/get-started">Create a platform project</a>
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.container}>
            <div className={styles.footerTop}>
              <div className={styles.footerBrand}>
                <strong>mastra</strong>
                <span>The TypeScript agent framework.</span>
              </div>
              <nav className={styles.footerLinks} aria-label="Footer navigation">
                <div><strong>Framework</strong><Link to="/docs/agents/overview">Agents</Link><Link to="/docs/workflows/overview">Workflows</Link><Link to="/docs/memory/overview">Memory</Link><Link to="/docs/observability/overview">Observability</Link></div>
                <div><strong>Developers</strong><Link to="/docs">Docs</Link><Link to="/models">Models</Link><Link to="/reference">API reference</Link><Link to="/learn">Course</Link></div>
                <div><strong>Community</strong><a href="https://github.com/mastra-ai/mastra">GitHub</a><a href="https://discord.gg/BTYqqHKUrf">Discord</a><a href="https://www.youtube.com/@mastra-ai">YouTube</a><a href="https://x.com/mastra">X</a></div>
              </nav>
            </div>
            <div className={styles.footerBottom}>
              <span>Latest official documentation, synced from mastra-ai/mastra.</span>
              <a href="#top">Back to top ↑</a>
            </div>
          </div>
        </footer>
      </main>
    </Layout>
  )
}
