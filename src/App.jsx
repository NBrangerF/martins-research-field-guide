import { useEffect, useState } from 'react'
import { ArrowRight } from '@phosphor-icons/react/ArrowRight'
import { ArrowUpRight } from '@phosphor-icons/react/ArrowUpRight'
import { BookOpenText } from '@phosphor-icons/react/BookOpenText'
import { CaretDown } from '@phosphor-icons/react/CaretDown'
import { ChartLineUp } from '@phosphor-icons/react/ChartLineUp'
import { Check } from '@phosphor-icons/react/Check'
import { Clipboard } from '@phosphor-icons/react/Clipboard'
import { Code } from '@phosphor-icons/react/Code'
import { Copy } from '@phosphor-icons/react/Copy'
import { FileText } from '@phosphor-icons/react/FileText'
import { Folders } from '@phosphor-icons/react/Folders'
import { GithubLogo } from '@phosphor-icons/react/GithubLogo'
import { GraduationCap } from '@phosphor-icons/react/GraduationCap'
import { List } from '@phosphor-icons/react/List'
import { MagnifyingGlass } from '@phosphor-icons/react/MagnifyingGlass'
import { Moon } from '@phosphor-icons/react/Moon'
import { PencilSimple } from '@phosphor-icons/react/PencilSimple'
import { Question } from '@phosphor-icons/react/Question'
import { RedditLogo } from '@phosphor-icons/react/RedditLogo'
import { Scales } from '@phosphor-icons/react/Scales'
import { ShieldCheck } from '@phosphor-icons/react/ShieldCheck'
import { Sparkle } from '@phosphor-icons/react/Sparkle'
import { Sun } from '@phosphor-icons/react/Sun'
import { X } from '@phosphor-icons/react/X'
import { XLogo } from '@phosphor-icons/react/XLogo'

const prompts = {
  Question: {
    summary: 'Turn a broad interest into a question you can actually answer.',
    reasons: ['Names a clear role', 'Sets a narrow population', 'Asks for choices, not one magic answer'],
    text: `You are a research mentor with experience in education research.

Help me narrow a research question about how formative feedback affects first-year university students.

Before suggesting a final question:
1. Ask me up to five clarifying questions.
2. Offer three focused research questions.
3. Explain what evidence each question would need.
4. Point out terms I still need to define.

Do not write the paper. Help me choose a question I can investigate well.`,
  },
  Sources: {
    summary: 'Build a small source set with different jobs, not a giant pile of links.',
    reasons: ['Defines what counts as credible', 'Asks each source to do a job', 'Makes uncertainty visible'],
    text: `Find recent, credible sources for this question:

How does formative feedback affect first-year university students?

Build a starter set with:
- one overview or review
- one strong empirical study
- one useful critique or counterpoint

For each source, give the full citation, a working link, what it contributes, and one limitation. Verify that every source exists. If you cannot verify something, say so.`,
  },
  Synthesis: {
    summary: 'Compare sources by claim, evidence, and limits before you start writing.',
    reasons: ['Prevents summary-by-summary writing', 'Keeps page references close', 'Surfaces disagreement'],
    text: `Use the sources in this project to build an evidence table.

Columns:
1. Source
2. Research question
3. Method and participants
4. Main finding
5. Evidence for that finding
6. Limitations
7. Page, section, figure, or table reference
8. My cautious takeaway

Then write a short synthesis organized by patterns and disagreements, not one paragraph per paper.`,
  },
  Skeptic: {
    summary: 'Ask Codex to look for what would make your favorite conclusion weaker.',
    reasons: ['Tests the evidence', 'Searches for alternatives', 'Protects against overclaiming'],
    text: `Act as a careful peer reviewer of my evidence table and draft conclusion.

Check for:
- claims that are stronger than the evidence
- missing definitions
- weak or unrepresentative samples
- alternative explanations
- important counterevidence
- citations that do not support the sentence

Return a table with: issue, why it matters, evidence needed, and the smallest honest revision.`,
  },
  Artifact: {
    summary: 'Turn the research trail into something you can inspect and share.',
    reasons: ['Creates a durable file', 'Separates evidence from interpretation', 'Ends with open questions'],
    text: `Create a clear research brief from the materials in this project.

Include:
- the focused research question
- a 150-word answer
- an evidence table
- what the strongest sources agree on
- where they disagree
- what the evidence does not prove
- open questions and next readings

Cite every research claim. Keep claims from sources separate from my interpretation. Save the result as research-brief.md.`,
  },
}

