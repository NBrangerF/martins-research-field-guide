import { useEffect, useState } from 'react'
import {
  ArrowRight, ArrowUpRight, BookOpenText, Check, Clipboard, Code, Copy,
  FileText, GithubLogo, List, MagnifyingGlass, Moon, Question, Scales,
  Sparkle, Sun, X,
} from '@phosphor-icons/react'

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

const sprint = [
  { time: '0-5 min', title: 'Pick one question', body: 'Write one specific, answerable question. Keep it small enough to finish.' },
  { time: '5-15 min', title: 'Gather three sources', body: 'Find one overview, one empirical study, and one useful critique.' },
  { time: '15-30 min', title: 'Build an evidence table', body: 'Record the claim, method, participants, page reference, limitation, and your take.' },
  { time: '30-45 min', title: 'Write the honest ending', body: 'Answer only as far as the evidence allows. Name what is still missing.' },
]

const repos = [
  { name: 'openai/plugins', type: 'Official examples', body: 'See how reusable Codex plugins package skills, tools, and practical workflows.', href: 'https://github.com/openai/plugins', icon: Code },
  { name: 'Imbad0202/academic-research-skills-codex', type: 'Research workflow', body: 'A Codex-native suite for literature reviews, paper planning, review, and research checkpoints.', href: 'https://github.com/Imbad0202/academic-research-skills-codex', icon: BookOpenText },
  { name: 'Future-House/paper-qa', type: 'Paper question answering', body: 'A technical open-source project for asking questions across scientific documents with citations.', href: 'https://github.com/Future-House/paper-qa', icon: FileText },
  { name: 'drxaibi/zotero-mcp', type: 'Library connection', body: 'Connect an AI workflow to Zotero metadata, notes, annotations, and full-text PDFs.', href: 'https://github.com/drxaibi/zotero-mcp', icon: GithubLogo },
]

const starterPrompt = `You are my research partner. Help me investigate this education question:

[insert your research question]

Work in five passes:
1. Help me make the question specific and researchable.
2. Find a small, balanced set of credible sources. Verify every citation.
3. Build an evidence table with claim, method, participants, finding, limitation, and page reference.
4. Test the strongest conclusion as a skeptical reviewer.
5. Create a research brief that separates source claims, my interpretation, uncertainty, and next questions.

Do not invent sources or fill gaps with guesses. Pause when a human decision is needed.`

function CopyButton({ text, label, className = '' }) {
  const [copied, setCopied] = useState(false)
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
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

function Header({ theme, toggleTheme }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return (
    <header className="site-header">
      <a className="brand" href="#top" onClick={close}>Martin's Field Guide</a>
      <nav className={open ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation">
        <a href="#difference" onClick={close}>The difference</a>
        <a href="#loop" onClick={close}>Research loop</a>
        <a href="#prompt-lab" onClick={close}>Prompt lab</a>
        <a href="#github-kit" onClick={close}>GitHub kit</a>
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
          <div className="section-heading"><h2 id="github-title">GitHub is a library of working methods</h2><p>You do not need to code these projects yourself. Ask Codex to inspect, explain, compare, or adapt them.</p></div>
          <div className="repo-grid">
            {repos.map(({ name, type, body, href, icon: Icon }, index) => <article className={`repo-card repo-${index + 1}`} key={name}><div className="repo-icon"><Icon /></div><span>{type}</span><h3>{name}</h3><p>{body}</p><a href={href} target="_blank" rel="noreferrer">View on GitHub <ArrowUpRight weight="bold" /></a></article>)}
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
          <div className="section-heading"><h2 id="sources-title">Read the trail behind this guide</h2><p>The field guide is based on current OpenAI guidance and the repository documentation linked above.</p></div>
          <div className="source-links">
            <a href="https://learn.chatgpt.com/use-cases/learn-a-new-concept" target="_blank" rel="noreferrer">OpenAI: Learn a new concept <ArrowUpRight /></a>
            <a href="https://learn.chatgpt.com/docs/build-skills" target="_blank" rel="noreferrer">OpenAI: Build skills <ArrowUpRight /></a>
            <a href="https://learn.chatgpt.com/use-cases" target="_blank" rel="noreferrer">OpenAI: ChatGPT use cases <ArrowUpRight /></a>
          </div>
        </section>
      </main>
      <footer><div><strong>Martin's Research Field Guide</strong><p>Built as a field guide, not a rulebook.</p></div><a href="#top">Back to top <ArrowRight /></a></footer>
    </div>
  )
}

export default App