const researchLoop = [
  { title: 'Frame the question', body: 'Get clear on what you want to know, for whom, and why it matters.', icon: Question },
  { title: 'Find the evidence', body: 'Gather sources that speak directly to the question, including a critique.', icon: MagnifyingGlass },
  { title: 'Make sense of it', body: 'Compare patterns, methods, contexts, and what each source leaves unsaid.', icon: Sparkle },
  { title: 'Challenge the claim', body: 'Test assumptions, look for counterevidence, and shrink claims when needed.', icon: Scales },
  { title: 'Make something useful', body: 'Turn the trail into a brief, lesson, literature map, or research plan.', icon: FileText },
]

const caseFilters = ['All', 'Reddit', 'X', 'GitHub']

const fieldCases = [
  {
    title: 'Students turned dense PDFs into source-linked study maps',
    platform: 'Reddit',
    evidence: 'First-person build + public repo',
    date: 'Jan 2026',
    stage: 'Read',
    summary: 'A student team built Get It around Codex CLI after finding ordinary PDF chat too shallow. It extracts concepts, links explanations back to the source, and turns them into quizzes and Feynman-style practice.',
    move: 'Ask Codex to make every explanation point back to the page or section it came from.',
    caution: 'The builders describe their own app. The public code verifies the workflow, not its effect on learning.',
    links: [
      { label: 'Read the Reddit post', href: 'https://www.reddit.com/r/LLMDevs/comments/1u0kod6/opensource_desktop_app_using_codex_cli_as_the_llm/' },
      { label: 'Inspect Get It', href: 'https://github.com/beltromatti/get-it' },
    ],
  },
  {
    title: 'A graduate researcher caught a false positive after an agent analysis',
    platform: 'Reddit',
    evidence: 'First-person field test',
    date: 'Mar 2026',
    stage: 'Analyze',
    summary: 'The researcher gave Codex and another agent the same known experimental dataset in RStudio. Both produced useful analyses, but one initially called a result significant without an adequate multiple-comparison correction.',
    move: 'Predefine diagnostics and corrections, then compare the output with a result you already understand.',
    caution: 'After human intervention, the result became null. This is the clearest reminder in the set that fluent analysis still needs statistical review.',
    links: [{ label: 'Read the field report', href: 'https://www.reddit.com/r/RStudio/comments/1rus9vj/i_gave_claude_code_codex_shared_access_to_a/' }],
  },
  {
    title: 'A Zotero power user used one Codex skill in two papers',
    platform: 'Reddit',
    evidence: 'First-person use + public repo',
    date: 'Apr 2026',
    stage: 'Organize + write',
    summary: 'The creator of zotero-use says they built it around an 8 GB Zotero library and used it while writing two papers. The skill can retrieve references, inspect notes and PDFs, and insert live Zotero citations into a manuscript.',
    move: 'Keep Zotero as the source of truth. Let Codex retrieve and cite from it instead of rebuilding your library in chat.',
    caution: 'This is a creator report, not an independent evaluation. Start with read-only access and inspect every inserted citation.',
    links: [
      { label: 'Read the Reddit post', href: 'https://www.reddit.com/r/zotero/comments/1tl3mo5/zotero_skill_for_codex_and_other_agents/' },
      { label: 'Inspect zotero-use', href: 'https://github.com/drguptavivek/zotero-use' },
    ],
  },
  {
    title: 'A robotics and ML team forked Codex into a literature workspace',
    platform: 'Reddit',
    evidence: 'Team workflow + public repo',
    date: 'Feb 2026',
    stage: 'Discover + synthesize',
    summary: 'The ATA team connected paper search, citation graphs, Zotero notes, paper comparison, and evolving research documents after repeatedly struggling with PDFs and one-off prompts.',
    move: 'Turn a search result into a growing research document, not a disposable answer.',
    caution: 'This is a builder showcase. The repository confirms the features, but it does not independently establish research quality.',
    links: [
      { label: 'Read the Reddit post', href: 'https://www.reddit.com/r/codex/comments/1rem9ai/we_forked_codex_cli_and_turned_it_into_a_full/' },
      { label: 'Inspect ATA', href: 'https://github.com/Agents2AgentsAI/ata' },
    ],
  },
  {
    title: 'One user ran an eight-hour experiment with a durable progress log',
    platform: 'Reddit',
    evidence: 'First-person experiment log',
    date: 'Sep 2025',
    stage: 'Analyze',
    summary: 'A hobby researcher modified Codex CLI for long jobs, automatic continuation, phone notifications, and a PROGRESS.md file. Codex checked data generation and tried several PyTorch models over eight hours.',
    move: 'Make the agent record decisions and failed attempts in a file so the next session can resume honestly.',
    caution: 'Accuracy improved from 0.72 to 0.78 but missed the target. Open-ended metric chasing can overfit unless stopping rules and held-out checks are fixed first.',
    links: [{ label: 'Read Research Mode', href: 'https://www.reddit.com/r/OpenAI/comments/1nkeifi/codexcli_research_mode/' }],
  },
  {
    title: 'A researcher prepared about 30,000 arXiv papers with Codex',
    platform: 'X',
    evidence: 'First-person use + public artifacts',
    date: 'Apr 2026',
    stage: 'Collect + prepare',
    summary: 'Niels Rogge used Codex Desktop and a reusable skill to create, benchmark, monitor, and repair an OCR pipeline for a large paper corpus. The code, workflow write-up, and resulting Markdown collection are public.',
    move: 'Benchmark a small sample first, record cost and quality, then scale the same checked procedure.',
    caution: 'The run cost roughly $850 and used GPUs. OCR text can still lose figures, equations, or page fidelity, so a large corpus is not automatically a trustworthy corpus.',
    links: [
      { label: 'Open the X post', href: 'https://x.com/NielsRogge/status/2041556496320700626' },
      { label: 'Read the workflow', href: 'https://huggingface.co/blog/nielsr/ocr-papers-jobs' },
      { label: 'Inspect arxiv-ocr', href: 'https://github.com/NielsRogge/arxiv-ocr' },
    ],
  },
  {
    title: 'A writer used Codex to audit a research argument paragraph by paragraph',
    platform: 'X',
    evidence: 'First-person comparison + public skill',
    date: 'Mar 2026',
    stage: 'Challenge',
    summary: 'Axton Liu gave the same article to three model roles. He reports Codex dissecting the logic chain paragraph by paragraph, while other reviewers focused on argument and editorial quality. The ai-pair skill makes the division of labor inspectable.',
    move: 'Give a fresh Codex session one narrow review job, then keep its raw findings separate from your final decision.',
    caution: 'Model agreement is not independent evidence. The project is experimental and warns that an agent may imitate a reviewer instead of actually invoking the intended tool.',
    links: [
      { label: 'Open the X post', href: 'https://x.com/AxtonLiu/status/2038753399865544778' },
      { label: 'Inspect ai-pair', href: 'https://github.com/axtonliu/ai-pair' },
    ],
  },
  {
    title: 'Open Scholar packages qualitative coding and claim checks for Codex',
    platform: 'GitHub',
    evidence: 'Active public project',
    date: 'Aug 2026 snapshot',
    stage: 'Analyze + challenge',
    summary: 'Open Scholar includes systematic review, qualitative coding, inter-coder reliability, claim-faithfulness checks, and replication packages. Its own education example is thematic coding of parent interviews about school choice.',
    move: 'Borrow one method-specific skill at a time, then keep the codebook and disagreements for a human to inspect.',
    caution: 'It began as a Claude-oriented project and uses a noncommercial academic license. Codex setup is documented, but the methods still require domain and ethics review.',
    links: [{ label: 'Inspect Open Scholar', href: 'https://github.com/joshzyj/open-scholar-skill' }],
  },
]

const researchStages = [
  {
    number: '01', title: 'Frame', icon: Question,
    help: 'Narrow the population, setting, key terms, and kind of answer you need.',
    tools: [
      { name: 'ARS-Codex', href: 'https://github.com/Imbad0202/academic-research-skills-codex' },
      { name: 'Open Scholar', href: 'https://github.com/joshzyj/open-scholar-skill' },
    ],
    artifact: 'Question + protocol',
    prompt: 'Ask me five questions that expose scope, definitions, population, context, and feasibility. Offer three research questions, but do not search until I choose one.',
    checkpoint: 'Martin chooses the question and what evidence would count. The agent does not set the purpose of the study.',
  },
  {
    number: '02', title: 'Discover', icon: MagnifyingGlass,
    help: 'Build search lanes, record queries, and gather a balanced candidate set.',
    tools: [
      { name: 'GPT Researcher', href: 'https://github.com/assafelovic/gpt-researcher' },
      { name: 'ATA', href: 'https://github.com/Agents2AgentsAI/ata' },
    ],
    artifact: 'Dated search log',
    prompt: 'Turn my question into search terms and three search lanes. Record every query and link. Label each result as candidate only until I screen it.',
    checkpoint: 'Codex can widen the net. Martin still checks database coverage, date limits, inclusion rules, and the original source.',
  },
  {
    number: '03', title: 'Organize', icon: Folders,
    help: 'Deduplicate sources, preserve stable IDs, and separate notes from interpretations.',
    tools: [
      { name: 'Zotero MCP', href: 'https://github.com/cookjohn/zotero-mcp' },
      { name: 'zotero-use', href: 'https://github.com/drguptavivek/zotero-use' },
    ],
    artifact: 'Library + source manifest',
    prompt: 'Create a source manifest with a stable key, full citation, URL or DOI, file path, screening status, and notes. Flag duplicates without deleting anything.',
    checkpoint: 'Start read-only. Keep participant data and licensed PDFs out of public repositories.',
  },
  {
    number: '04', title: 'Read', icon: BookOpenText,
    help: 'Extract methods, findings, limits, and page-aware evidence from each source.',
    tools: [
      { name: 'MarkItDown', href: 'https://github.com/microsoft/markitdown' },
      { name: 'PaperQA2', href: 'https://github.com/Future-House/paper-qa' },
    ],
    artifact: 'Page-aware source notes',
    prompt: 'For each screened paper, extract the question, context, participants, method, main result, limitation, and exact page or table locator. Mark anything you cannot locate.',
    checkpoint: 'Open the PDF and check the surrounding passage. Extraction can lose columns, tables, footnotes, or page boundaries.',
  },
  {
    number: '05', title: 'Synthesize', icon: Sparkle,
    help: 'Compare evidence by claim and method, including disagreement and missing voices.',
    tools: [
      { name: 'PaperQA2', href: 'https://github.com/Future-House/paper-qa' },
      { name: 'ARS-Codex', href: 'https://github.com/Imbad0202/academic-research-skills-codex' },
    ],
    artifact: 'Evidence matrix',
    prompt: 'Build a matrix from accepted sources only. Group rows by claim, compare methods and contexts, and show supporting, contradicting, and missing evidence separately.',
    checkpoint: 'A citation can exist and still fail to support the sentence. Inspect the claim-to-source match.',
  },
  {
    number: '06', title: 'Analyze', icon: ChartLineUp,
    help: 'Run transparent quantitative or qualitative work and preserve every decision.',
    tools: [
      { name: 'OpenAI data skills', href: 'https://github.com/openai/plugins/tree/main/plugins/data-analytics' },
      { name: 'Open Scholar', href: 'https://github.com/joshzyj/open-scholar-skill' },
    ],
    artifact: 'Notebook + codebook',
    prompt: 'Before analysis, write the plan, assumptions, diagnostics, stopping rules, and expected outputs. Run only after I approve. Keep code, results, and failures together.',
    checkpoint: 'Review privacy, consent, multiple comparisons, missing data, and interpretation with a qualified human.',
  },
  {
    number: '07', title: 'Challenge', icon: ShieldCheck,
    help: 'Use a fresh review pass to test claims, citations, methods, and blind spots.',
    tools: [
      { name: 'Open Scholar', href: 'https://github.com/joshzyj/open-scholar-skill' },
      { name: 'ARS reviewer', href: 'https://github.com/Imbad0202/academic-research-skills-codex' },
    ],
    artifact: 'Claim-risk ledger',
    prompt: 'Review this work as a skeptical education researcher. For each issue, name the affected claim, why it matters, evidence needed, and the smallest honest revision.',
    checkpoint: 'A simulated reviewer is a second pass, not an independent expert or ethics board.',
  },
  {
    number: '08', title: 'Write + share', icon: PencilSimple,
    help: 'Draft from verified artifacts, then publish a package another person can inspect.',
    tools: [
      { name: 'Quarto', href: 'https://github.com/quarto-dev/quarto-cli' },
      { name: 'GitHub', href: 'https://github.com' },
    ],
    artifact: 'Report + research log',
    prompt: 'Draft only from accepted evidence rows and analysis outputs. Add citations, uncertainty, AI-use disclosure, open questions, and instructions for rebuilding the report.',
    checkpoint: 'Martin owns the final wording. Remove private data and secrets before sharing anything publicly.',
  },
]

const sprint = [
  { time: '0-5 min', title: 'Pick one question', body: 'Write one specific, answerable question. Keep it small enough to finish.' },
  { time: '5-15 min', title: 'Gather three sources', body: 'Find one overview, one empirical study, and one useful critique.' },
  { time: '15-30 min', title: 'Build an evidence table', body: 'Record the claim, method, participants, page reference, limitation, and your take.' },
  { time: '30-45 min', title: 'Write the honest ending', body: 'Answer only as far as the evidence allows. Name what is still missing.' },
]

const repos = [
  { name: 'openai/plugins', type: 'Official catalog', proof: '5.3k stars, active Aug 2026', body: 'Official examples of how a skill can package instructions, tools, and repeatable workflows for Codex.', href: 'https://github.com/openai/plugins', icon: Code },
  { name: 'academic-research-skills-codex', type: 'Codex-native workflow', proof: '9.5k stars, active Aug 2026', body: 'Question framing, literature review, writing, peer review, and human checkpoints in one beginner-friendly suite.', href: 'https://github.com/Imbad0202/academic-research-skills-codex', icon: GraduationCap },
  { name: 'open-scholar-skill', type: 'Education + social science', proof: '134 stars, active Aug 2026', body: 'Systematic review, qualitative coding, inter-coder checks, replication packages, and claim-faithfulness review.', href: 'https://github.com/joshzyj/open-scholar-skill', icon: BookOpenText },
  { name: 'Future-House/paper-qa', type: 'Cited paper Q&A', proof: '9.1k stars, active Aug 2026', body: 'Search a screened paper collection, gather relevant passages, and answer with citations to the selected evidence.', href: 'https://github.com/Future-House/paper-qa', icon: FileText },
  { name: 'assafelovic/gpt-researcher', type: 'Discovery agent', proof: '29k stars, active Aug 2026', body: 'A web research project with a real Codex plugin and MCP skill. Useful for candidate discovery, not proof of systematic coverage.', href: 'https://github.com/assafelovic/gpt-researcher', icon: MagnifyingGlass },
  { name: 'drguptavivek/zotero-use', type: 'Research library skill', proof: 'Used by its creator in two papers', body: 'Lets Codex search a Zotero library, inspect evidence, and work with live citations while Zotero stays the source of truth.', href: 'https://github.com/drguptavivek/zotero-use', icon: GithubLogo },
]

const starterPrompt = `You are my research partner. Help me investigate this education question:

[insert your research question]

Work in eight passes and save an artifact after each one:
1. Frame the question and inclusion rules.
2. Keep a dated search log and candidate list.
3. Build a source manifest and deduplicate it.
4. Make page-aware notes from screened sources.
5. Build an evidence matrix with disagreements.
6. Plan and run analysis only after I approve it.
7. Review claims, citations, methods, and blind spots.
8. Create a research brief plus a decision log.

Do not invent sources or fill gaps with guesses. Label candidates, accepted evidence, and my interpretation separately. Pause when a human decision is needed.`

function CopyButton({ text, label, className = '' }) {
  const [copied, setCopied] = useState(false)
  async function handleCopy() {
    try {
      let copiedWithClipboard = false
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(text)
          copiedWithClipboard = true
        } catch { copiedWithClipboard = false }
      }
      if (!copiedWithClipboard) {
        const helper = document.createElement('textarea')
        helper.value = text
        helper.setAttribute('readonly', '')
        helper.style.position = 'fixed'
        helper.style.opacity = '0'
        document.body.appendChild(helper)
        helper.select()
        const copiedWithFallback = document.execCommand('copy')
        helper.remove()
        if (!copiedWithFallback) throw new Error('Copy failed')
      }
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch { setCopied(false) }
  }
  return (
    <button className={`copy-button ${className}`} type="button" onClick={handleCopy} aria-live="polite">
      {copied ? <Check weight="bold" /> : <Copy />}{copied ? 'Copied' : label}
    </button>
  )
}

function PlatformIcon({ platform }) {
  if (platform === 'Reddit') return <RedditLogo weight="fill" />
  if (platform === 'X') return <XLogo weight="fill" />
  return <GithubLogo weight="fill" />
}

function RealCases() {
  const [activeFilter, setActiveFilter] = useState('All')
  const cases = activeFilter === 'All' ? fieldCases : fieldCases.filter((item) => item.platform === activeFilter)

  return (
    <section className="section cases-section" id="real-cases" aria-labelledby="cases-title">
      <div className="cases-intro">
        <div className="section-heading">
          <p className="eyebrow">Field reports, not marketing claims</p>
          <h2 id="cases-title">How people are actually using Codex</h2>
          <p>These are firsthand posts, public workflows, and repositories you can inspect. Each case names what happened, the move worth borrowing, and what the story does not prove.</p>
        </div>
        <aside className="evidence-key">
          <span>How to read this section</span>
          <p><strong>Field report:</strong> evidence that someone tried a workflow.</p>
          <p><strong>Public repo:</strong> evidence that the workflow is inspectable.</p>
          <p><strong>Neither:</strong> proof that a research conclusion is correct.</p>
        </aside>
      </div>

      <div className="case-toolbar">
        <div className="case-filters" role="group" aria-label="Filter real cases by source">
          {caseFilters.map((filter) => (
            <button type="button" className={activeFilter === filter ? 'active' : ''} aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)} key={filter}>
              {filter}
            </button>
          ))}
        </div>
        <p>{cases.length} {cases.length === 1 ? 'case' : 'cases'} shown</p>
      </div>

      <div className="case-list" aria-live="polite">
        {cases.map((item, index) => (
          <article className={index === 0 ? 'case-card case-featured' : 'case-card'} key={item.title}>
            <div className="case-source">
              <span className={`platform-mark platform-${item.platform.toLowerCase()}`}><PlatformIcon platform={item.platform} /></span>
              <div><strong>{item.platform}</strong><span>{item.evidence}</span><span>{item.date}</span></div>
            </div>
            <div className="case-story">
              <span className="stage-chip">Stage: {item.stage}</span>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </div>
            <div className="case-learning">
              <div className="copy-this"><span>Copy this move</span><p>{item.move}</p></div>
              <div className="case-caution"><ShieldCheck /><p>{item.caution}</p></div>
              <div className="case-links">
                {item.links.map((link) => <a href={link.href} target="_blank" rel="noreferrer" key={link.href}>{link.label} <ArrowUpRight weight="bold" /></a>)}
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="cases-method">Method note: we searched Reddit, X, and GitHub for concrete actions, durable artifacts, failures, and public code. X cases required a public repository, write-up, or output for corroboration. Creator reports are labeled as such. Snapshot checked August 29, 2026.</p>
    </section>
  )
}

function ResearchStack() {
  const [openStage, setOpenStage] = useState('02')

  return (
    <section className="section stack-section" id="stage-map" aria-labelledby="stack-title">
      <div className="stack-intro">
        <div className="section-heading">
          <p className="eyebrow">A practical map for education research</p>
          <h2 id="stack-title">Build a research stack, stage by stage</h2>
          <p>Codex becomes most useful when every stage ends with something you can open, question, and hand to the next stage.</p>
        </div>
        <div className="stack-legend"><span>Click a stage</span><p>See a starter prompt and the human decision that cannot be delegated.</p></div>
      </div>

      <div className="stack-table">
        <div className="stack-columns" aria-hidden="true"><span>Stage</span><span>Codex helps</span><span>Pair it with</span><span>Keep this artifact</span><span /></div>
        {researchStages.map((stage) => {
          const Icon = stage.icon
          const isOpen = openStage === stage.number
          const panelId = `stage-panel-${stage.number}`
          return (
            <article className={isOpen ? 'stack-row is-open' : 'stack-row'} key={stage.number}>
              <button className="stack-trigger" type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpenStage(isOpen ? '' : stage.number)}>
                <span className="stack-stage"><span>{stage.number}</span><Icon /><strong>{stage.title}</strong></span>
                <span className="stack-help">{stage.help}</span>
                <span className="stack-tools">{stage.tools.map((tool) => <span key={tool.name}>{tool.name}</span>)}</span>
                <span className="stack-artifact">{stage.artifact}</span>
                <CaretDown className="stack-caret" weight="bold" />
              </button>
              <div className="stack-detail" id={panelId} hidden={!isOpen}>
                <div className="stage-prompt"><span>Starter prompt</span><p>“{stage.prompt}”</p><CopyButton text={stage.prompt} label="Copy prompt" /></div>
                <div className="stage-projects"><span>Inspect the projects</span>{stage.tools.map((tool) => <a href={tool.href} target="_blank" rel="noreferrer" key={tool.href}>{tool.name} <ArrowUpRight /></a>)}</div>
                <div className="human-decision"><ShieldCheck weight="duotone" /><div><span>Human checkpoint</span><p>{stage.checkpoint}</p></div></div>
              </div>
            </article>
          )
        })}
      </div>

      <div className="stack-footer">
        <div className="human-rail">
          <span>Martin stays in charge of</span>
          <div><strong>Question</strong><strong>Inclusion rules</strong><strong>Privacy + method</strong><strong>Final claim</strong></div>
        </div>
        <aside className="starter-stack">
          <span>Start small</span>
          <h3>Martin's first research stack</h3>
          <ol><li><strong>ARS-Codex</strong> for the question and checkpoints</li><li><strong>Zotero</strong> as the source-of-truth library</li><li><strong>PaperQA2</strong> only after screening the papers</li><li><strong>GitHub or Quarto</strong> for the durable report</li></ol>
          <p>Install one top-level workflow first. More agents do not automatically mean better research.</p>
        </aside>
      </div>
    </section>
  )
}

function Header({ theme, toggleTheme }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return (
    <header className="site-header">
      <a className="brand" href="#top" onClick={close}>Martin's Field Guide</a>
      <nav className={open ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation">
        <a href="#loop" onClick={close}>Research loop</a>
        <a href="#real-cases" onClick={close}>Real cases</a>
        <a href="#stage-map" onClick={close}>Stage map</a>
        <a href="#prompt-lab" onClick={close}>Prompt lab</a>
        <a className="nav-cta" href="#sprint" onClick={close}>Start the 45-minute sprint</a>
      </nav>
      <div className="header-actions">
        <button className="icon-button" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
          {theme === 'light' ? <Moon /> : <Sun />}
        </button>
        <button className="icon-button menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation" aria-expanded={open}>
          {open ? <X /> : <List />}
        </button>
      </div>
    </header>
  )
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('martin-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
  const [activePrompt, setActivePrompt] = useState('Question')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('martin-theme', theme)
  }, [theme])
  const prompt = prompts[activePrompt]

  return (
    <div className="app-shell" id="top">
      <Header theme={theme} toggleTheme={() => setTheme((value) => value === 'light' ? 'dark' : 'light')} />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy reveal">
            <h1 id="hero-title"><span>Martin,</span><span>research is a</span><span>trail of evidence.</span></h1>
            <p>ChatGPT helps you think. Codex helps you leave a clear, checkable trail of what you learned.</p>
            <div className="hero-actions">
              <a className="primary-button" href="#sprint">Start the 45-minute sprint <ArrowRight weight="bold" /></a>
              <a className="text-link" href="#loop">See the research loop</a>
            </div>
          </div>
          <figure className="hero-media reveal reveal-late">
            <img src="/images/research-desk.jpg" alt="Annotated research papers, a notebook, coffee, and a blue pencil on a wooden desk" fetchPriority="high" />
          </figure>
        </section>

        <section className="section difference-section" id="difference" aria-labelledby="difference-title">
          <div className="section-heading"><h2 id="difference-title">Same brain, different workspace</h2><p>Use both. Pick the surface that matches what you need next.</p></div>
          <div className="difference-grid">
            <article>
              <div className="difference-icon"><Clipboard /></div><h3>ChatGPT</h3><p className="role">Your thinking partner</p>
              <p>Best when you want to ask, explore, explain, compare, and refine ideas through conversation.</p>
              <ul><li>Clarify a topic</li><li>Understand a difficult paper</li><li>Compare arguments</li><li>Practice explaining an idea</li></ul>
            </article>
            <article>
              <div className="difference-icon"><Code /></div><h3>Codex</h3><p className="role">Your evidence workspace</p>
              <p>Best when the work should become files, tables, diagrams, datasets, websites, or a repeatable process.</p>
              <ul><li>Organize a research folder</li><li>Extract evidence from sources</li><li>Check a dataset or draft</li><li>Build a durable artifact</li></ul>
            </article>
          </div>
          <aside className="plain-note"><strong>The useful shift:</strong> do not ask only for an answer. Ask for the evidence trail and the file you can review later.</aside>
        </section>

        <section className="section loop-section" id="loop" aria-labelledby="loop-title">
          <div className="section-heading"><h2 id="loop-title">A research loop you can trust</h2><p>Good research is not a straight line. Return to the question whenever the evidence changes your view.</p></div>
          <div className="loop-track">
            {researchLoop.map(({ title, body, icon: Icon }, index) => (
              <article className="loop-item" key={title} style={{ '--item-index': index }}><div className="loop-marker"><Icon /></div><div><h3>{title}</h3><p>{body}</p></div></article>
            ))}
          </div>
          <p className="source-note">This loop adapts OpenAI's current guidance for learning from dense source material: preserve uncertainty, cite the source, inspect evidence, and leave a reusable report.</p>
        </section>

        <RealCases />

        <ResearchStack />

        <section className="prompt-section" id="prompt-lab" aria-labelledby="prompt-title">
          <div className="prompt-heading"><h2 id="prompt-title">Prompt Lab</h2><p>Choose the research move you need. Copy the prompt, then make the topic yours.</p></div>
          <div className="prompt-tabs" role="tablist" aria-label="Research prompt stages">
            {Object.keys(prompts).map((name) => <button type="button" role="tab" aria-selected={activePrompt === name} className={activePrompt === name ? 'active' : ''} onClick={() => setActivePrompt(name)} key={name}>{name}</button>)}
          </div>
          <div className="prompt-workbench">
            <div className="prompt-editor"><div className="prompt-editor-bar"><span>{activePrompt.toLowerCase()}-prompt.txt</span><CopyButton text={prompt.text} label="Copy prompt" /></div><pre>{prompt.text}</pre></div>
            <aside className="why-panel"><h3>Why this works</h3><p>{prompt.summary}</p><ul>{prompt.reasons.map((reason) => <li key={reason}><Check weight="bold" /> {reason}</li>)}</ul><p className="try-note">A good prompt is a brief. It names the goal, the evidence bar, the output, and where the model must be cautious.</p></aside>
          </div>
        </section>

        <section className="section sprint-section" id="sprint" aria-labelledby="sprint-title">
          <div className="section-heading"><h2 id="sprint-title">Your first 45-minute sprint</h2><p>Try the loop once with a small education question. Finishing teaches more than planning the perfect system.</p></div>
          <div className="sprint-layout">
            <div className="sprint-list">{sprint.map((item) => <article key={item.time}><span>{item.time}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
            <figure className="sprint-image"><img src="/images/evidence-matrix.jpg" alt="An open research notebook with an evidence matrix beside annotated education papers" loading="lazy" /></figure>
          </div>
        </section>

        <section className="section github-section" id="github-kit" aria-labelledby="github-title">
          <div className="section-heading"><p className="eyebrow">Project records</p><h2 id="github-title">GitHub is a library of working methods</h2><p>You do not need to code these projects yourself. Ask Codex to inspect, explain, compare, or adapt them. Activity is a snapshot, and stars show adoption, not research validity.</p></div>
          <div className="repo-grid">
            {repos.map(({ name, type, proof, body, href, icon: Icon }, index) => <article className={`repo-card repo-${index + 1}`} key={name}><div className="repo-icon"><Icon /></div><span>{type}</span><h3>{name}</h3><p>{body}</p><small>{proof}</small><a href={href} target="_blank" rel="noreferrer">View on GitHub <ArrowUpRight weight="bold" /></a></article>)}
          </div>
          <aside className="safety-note"><Scales weight="duotone" /><div><strong>Inspect the README, license, and permissions before you install anything.</strong><p>Then ask Codex: “Explain what this project does, what it can access, how active it is, and whether I need it for my goal.”</p></div></aside>
        </section>

        <section className="section habits-section" aria-labelledby="habits-title">
          <div className="habits-copy">
            <h2 id="habits-title">Good research habits still win</h2><p>Tools can accelerate the work. They cannot take responsibility for the claim.</p>
            <div className="habits-list">
              <div><MagnifyingGlass /><span><strong>Ask for sources</strong>Make every important claim traceable.</span></div>
              <div><Scales /><span><strong>Separate claim and interpretation</strong>Show what the source says, then what you think.</span></div>
              <div><FileText /><span><strong>Check the original</strong>Open the paper. Read beyond the abstract.</span></div>
              <div><Question /><span><strong>Write down uncertainty</strong>“I do not know yet” is useful research data.</span></div>
              <div><BookOpenText /><span><strong>Let the human decide</strong>You choose the question, standard, and final wording.</span></div>
            </div>
          </div>
          <div className="starter-panel"><h3>Martin's starter prompt</h3><pre>{starterPrompt}</pre><CopyButton text={starterPrompt} label="Copy starter prompt" className="starter-copy" /></div>
        </section>

        <section className="section sources-section" aria-labelledby="sources-title">
          <div className="section-heading"><h2 id="sources-title">Read the trail behind this guide</h2><p>The research log names the search method, every selected field report, project documentation, and the limits of this evidence.</p></div>
          <div className="source-links">
            <a href="https://github.com/NBrangerF/martins-research-field-guide/blob/main/RESEARCH_EVIDENCE.md" target="_blank" rel="noreferrer">Full evidence log <ArrowUpRight /></a>
            <a href="https://www.reddit.com/r/RStudio/comments/1rus9vj/i_gave_claude_code_codex_shared_access_to_a/" target="_blank" rel="noreferrer">Failure case: RStudio analysis <ArrowUpRight /></a>
            <a href="https://github.com/joshzyj/open-scholar-skill" target="_blank" rel="noreferrer">Education fit: Open Scholar <ArrowUpRight /></a>
            <a href="https://learn.chatgpt.com/use-cases/learn-a-new-concept" target="_blank" rel="noreferrer">OpenAI: Learn a new concept <ArrowUpRight /></a>
            <a href="https://learn.chatgpt.com/docs/build-skills" target="_blank" rel="noreferrer">OpenAI: Build skills <ArrowUpRight /></a>
            <a href="https://github.com/openai/plugins" target="_blank" rel="noreferrer">OpenAI: Plugin examples <ArrowUpRight /></a>
          </div>
        </section>
      </main>
      <footer><div><strong>Martin's Research Field Guide</strong><p>Built as a field guide, not a rulebook.</p></div><a href="#top">Back to top <ArrowRight /></a></footer>
    </div>
  )
}

export default App
